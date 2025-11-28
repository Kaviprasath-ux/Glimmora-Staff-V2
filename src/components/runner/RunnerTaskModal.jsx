import { useState, useEffect } from 'react';

export default function RunnerTaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    type: 'delivery',
    title: '',
    description: '',
    room: '',
    pickupLocation: '',
    deliveryLocation: '',
    priority: 'medium',
    estimatedMinutes: 10,
    guestName: '',
    specialInstructions: ''
  });

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        type: task.type,
        title: task.title,
        description: task.description || '',
        room: task.room,
        pickupLocation: task.pickupLocation,
        deliveryLocation: task.deliveryLocation,
        priority: task.priority,
        estimatedMinutes: task.estimatedMinutes,
        guestName: task.guestName || '',
        specialInstructions: task.specialInstructions || ''
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Common pickup/delivery locations
  const pickupLocations = [
    'Kitchen',
    'Housekeeping Storage',
    'Concierge Desk',
    'Spa Reception',
    'Business Center',
    'Laundry Room',
    'Front Desk',
    'Restaurant',
    'Bar',
    'Pool Area'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#4E5840]">
            {isEditing ? 'Edit Task' : 'Create New Task'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-2">Task Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'delivery' }))}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  formData.type === 'delivery'
                    ? 'border-[#A57865] bg-[#A57865]/5 text-[#A57865]'
                    : 'border-neutral-200 text-[#6B6F63] hover:border-neutral-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Delivery
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'pickup' }))}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                  formData.type === 'pickup'
                    ? 'border-[#5C9BA4] bg-[#5C9BA4]/5 text-[#5C9BA4]'
                    : 'border-neutral-200 text-[#6B6F63] hover:border-neutral-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Pickup
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Room Service - Breakfast"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Task details..."
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 text-sm resize-none"
            />
          </div>

          {/* Room & Guest */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4E5840] mb-1">Room Number *</label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                required
                placeholder="e.g., 305"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4E5840] mb-1">Guest Name</label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                placeholder="e.g., Mr. Smith"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 text-sm"
              />
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4E5840] mb-1">Pickup Location *</label>
              <select
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 text-sm"
              >
                <option value="">Select location</option>
                {pickupLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
                <option value="custom">Room (specify in delivery)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4E5840] mb-1">Delivery Location *</label>
              <input
                type="text"
                name="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={handleChange}
                required
                placeholder="e.g., Room 305"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 text-sm"
              />
            </div>
          </div>

          {/* Priority & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4E5840] mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4E5840] mb-1">Est. Time (min)</label>
              <input
                type="number"
                name="estimatedMinutes"
                value={formData.estimatedMinutes}
                onChange={handleChange}
                min="1"
                max="120"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 text-sm"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-[#4E5840] mb-1">Special Instructions</label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={2}
              placeholder="Any special handling instructions..."
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 text-sm resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
