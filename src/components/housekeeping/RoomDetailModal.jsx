import { useState } from 'react';
import CleaningTimer from './CleaningTimer';
import AmenitiesEditor from './AmenitiesEditor';
import MinibarEditor from './MinibarEditor';

const statusStyles = {
  dirty: 'bg-red-100 text-red-600',
  inprogress: 'bg-[#CDB261]/20 text-[#CDB261]',
  clean: 'bg-green-100 text-green-600',
  inspected: 'bg-[#5C9BA4]/20 text-[#5C9BA4]',
  out_of_service: 'bg-gray-100 text-gray-600',
};

const statusLabels = {
  dirty: 'Dirty',
  inprogress: 'In Progress',
  clean: 'Clean',
  inspected: 'Inspected',
  out_of_service: 'Out of Service',
};

const priorityStyles = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-[#5C9BA4]/15 text-[#5C9BA4]',
  high: 'bg-[#CDB261]/20 text-[#CDB261]',
  urgent: 'bg-red-100 text-red-600',
};

export default function RoomDetailModal({
  room,
  staff,
  onClose,
  onAssign,
  onStartCleaning,
  onPauseCleaning,
  onResumeCleaning,
  onFinishCleaning,
  onMarkInspected,
  onMarkDirty,
  onToggleChecklist,
  onUpdateAmenities,
  onUpdateMinibar,
  onAddNote,
  onRemoveNote, // FIX HK-M04: Add delete note prop
  onToggleVIP,
  calculateEfficiency,
}) {
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState('checklist');

  if (!room) return null;

  const efficiency = calculateEfficiency ? calculateEfficiency(room.id) : null;
  const assignedStaff = staff?.find(s => s.id === room.assignedTo);
  const completedChecklist = room.checklist.filter(item => item.completed).length;

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(room.id, newNote.trim());
      setNewNote('');
    }
  };

  const tabs = [
    { id: 'checklist', label: 'Checklist' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'minibar', label: 'Minibar' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-[#4E5840]">Room {room.roomNumber}</h2>
                {room.vip && (
                  <button
                    onClick={() => onToggleVIP(room.id)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#CDB261]/20 text-[#CDB261] text-xs font-medium"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    VIP
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B6F63]">
                <span>{room.type}</span>
                <span>•</span>
                <span>Floor {room.floor}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#6B6F63] hover:text-[#4E5840] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status & Priority */}
          <div className="flex items-center gap-2 mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[room.status]}`}>
              {statusLabels[room.status]}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityStyles[room.priority]}`}>
              {room.priority} Priority
            </span>
            {efficiency !== null && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#4E5840]/10 text-[#4E5840]">
                {efficiency}% Efficiency
              </span>
            )}
          </div>
        </div>

        {/* Timer & Assignment Row */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {room.status === 'inprogress' && (
              <CleaningTimer
                startedAt={room.startedAt}
                estimatedMinutes={room.estimatedTimeMinutes}
                isPaused={!!room.pausedAt}
                size="md"
              />
            )}
            <div>
              <p className="text-xs text-[#6B6F63]">Assigned to</p>
              {assignedStaff ? (
                <p className="text-sm font-medium text-[#4E5840]">{assignedStaff.name}</p>
              ) : (
                <select
                  onChange={(e) => onAssign(room.id, e.target.value)}
                  className="text-sm border border-neutral-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#A57865]/30"
                  defaultValue=""
                >
                  <option value="" disabled>Assign staff</option>
                  {staff?.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {room.status === 'dirty' && room.assignedTo && (
              <button
                onClick={() => onStartCleaning(room.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
              >
                Start Cleaning
              </button>
            )}
            {room.status === 'inprogress' && !room.pausedAt && (
              <>
                <button
                  onClick={() => onPauseCleaning(room.id)}
                  className="px-3 py-2 text-sm font-medium text-[#CDB261] border border-[#CDB261] rounded-lg hover:bg-[#CDB261]/10 transition-colors"
                >
                  Pause
                </button>
                <button
                  onClick={() => onFinishCleaning(room.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#5C9BA4] rounded-lg hover:bg-[#4A8A94] transition-colors"
                >
                  Finish
                </button>
              </>
            )}
            {room.status === 'inprogress' && room.pausedAt && (
              <button
                onClick={() => onResumeCleaning(room.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
              >
                Resume
              </button>
            )}
            {room.status === 'clean' && (
              <button
                onClick={() => onMarkInspected(room.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#4E5840] rounded-lg hover:bg-[#3E4830] transition-colors"
              >
                Mark Inspected
              </button>
            )}
            {room.status === 'inspected' && (
              <button
                onClick={() => onMarkDirty(room.id)}
                className="px-4 py-2 text-sm font-medium text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Mark Dirty
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 border-b border-neutral-100">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white border border-b-0 border-neutral-200 text-[#4E5840]'
                    : 'text-[#6B6F63] hover:text-[#4E5840]'
                }`}
              >
                {tab.label}
                {tab.id === 'checklist' && (
                  <span className="ml-1 text-xs">({completedChecklist}/{room.checklist.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'checklist' && (
            <div className="space-y-2">
              {room.checklist.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50"
                >
                  <button
                    onClick={() => onToggleChecklist(room.id, item.id)}
                    disabled={room.status === 'inspected'}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      item.completed
                        ? 'bg-[#5C9BA4] border-[#5C9BA4]'
                        : 'border-neutral-300 hover:border-[#5C9BA4]'
                    } ${room.status === 'inspected' ? 'opacity-50' : ''}`}
                  >
                    {item.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-sm ${item.completed ? 'text-[#6B6F63] line-through' : 'text-[#4E5840]'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'amenities' && (
            <AmenitiesEditor
              amenities={room.amenities}
              roomId={room.id}
              onUpdate={onUpdateAmenities}
              disabled={room.status === 'inspected'}
            />
          )}

          {activeTab === 'minibar' && (
            <MinibarEditor
              items={room.minibarItems}
              roomId={room.id}
              onUpdate={onUpdateMinibar}
              disabled={room.status === 'inspected'}
            />
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
              {room.notes.length === 0 ? (
                <p className="text-sm text-[#6B6F63] italic">No notes</p>
              ) : (
                <div className="space-y-2">
                  {room.notes.map(note => (
                    <div key={note.id} className="p-3 bg-neutral-50 rounded-lg flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-[#4E5840]">{note.text}</p>
                        <p className="text-xs text-[#6B6F63] mt-1">
                          {new Date(note.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {/* FIX HK-M04: Delete note button */}
                      {onRemoveNote && (
                        <button
                          onClick={() => onRemoveNote(room.id, note.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                          title="Delete note"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
