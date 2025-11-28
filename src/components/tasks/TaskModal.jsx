import { useState, useEffect } from 'react';
import { useStaffRooms } from '../../context/StaffRoomsContext';
import { useAuth } from '../../context/AuthContext';

function generateChecklistId() {
  return `checklist-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export default function TaskModal({ isOpen, onClose, onSubmit, task = null, mode = 'add' }) {
  const { rooms } = useStaffRooms();
  const { staff } = useAuth();
  const role = staff?.role || 'housekeeping';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    room: '',
    priority: 'medium',
    dueTime: '12:00',
    checklist: [],
    issueCategory: '',
    estimatedTime: '',
    pickupLocation: '',
    deliveryLocation: '',
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        room: task.room || '',
        priority: task.priority || 'medium',
        dueTime: task.dueTime || '12:00',
        checklist: task.checklist || [],
        issueCategory: task.issueCategory || '',
        estimatedTime: task.estimatedTime || '',
        pickupLocation: task.pickupLocation || '',
        deliveryLocation: task.deliveryLocation || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        room: '',
        priority: 'medium',
        dueTime: '12:00',
        checklist: [],
        issueCategory: '',
        estimatedTime: '',
        pickupLocation: '',
        deliveryLocation: '',
      });
    }
    setNewChecklistItem('');
  }, [task, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData(prev => ({
        ...prev,
        checklist: [
          ...prev.checklist,
          { id: generateChecklistId(), label: newChecklistItem.trim(), completed: false },
        ],
      }));
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== itemId),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit({
      ...formData,
      ...(task?.id && { id: task.id }),
    });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.name === 'newChecklistItem') {
      e.preventDefault();
      addChecklistItem();
    }
  };

  if (!isOpen) return null;

  const isHousekeeping = role === 'housekeeping';
  const isMaintenance = role === 'maintenance';
  const isRunner = role === 'runner';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#4E5840]">
              {mode === 'edit' ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-[#6B6F63] hover:text-[#4E5840] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865] resize-none"
              placeholder="Enter task description"
            />
          </div>

          {/* Room (for housekeeping and optionally maintenance) */}
          {(isHousekeeping || isMaintenance) && (
            <div>
              <label className="block text-sm font-medium text-[#4E5840] mb-1">
                Room {isHousekeeping && <span className="text-red-500">*</span>}
              </label>
              <select
                name="room"
                value={formData.room}
                onChange={handleChange}
                required={isHousekeeping}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.number}>
                    Room {room.number} - {room.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Maintenance specific fields */}
          {isMaintenance && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#4E5840] mb-1">
                  Issue Category
                </label>
                <select
                  name="issueCategory"
                  value={formData.issueCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
                >
                  <option value="">Select category</option>
                  <option value="AC">AC</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4E5840] mb-1">
                  Estimated Time
                </label>
                <input
                  type="text"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
                  placeholder="e.g., 30 mins, 1 hour"
                />
              </div>
            </>
          )}

          {/* Runner specific fields */}
          {isRunner && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#4E5840] mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
                  placeholder="Enter pickup location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4E5840] mb-1">
                  Delivery Location
                </label>
                <input
                  type="text"
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
                  placeholder="Enter delivery location"
                />
              </div>
            </>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">
              Priority
            </label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority }))}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                    formData.priority === priority
                      ? priority === 'high'
                        ? 'bg-[#D9534F] text-white'
                        : priority === 'medium'
                        ? 'bg-[#CDB261] text-white'
                        : 'bg-[#5C9BA4] text-white'
                      : 'bg-neutral-100 text-[#6B6F63] hover:bg-neutral-200'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Due Time */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">
              Due Time
            </label>
            <input
              type="time"
              name="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
            />
          </div>

          {/* Checklist Builder */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">
              Checklist
            </label>
            {formData.checklist.length > 0 && (
              <ul className="space-y-2 mb-3">
                {formData.checklist.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg"
                  >
                    <span className="text-sm text-[#4E5840]">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                name="newChecklistItem"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
                placeholder="Add checklist item"
              />
              <button
                type="button"
                onClick={addChecklistItem}
                disabled={!newChecklistItem.trim()}
                className="px-3 py-2 text-sm font-medium text-[#A57865] border border-[#A57865] rounded-lg hover:bg-[#A57865]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-neutral-200">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
              >
                {mode === 'edit' ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
