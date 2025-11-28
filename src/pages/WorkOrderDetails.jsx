import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWorkOrders } from '../context/WorkOrdersContext';
import { useStaffNotifications } from '../context/StaffNotificationsContext';
import { useAuth } from '../context/AuthContext';
import Checklist from '../components/workorders/Checklist';
import Comments from '../components/workorders/Comments';
import ActivityLog from '../components/workorders/ActivityLog';
import PhotoUploader from '../components/workorders/PhotoUploader';
import WorkOrderModal from '../components/workorders/WorkOrderModal';
import { technicians } from '../data/workOrders';

const priorityStyles = {
  critical: 'bg-red-100 text-red-600',
  high: 'bg-[#CDB261]/20 text-[#CDB261]',
  medium: 'bg-[#5C9BA4]/15 text-[#5C9BA4]',
  low: 'bg-gray-100 text-gray-600',
};

const statusStyles = {
  new: 'bg-gray-100 text-gray-600',
  inprogress: 'bg-[#CDB261]/20 text-[#CDB261]',
  paused: 'bg-[#A57865]/20 text-[#A57865]',
  completed: 'bg-[#4E5840]/15 text-[#4E5840]',
};

const statusLabels = {
  new: 'New',
  inprogress: 'In Progress',
  paused: 'Paused',
  completed: 'Completed',
};

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function WorkOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    workOrders, // FIX MT-C01: Use workOrders directly for reactive updates
    updateWorkOrder,
    updateWorkOrderStatus,
    deleteWorkOrder,
    assignTechnician,
    addChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
    addComment,
    addPhoto,
    removePhoto,
  } = useWorkOrders();

  const { addNotification } = useStaffNotifications();
  const { staff } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // FIX MT-C01: Use useMemo to derive order from context for reactive updates
  const order = useMemo(() => {
    return workOrders.find(o => o.id === id);
  }, [workOrders, id]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <svg
          className="w-16 h-16 text-neutral-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-[#4E5840] mb-2">Work Order Not Found</h2>
        <p className="text-sm text-[#6B6F63] mb-4">The work order you're looking for doesn't exist.</p>
        <Link
          to="/maintenance"
          className="px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const assignedTech = technicians.find(t => t.id === order.assignedTo);

  const handleStatusChange = (newStatus) => {
    updateWorkOrderStatus(order.id, newStatus);
    if (newStatus === 'completed' && addNotification) {
      addNotification({
        type: 'maintenance',
        title: 'Work Order Completed',
        message: `Work order "${order.title}" has been marked as complete`,
      });
    }
  };

  const handleAssignTechnician = (techId) => {
    assignTechnician(order.id, techId);
    const tech = technicians.find(t => t.id === techId);
    if (addNotification && tech) {
      addNotification({
        type: 'maintenance',
        title: 'Technician Assigned',
        message: `${tech.name} has been assigned to "${order.title}"`,
      });
    }
  };

  const handleUpdateOrder = (orderData) => {
    updateWorkOrder(order.id, orderData);
    setIsEditModalOpen(false);
  };

  const handleDeleteOrder = () => {
    deleteWorkOrder(order.id);
    navigate('/maintenance');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/maintenance"
        className="inline-flex items-center gap-2 text-sm text-[#6B6F63] hover:text-[#4E5840] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Header Card */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${priorityStyles[order.priority]}`}>
                {order.priority} Priority
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                {statusLabels[order.status]}
              </span>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-neutral-100 text-[#6B6F63]">
                {order.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#4E5840]">{order.title}</h1>
            <div className="flex items-center gap-4 text-sm text-[#6B6F63]">
              {order.room && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Room {order.room}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created {formatDate(order.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-[#A57865] border border-[#A57865] rounded-lg hover:bg-[#A57865]/10 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Status Change & Assignment */}
        <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-4">
          {/* Status Dropdown */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#6B6F63] mb-1">Status</label>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
            >
              <option value="new">New</option>
              <option value="inprogress">In Progress</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Technician Assignment */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#6B6F63] mb-1">Assigned Technician</label>
            <select
              value={order.assignedTo || ''}
              onChange={(e) => handleAssignTechnician(e.target.value)}
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
        </div>

        {/* Assigned Tech Badge */}
        {assignedTech && (
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#A57865]/10 text-[#A57865] text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Assigned to {assignedTech.name}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-[#4E5840] mb-3">Description</h2>
        <p className="text-sm text-[#6B6F63] whitespace-pre-wrap">
          {order.description || 'No description provided.'}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Checklist */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <Checklist
              items={order.checklist}
              orderId={order.id}
              onToggle={toggleChecklistItem}
              onAdd={addChecklistItem}
              onRemove={removeChecklistItem}
              editable={order.status !== 'completed'}
            />
          </div>

          {/* Photos */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <PhotoUploader
              photos={order.photos}
              orderId={order.id}
              onAddPhoto={addPhoto}
              onRemovePhoto={removePhoto}
              editable={order.status !== 'completed'}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Comments */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <Comments
              comments={order.comments}
              orderId={order.id}
              onAddComment={addComment}
              currentUser={staff}
            />
          </div>

          {/* Activity Log */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <ActivityLog activities={order.activityLog} />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <WorkOrderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateOrder}
        order={order}
        mode="edit"
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[#4E5840] mb-2">
              Delete Work Order
            </h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              Are you sure you want to delete this work order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
