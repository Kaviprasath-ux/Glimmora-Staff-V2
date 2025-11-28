import { Link } from 'react-router-dom';
import { technicians } from '../../data/workOrders';

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

const categoryIcons = {
  Electrical: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Plumbing: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  AC: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Furniture: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Bathroom: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  General: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

function formatTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function WorkOrderCard({ order, onEdit, onDelete, onStatusChange }) {
  if (!order) return null;

  const assignedTech = technicians.find(t => t.id === order.assignedTo);
  const completedItems = order.checklist?.filter(item => item.completed).length || 0;
  const totalItems = order.checklist?.length || 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${priorityStyles[order.priority]}`}>
              {order.priority}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>
          <Link to={`/maintenance/${order.id}`} className="hover:text-[#A57865] transition-colors">
            <h3 className="text-base font-semibold text-[#4E5840] truncate">
              {order.title}
            </h3>
          </Link>
        </div>
        <div className="flex items-center gap-1 text-[#6B6F63]">
          {categoryIcons[order.category] || categoryIcons.General}
          <span className="text-xs">{order.category}</span>
        </div>
      </div>

      {/* Room & Time */}
      <div className="flex items-center gap-3 text-xs text-[#6B6F63]">
        {order.room && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Room {order.room}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatTimeAgo(order.createdAt)}
        </span>
      </div>

      {/* Description preview */}
      <p className="text-sm text-[#6B6F63] line-clamp-2">{order.description}</p>

      {/* Assigned Technician */}
      {assignedTech && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#A57865]/10 text-[#A57865] text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {assignedTech.name}
          </span>
        </div>
      )}

      {/* Checklist progress */}
      {totalItems > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-neutral-200 rounded-full h-1.5">
            <div
              className="bg-[#5C9BA4] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(completedItems / totalItems) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[#6B6F63]">
            {completedItems}/{totalItems}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
        <Link
          to={`/maintenance/${order.id}`}
          className="flex-1 px-3 py-2 text-sm font-medium text-center text-[#A57865] border border-[#A57865] rounded-lg hover:bg-[#A57865]/10 transition-colors"
        >
          View Details
        </Link>
        {onEdit && (
          <button
            onClick={() => onEdit(order)}
            className="px-3 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(order.id)}
            className="px-3 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
