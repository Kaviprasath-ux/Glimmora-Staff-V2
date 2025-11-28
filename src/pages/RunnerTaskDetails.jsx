import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRunner } from '../context/RunnerContext';
import { useStaffNotifications } from '../context/StaffNotificationsContext';
import NotesPanel from '../components/runner/NotesPanel';
import ProofOfDeliveryModal from '../components/runner/ProofOfDeliveryModal';
import QRVerifyModal from '../components/runner/QRVerifyModal';
import RunnerTaskModal from '../components/runner/RunnerTaskModal'; // FIX RN-M02: Import for edit functionality

const priorityStyles = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-[#5C9BA4]/15 text-[#5C9BA4]',
  high: 'bg-[#CDB261]/20 text-[#CDB261]',
  urgent: 'bg-red-100 text-red-600'
};

const statusStyles = {
  pending: 'bg-gray-100 text-gray-600',
  accepted: 'bg-[#5C9BA4]/15 text-[#5C9BA4]',
  inprogress: 'bg-[#CDB261]/20 text-[#CDB261]',
  completed: 'bg-green-100 text-green-600'
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Accepted',
  inprogress: 'In Progress',
  completed: 'Completed'
};

export default function RunnerTaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getTaskById,
    acceptRunnerTask,
    startRunnerTask,
    completeRunnerTask,
    addNote,
    verifyQR,
    markUrgent,
    deleteRunnerTask,
    updateRunnerTask // FIX RN-M02: Import for edit functionality
  } = useRunner();
  const { addNotification } = useStaffNotifications();

  const [showProofModal, setShowProofModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // FIX RN-M02: Add edit modal state
  const [elapsedTime, setElapsedTime] = useState(0);

  const task = useMemo(() => getTaskById(id), [getTaskById, id]);

  // Update elapsed time every minute for in-progress tasks
  useEffect(() => {
    if (task?.status === 'inprogress' && task.startedAt) {
      const updateTime = () => {
        const now = new Date();
        const started = new Date(task.startedAt);
        const diffMs = now - started;
        setElapsedTime(Math.floor(diffMs / 60000));
      };

      updateTime();
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }
  }, [task?.status, task?.startedAt]);

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-[#4E5840]">Task not found</h2>
        <button
          onClick={() => navigate('/runner')}
          className="mt-4 text-[#A57865] hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isOvertime = task.status === 'inprogress' && elapsedTime > task.estimatedMinutes;

  const handleAccept = () => {
    acceptRunnerTask(task.id);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'Task Accepted',
        message: `You accepted: ${task.title}`
      });
    }
  };

  const handleStart = () => {
    startRunnerTask(task.id);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'Task Started',
        message: `Started: ${task.title}`
      });
    }
  };

  const handleComplete = (taskId, proofData) => {
    completeRunnerTask(taskId, proofData);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'Task Completed',
        message: `Completed: ${task.title}`
      });
    }
    setShowProofModal(false);
  };

  const handleVerifyQR = (taskId) => {
    verifyQR(taskId);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'QR Verified',
        message: `Room ${task.room} verified for ${task.title}`
      });
    }
  };

  const handleMarkUrgent = () => {
    markUrgent(task.id);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'Marked Urgent',
        message: `${task.title} marked as urgent`
      });
    }
  };

  const handleDelete = () => {
    deleteRunnerTask(task.id);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'Task Deleted',
        message: `Deleted: ${task.title}`
      });
    }
    navigate('/runner');
  };

  const handleAddNote = (taskId, noteText) => {
    addNote(taskId, noteText, 'Runner');
  };

  // FIX RN-M02: Handle edit task
  const handleEditTask = (updatedData) => {
    updateRunnerTask(task.id, updatedData);
    setShowEditModal(false);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'Task Updated',
        message: `Updated: ${updatedData.title || task.title}`
      });
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/runner')}
        className="flex items-center gap-2 text-sm text-[#6B6F63] hover:text-[#4E5840] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Header Card */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Task Type Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    task.type === 'delivery' ? 'bg-[#A57865]/10' : 'bg-[#5C9BA4]/10'
                  }`}>
                    {task.type === 'delivery' ? (
                      <svg className="w-6 h-6 text-[#A57865]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-[#5C9BA4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      task.type === 'delivery' ? 'bg-[#A57865]/10 text-[#A57865]' : 'bg-[#5C9BA4]/10 text-[#5C9BA4]'
                    }`}>
                      {task.type === 'delivery' ? 'Delivery' : 'Pickup'}
                    </span>
                    <h1 className="text-xl font-bold text-[#4E5840] mt-1">{task.title}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityStyles[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Timer for In Progress */}
              {task.status === 'inprogress' && (
                <div className={`flex items-center justify-between p-4 rounded-xl ${
                  isOvertime ? 'bg-red-50' : 'bg-[#CDB261]/10'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isOvertime ? 'bg-red-100' : 'bg-[#CDB261]/20'
                    }`}>
                      <svg className={`w-5 h-5 ${isOvertime ? 'text-red-600' : 'text-[#CDB261]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isOvertime ? 'text-red-600' : 'text-[#CDB261]'}`}>
                        Time Elapsed
                      </p>
                      <p className={`text-2xl font-bold ${isOvertime ? 'text-red-600' : 'text-[#4E5840]'}`}>
                        {elapsedTime} min
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6B6F63]">Estimated</p>
                    <p className="text-lg font-semibold text-[#4E5840]">{task.estimatedMinutes} min</p>
                    {isOvertime && (
                      <p className="text-xs text-red-600">+{elapsedTime - task.estimatedMinutes} overtime</p>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {task.description && (
                <div>
                  <h3 className="text-sm font-medium text-[#4E5840] mb-2">Description</h3>
                  <p className="text-sm text-[#6B6F63]">{task.description}</p>
                </div>
              )}

              {/* Location Flow */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-[#4E5840] mb-3">Route</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-[#5C9BA4]"></div>
                      <span className="text-xs font-medium text-[#5C9BA4]">Pickup</span>
                    </div>
                    <p className="text-sm font-medium text-[#4E5840] pl-5">{task.pickupLocation}</p>
                  </div>
                  <svg className="w-8 h-8 text-neutral-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-[#A57865]"></div>
                      <span className="text-xs font-medium text-[#A57865]">Delivery</span>
                    </div>
                    <p className="text-sm font-medium text-[#4E5840] pl-5">{task.deliveryLocation}</p>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-[#4E5840] mb-1">Room</h3>
                  <p className="text-lg font-semibold text-[#4E5840]">{task.room}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#4E5840] mb-1">Guest</h3>
                  <p className="text-lg font-semibold text-[#4E5840]">{task.guestName || '-'}</p>
                </div>
              </div>

              {/* Special Instructions */}
              {task.specialInstructions && (
                <div className="bg-[#A57865]/5 border border-[#A57865]/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#A57865] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-[#A57865] mb-1">Special Instructions</h3>
                      <p className="text-sm text-[#6B6F63]">{task.specialInstructions}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Status */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    task.qrVerified ? 'bg-green-100' : 'bg-neutral-200'
                  }`}>
                    <svg className={`w-5 h-5 ${task.qrVerified ? 'text-green-600' : 'text-neutral-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4E5840]">QR Verification</p>
                    <p className={`text-xs ${task.qrVerified ? 'text-green-600' : 'text-[#6B6F63]'}`}>
                      {task.qrVerified ? 'Verified' : 'Not verified'}
                    </p>
                  </div>
                </div>
                {!task.qrVerified && task.status !== 'completed' && (
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="px-4 py-2 text-sm font-medium text-[#5C9BA4] border border-[#5C9BA4] rounded-lg hover:bg-[#5C9BA4]/10 transition-colors"
                  >
                    Scan QR
                  </button>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-medium text-[#4E5840] mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
                    <span className="text-[#6B6F63]">Created:</span>
                    <span className="text-[#4E5840]">{formatDateTime(task.createdAt)}</span>
                  </div>
                  {task.acceptedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#5C9BA4]"></div>
                      <span className="text-[#6B6F63]">Accepted:</span>
                      <span className="text-[#4E5840]">{formatDateTime(task.acceptedAt)}</span>
                    </div>
                  )}
                  {task.startedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#CDB261]"></div>
                      <span className="text-[#6B6F63]">Started:</span>
                      <span className="text-[#4E5840]">{formatDateTime(task.startedAt)}</span>
                    </div>
                  )}
                  {task.completedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-[#6B6F63]">Completed:</span>
                      <span className="text-[#4E5840]">{formatDateTime(task.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            {task.status !== 'completed' && (
              <div className="border-t border-neutral-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* FIX RN-M02: Add edit button */}
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-3 py-2 text-sm font-medium text-[#A57865] border border-[#A57865] rounded-lg hover:bg-[#A57865]/10 transition-colors"
                  >
                    Edit
                  </button>
                  {task.priority !== 'urgent' && (
                    <button
                      onClick={handleMarkUrgent}
                      className="px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Mark Urgent
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={handleAccept}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#5C9BA4] rounded-lg hover:bg-[#4A8A94] transition-colors"
                    >
                      Accept Task
                    </button>
                  )}
                  {task.status === 'accepted' && (
                    <button
                      onClick={handleStart}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === 'inprogress' && (
                    <button
                      onClick={() => setShowProofModal(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#4E5840] rounded-lg hover:bg-[#3E4830] transition-colors"
                    >
                      Complete Task
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Proof of Delivery for Completed */}
          {task.status === 'completed' && (task.signature || task.photos.length > 0) && (
            <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-[#4E5840] mb-4">Proof of Delivery</h3>
              <div className="grid grid-cols-2 gap-4">
                {task.signature && (
                  <div>
                    <p className="text-xs text-[#6B6F63] mb-2">Signature</p>
                    <div className="border border-neutral-200 rounded-lg p-2 bg-neutral-50">
                      <img src={task.signature} alt="Signature" className="h-20 object-contain" />
                    </div>
                  </div>
                )}
                {task.photos.length > 0 && (
                  <div>
                    <p className="text-xs text-[#6B6F63] mb-2">Photos</p>
                    <div className="flex gap-2">
                      {task.photos.map((photo, index) => (
                        <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200">
                          <img src={photo} alt={`Proof ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Notes */}
        <div className="space-y-6">
          <NotesPanel
            notes={task.notes}
            taskId={task.id}
            onAddNote={handleAddNote}
          />
        </div>
      </div>

      {/* Proof of Delivery Modal */}
      {showProofModal && (
        <ProofOfDeliveryModal
          task={task}
          onClose={() => setShowProofModal(false)}
          onComplete={handleComplete}
        />
      )}

      {/* QR Verify Modal */}
      {showQRModal && (
        <QRVerifyModal
          task={task}
          onClose={() => setShowQRModal(false)}
          onVerify={handleVerifyQR}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-[#4E5840] mb-2">Delete Task?</h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIX RN-M02: Edit Task Modal */}
      {showEditModal && (
        <RunnerTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditTask}
        />
      )}
    </div>
  );
}
