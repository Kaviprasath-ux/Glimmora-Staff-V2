import { useState, useEffect } from 'react';
import { roomsAssigned as initialRooms } from '../../data/roomsAssigned';
import RoomCard from '../../components/rooms/RoomCard';
import { useStaffNotifications } from '../../context/StaffNotificationsContext';

const Rooms = () => {
  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem('glimmora_staff_rooms');
    return savedRooms ? JSON.parse(savedRooms) : initialRooms;
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const { addNotification } = useStaffNotifications();

  useEffect(() => {
    localStorage.setItem('glimmora_staff_rooms', JSON.stringify(rooms));
  }, [rooms]);

  const handleStatusChange = (roomId, newStatus) => {
    setRooms(prev =>
      prev.map(room => {
        if (room.id === roomId) {
          const updatedRoom = {
            ...room,
            status: newStatus,
          };

          if (newStatus === 'in_progress') {
            updatedRoom.startedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
            addNotification({
              type: 'room',
              title: 'Cleaning Started',
              message: `You started cleaning Room ${room.roomNumber}`,
              priority: 'medium',
            });
          } else if (newStatus === 'clean') {
            updatedRoom.completedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
            updatedRoom.cleaningChecklist = updatedRoom.cleaningChecklist.map(item => ({
              ...item,
              completed: true,
            }));
            addNotification({
              type: 'room',
              title: 'Room Cleaned',
              message: `Room ${room.roomNumber} has been marked as clean`,
              priority: 'high',
            });
          }

          return updatedRoom;
        }
        return room;
      })
    );
  };

  const handleChecklistUpdate = (roomId, checklistId, completed) => {
    setRooms(prev =>
      prev.map(room =>
        room.id === roomId
          ? {
              ...room,
              cleaningChecklist: room.cleaningChecklist.map(item =>
                item.id === checklistId ? { ...item, completed } : item
              ),
            }
          : room
      )
    );
  };

  const filteredRooms = filterStatus === 'all'
    ? rooms
    : rooms.filter(room => room.status === filterStatus);

  const stats = {
    total: rooms.length,
    dirty: rooms.filter(r => r.status === 'dirty').length,
    inProgress: rooms.filter(r => r.status === 'in_progress').length,
    clean: rooms.filter(r => r.status === 'clean').length,
  };

  const statusOptions = [
    { value: 'all', label: 'All Rooms', count: stats.total },
    { value: 'dirty', label: 'Dirty', count: stats.dirty },
    { value: 'in_progress', label: 'In Progress', count: stats.inProgress },
    { value: 'clean', label: 'Clean', count: stats.clean },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Rooms</h1>
          <p className="text-neutral-600">{stats.total} rooms assigned</p>
        </div>
        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filterStatus === option.value
                  ? 'bg-deepgreen text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-neutral-900">{stats.total}</div>
          <div className="text-sm text-neutral-600 mt-1">Total</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gold">{stats.dirty}</div>
          <div className="text-sm text-neutral-600 mt-1">Dirty</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-teal">{stats.inProgress}</div>
          <div className="text-sm text-neutral-600 mt-1">In Progress</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-deepgreen">{stats.clean}</div>
          <div className="text-sm text-neutral-600 mt-1">Clean</div>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No rooms found</h3>
          <p className="text-neutral-600">
            No {filterStatus === 'all' ? '' : filterStatus} rooms assigned
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onStatusChange={handleStatusChange}
              onChecklistUpdate={handleChecklistUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
