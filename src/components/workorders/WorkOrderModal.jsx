import { useState, useEffect } from 'react';
import { useStaffRooms } from '../../context/StaffRoomsContext';
import { useAuth } from '../../context/AuthContext';
import { technicians, categories, priorities } from '../../data/workOrders';

function generateChecklistId() {
  return `cl-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export default function WorkOrderModal({ isOpen, onClose, onSubmit, order = null, mode = 'add' }) {
  const { rooms } = useStaffRooms();
  const { staff } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    room: '',
    category: 'General',
    priority: 'medium',
    assignedTo: '',
    checklist: [],
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    if (order && mode === 'edit') {
      setFormData({
        title: order.title || '',
        description: order.description || '',
        room: order.room || '',
        category: order.category || 'General',
        priority: order.priority || 'medium',
        assignedTo: order.assignedTo || '',
        checklist: order.checklist || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        room: '',
        category: 'General',
        priority: 'medium',
        assignedTo: '',
        checklist: [],
      });
    }
    setNewChecklistItem('');
  }, [order, mode, isOpen]);

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
      reportedBy: staff?.id || null,
      ...(order?.id && { id: order.id }),
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

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600 border-gray-200',
    medium: 'bg-[#5C9BA4]/15 text-[#5C9BA4] border-[#5C9BA4]',
    high: 'bg-[#CDB261]/20 text-[#CDB261] border-[#CDB261]',
    critical: 'bg-red-100 text-red-600 border-red-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#4E5840]">
              {mode === 'edit' ? 'Edit Work Order' : 'New Work Order'}
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
              placeholder="Brief description of the issue"
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
              placeholder="Detailed description of the issue..."
            />
          </div>

          {/* Room */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">
              Room
            </label>
            <select
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
            >
              <option value="">Select a room (optional)</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.number}>
                  Room {room.number}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority }))}
                  className={`px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors border ${
                    formData.priority === priority
                      ? priorityColors[priority]
                      : 'bg-white border-neutral-200 text-[#6B6F63] hover:bg-neutral-50'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Assign Technician */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">
              Assign Technician
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
            >
              <option value="">Unassigned</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
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
                {mode === 'edit' ? 'Save Changes' : 'Create Work Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
