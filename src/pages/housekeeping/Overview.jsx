import { useState, useMemo, useEffect } from 'react';
import { useHousekeeping } from '../../context/HousekeepingContext';
import { useStaffNotifications } from '../../context/StaffNotificationsContext';
import HousekeepingKPIBar from '../../components/housekeeping/HousekeepingKPIBar';
import FloorHeatmap from '../../components/housekeeping/FloorHeatmap';
import LiveCleaningFeed from '../../components/housekeeping/LiveCleaningFeed';
import StaffEfficiencyCard from '../../components/housekeeping/StaffEfficiencyCard';
import DeepCleanAlert from '../../components/housekeeping/DeepCleanAlert';
import RoomDetailModal from '../../components/housekeeping/RoomDetailModal';

export default function HousekeepingOverview() {
  const {
    rooms,
    housekeepingStaff,
    getHousekeepingKPIs,
    getActiveCleanings,
    getDeepCleanAlerts,
    getFloors,
    assignRoom,
    startCleaning,
    pauseCleaning,
    resumeCleaning,
    finishCleaning,
    markAsInspected,
    markAsDirty,
    completeChecklistItem,
    updateAmenities,
    updateMinibarItem,
    addNote,
    removeNote, // FIX HK-M04: Import removeNote for delete functionality
    toggleVIP,
    resetDeepCleanDate,
    autoAssignRooms,
    generateDeepCleanSchedule,
    calculateRoomEfficiency,
  } = useHousekeeping();

  const { addNotification } = useStaffNotifications();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAutoAssignConfirm, setShowAutoAssignConfirm] = useState(false);

  const kpis = useMemo(() => getHousekeepingKPIs(), [getHousekeepingKPIs]);
  const activeCleanings = useMemo(() => getActiveCleanings(), [getActiveCleanings]);
  const deepCleanAlerts = useMemo(() => getDeepCleanAlerts(), [getDeepCleanAlerts]);
  const floors = useMemo(() => getFloors(), [getFloors]);

  useEffect(() => {
    const overdueRooms = generateDeepCleanSchedule();
    if (overdueRooms.length > 0 && addNotification) {
      addNotification({
        type: 'housekeeping',
        title: 'Deep Clean Alert',
        message: `${overdueRooms.length} rooms require deep cleaning`,
      });
    }
  }, []);

  const handleStartCleaning = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    startCleaning(roomId);
    if (addNotification) {
      addNotification({
        type: 'housekeeping',
        title: 'Cleaning Started',
        message: `Cleaning started for Room ${room?.roomNumber}`,
      });
    }
  };

  const handlePauseCleaning = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    pauseCleaning(roomId);
    if (addNotification) {
      addNotification({
        type: 'housekeeping',
        title: 'Cleaning Paused',
        message: `Cleaning paused for Room ${room?.roomNumber}`,
      });
    }
  };

  const handleFinishCleaning = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    finishCleaning(roomId);
    if (addNotification) {
      addNotification({
        type: 'housekeeping',
        title: 'Cleaning Completed',
        message: `Room ${room?.roomNumber} cleaning completed`,
      });
    }
    setSelectedRoom(null);
  };

  const handleMarkInspected = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    markAsInspected(roomId);
    if (addNotification) {
      addNotification({
        type: 'housekeeping',
        title: 'Room Inspected',
        message: `Room ${room?.roomNumber} has been inspected`,
      });
    }
    setSelectedRoom(null);
  };

  const handleAssignRoom = (roomId, staffId) => {
    const room = rooms.find(r => r.id === roomId);
    const staff = housekeepingStaff.find(s => s.id === staffId);
    assignRoom(roomId, staffId);
    if (addNotification && room?.vip) {
      addNotification({
        type: 'housekeeping',
        title: 'VIP Room Assigned',
        message: `VIP Room ${room.roomNumber} assigned to ${staff?.name}`,
      });
    }
  };

  const handleAutoAssign = () => {
    const assignments = autoAssignRooms();
    setShowAutoAssignConfirm(false);
    if (addNotification && assignments.length > 0) {
      addNotification({
        type: 'housekeeping',
        title: 'Auto-Assign Complete',
        message: `${assignments.length} rooms automatically assigned to staff`,
      });
    }
  };

  const handleDeepCleanComplete = (roomId) => {
    resetDeepCleanDate(roomId);
    const room = rooms.find(r => r.id === roomId);
    if (addNotification) {
      addNotification({
        type: 'housekeeping',
        title: 'Deep Clean Completed',
        message: `Deep clean for Room ${room?.roomNumber} marked complete`,
      });
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4E5840]">Housekeeping Dashboard</h1>
          <p className="text-sm text-[#6B6F63] mt-1">
            Real-time room status and cleaning operations
          </p>
        </div>
        <button
          onClick={() => setShowAutoAssignConfirm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Auto-Assign Rooms
        </button>
      </div>

      {/* KPI Bar */}
      <HousekeepingKPIBar kpis={kpis} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Floor Map & Live Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Floor Heatmap */}
          <FloorHeatmap
            rooms={rooms}
            floors={floors}
            onRoomClick={handleRoomClick}
          />

          {/* Live Cleaning Feed */}
          <LiveCleaningFeed activeCleanings={activeCleanings} />
        </div>

        {/* Right Column - Staff & Alerts */}
        <div className="space-y-6">
          {/* Staff Efficiency */}
          <StaffEfficiencyCard compact />

          {/* Deep Clean Alerts */}
          <DeepCleanAlert
            alerts={deepCleanAlerts}
            onMarkComplete={handleDeepCleanComplete}
          />
        </div>
      </div>

      {/* Full Staff Table */}
      <StaffEfficiencyCard />

      {/* Room Detail Modal */}
      {selectedRoom && (
        <RoomDetailModal
          room={rooms.find(r => r.id === selectedRoom.id)}
          staff={housekeepingStaff}
          onClose={() => setSelectedRoom(null)}
          onAssign={handleAssignRoom}
          onStartCleaning={handleStartCleaning}
          onPauseCleaning={handlePauseCleaning}
          onResumeCleaning={resumeCleaning}
          onFinishCleaning={handleFinishCleaning}
          onMarkInspected={handleMarkInspected}
          onMarkDirty={markAsDirty}
          onToggleChecklist={completeChecklistItem}
          onUpdateAmenities={updateAmenities}
          onUpdateMinibar={updateMinibarItem}
          onAddNote={addNote}
          onRemoveNote={removeNote}
          onToggleVIP={toggleVIP}
          calculateEfficiency={calculateRoomEfficiency}
        />
      )}

      {/* Auto-Assign Confirmation Modal */}
      {showAutoAssignConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[#4E5840] mb-2">
              Auto-Assign Rooms
            </h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              This will automatically assign all unassigned dirty rooms to available staff based on efficiency and workload.
            </p>
            <div className="text-sm text-[#6B6F63] mb-4">
              <p>• VIP rooms will be prioritized</p>
              <p>• High-efficiency staff get priority assignments</p>
              <p>• Max 10 rooms per staff member</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAutoAssignConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAutoAssign}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554]"
              >
                Assign Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
