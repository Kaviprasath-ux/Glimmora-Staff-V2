import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BedDouble,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Save,
  Play,
  Sparkles,
  MessageSquare,
  Calendar,
  CheckSquare,
  RotateCcw,
  Check,
  MapPin,
  Star,
  MessageCircle,
  Timer
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import { useHousekeeping } from '../../hooks/useStaffPortal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Status configuration
const statusConfig = {
  dirty: {
    label: 'Needs Service',
    color: 'text-danger',
    bg: 'bg-danger/10',
    icon: AlertTriangle
  },
  in_progress: {
    label: 'Cleaning',
    color: 'text-warning',
    bg: 'bg-warning/10',
    icon: Clock
  },
  clean: {
    label: 'Ready',
    color: 'text-success',
    bg: 'bg-success/10',
    icon: CheckCircle
  },
  inspected: {
    label: 'Verified',
    color: 'text-teal',
    bg: 'bg-teal/10',
    icon: Sparkles
  }
};

// Checklist Item Component
const ChecklistItem = ({ item, onToggle, disabled }) => (
  <motion.label
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ x: 4 }}
    className={`
      flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200
      ${item.completed
        ? 'bg-success/5 hover:bg-success/10'
        : 'bg-neutral hover:bg-neutral-dark'}
      ${disabled ? 'opacity-50 pointer-events-none' : ''}
    `}
  >
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onToggle(item.id, !item.completed)}
      className={`
        w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all
        ${item.completed
          ? 'bg-success text-white shadow-sm shadow-success/30'
          : 'border-2 border-border bg-white hover:border-primary'}
      `}
    >
      <AnimatePresence mode="wait">
        {item.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Check className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
    <span className={`
      flex-1 text-sm transition-all
      ${item.completed ? 'text-text-light line-through' : 'text-text font-medium'}
    `}>
      {item.task}
    </span>
  </motion.label>
);

// Info Row Component
const InfoRow = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <motion.div
    variants={itemVariants}
    className="flex items-center gap-3"
  >
    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-medium text-text truncate">{value || 'Not specified'}</p>
    </div>
  </motion.div>
);

// Progress Ring Component
const ProgressRing = ({ percentage }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-neutral-dark"
        />
        <motion.circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={
            percentage === 100 ? 'text-success' :
            percentage > 50 ? 'text-teal' :
            percentage > 0 ? 'text-warning' : 'text-neutral-dark'
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-text">{percentage}%</span>
        <span className="text-xs text-text-muted">Complete</span>
      </div>
    </div>
  );
};

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, updateRoomChecklist, updateRoomStatus, addRoomNote } = useHousekeeping();

  const room = useMemo(() => rooms.find(r => r.id === id), [rooms, id]);
  const [note, setNote] = useState(room?.notes || '');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  if (!room) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 rounded-[24px] bg-neutral flex items-center justify-center mx-auto mb-4">
          <BedDouble className="w-10 h-10 text-text-muted" />
        </div>
        <h2 className="text-xl font-semibold text-text mb-2">Room Not Found</h2>
        <p className="text-text-light mb-6">The room you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate('/housekeeping/rooms')}>
          Back to Rooms
        </Button>
      </motion.div>
    );
  }

  const checklistProgress = useMemo(() => {
    const completed = room.checklist.filter(c => c.completed).length;
    return {
      completed,
      total: room.checklist.length,
      percentage: Math.round((completed / room.checklist.length) * 100)
    };
  }, [room.checklist]);

  const config = statusConfig[room.status] || statusConfig.dirty;
  const RoomStatusIcon = config.icon;

  const handleChecklistToggle = (checklistId, completed) => {
    updateRoomChecklist(room.id, checklistId, completed);
  };

  const handleStatusChange = (status) => {
    updateRoomStatus(room.id, status);
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    addRoomNote(room.id, note);
    setTimeout(() => {
      setIsSavingNote(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    }, 400);
  };

  const handleCompleteAll = () => {
    room.checklist.forEach(item => {
      if (!item.completed) {
        updateRoomChecklist(room.id, item.id, true);
      }
    });
  };

  const isCleaningComplete = checklistProgress.percentage === 100;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/housekeeping/rooms')}
              className="p-2 rounded-[10px] border border-border hover:border-primary-200 hover:bg-primary-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text-muted" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text">Room {room.roomNumber}</h1>
                {room.priority === 'urgent' && (
                  <span className="px-2.5 py-1 rounded-[8px] text-[11px] font-semibold uppercase bg-danger text-white">
                    Urgent
                  </span>
                )}
                <span className={`px-2.5 py-1 rounded-[8px] text-[11px] font-medium ${
                  room.status === 'clean' ? 'bg-success/10 text-success' :
                  room.status === 'in_progress' ? 'bg-teal/10 text-teal' :
                  'bg-neutral text-text-muted'
                }`}>
                  {config.label}
                </span>
              </div>
              <p className="text-sm text-text-muted mt-1">{room.type} · Floor {room.floor}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Room Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Progress Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Progress</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              checklistProgress.percentage === 100 ? 'bg-success/10' :
              checklistProgress.percentage > 50 ? 'bg-teal/10' : 'bg-warning/10'
            }`}>
              <CheckSquare className={`w-4 h-4 ${
                checklistProgress.percentage === 100 ? 'text-success' :
                checklistProgress.percentage > 50 ? 'text-teal' : 'text-warning'
              }`} />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-2xl font-bold ${
              checklistProgress.percentage === 100 ? 'text-success' :
              checklistProgress.percentage > 50 ? 'text-teal' : 'text-warning'
            }`}>{checklistProgress.percentage}%</span>
            <span className="text-xs text-text-muted mb-1">{checklistProgress.completed}/{checklistProgress.total}</span>
          </div>
          <div className="mt-2 h-1.5 bg-neutral rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${checklistProgress.percentage}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-full ${
                checklistProgress.percentage === 100 ? 'bg-success' :
                checklistProgress.percentage > 50 ? 'bg-teal' : 'bg-warning'
              }`}
            />
          </div>
        </motion.div>

        {/* Floor Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Floor</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
          </div>
          <span className="text-2xl font-bold text-text">{room.floor}</span>
        </motion.div>

        {/* Room Type Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Type</span>
            <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
              <BedDouble className="w-4 h-4 text-teal" />
            </div>
          </div>
          <span className="text-lg font-bold text-text">{room.type}</span>
        </motion.div>

        {/* Status Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Status</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}>
              <RoomStatusIcon className={`w-4 h-4 ${config.color}`} />
            </div>
          </div>
          <span className={`text-lg font-bold ${config.color}`}>{config.label}</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Status Card */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                    <RoomStatusIcon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Room Status</h2>
                    <p className="text-sm text-text-muted">Current service status and actions</p>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="grid grid-cols-4 gap-4 p-4 mb-5 rounded-[12px] border border-border bg-neutral/30">
                <div>
                  <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Guest</p>
                  <p className="text-sm font-semibold text-text truncate">{room.guestName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Check-in</p>
                  <p className="text-sm font-semibold text-text">{room.nextCheckin || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Last Cleaned</p>
                  <p className="text-sm font-semibold text-text">{room.lastCleaned || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Priority</p>
                  <p className={`text-sm font-semibold ${
                    room.priority === 'urgent' ? 'text-danger' :
                    room.priority === 'high' ? 'text-warning' : 'text-text'
                  }`}>{room.priority === 'urgent' ? 'Urgent' : room.priority === 'high' ? 'High' : 'Normal'}</p>
                </div>
              </div>

              {/* Special Request */}
              {room.specialRequests && (
                <div className="flex items-center gap-3 p-4 mb-5 rounded-[12px] border border-gold/20 bg-gold/5">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-gold mb-0.5">Special Request</p>
                    <p className="text-sm text-text">{room.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                {room.status === 'dirty' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Begin Service
                  </button>
                )}
                {room.status === 'in_progress' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('dirty')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Report Issue
                    </button>
                    <button
                      onClick={() => handleStatusChange('clean')}
                      disabled={!isCleaningComplete}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] transition-all ${
                        isCleaningComplete
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-neutral text-text-muted cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isCleaningComplete ? 'Mark as Ready' : 'Complete checklist'}
                    </button>
                  </>
                )}
                {room.status === 'clean' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('dirty')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Re-service
                    </button>
                    <button
                      onClick={() => handleStatusChange('inspected')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verify Room
                    </button>
                  </>
                )}
                {room.status === 'inspected' && (
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-success/10 text-success">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Ready for guest arrival</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Checklist */}
          <motion.div variants={itemVariants}>
            <Card>
              {/* Header with divider */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Service Checklist</h2>
                    <p className="text-sm text-text-muted">
                      {checklistProgress.completed} of {checklistProgress.total} tasks completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {checklistProgress.percentage < 100 && (
                    <button
                      onClick={handleCompleteAll}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 transition-colors"
                    >
                      Complete All
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text">{checklistProgress.percentage}% Complete</span>
                  <span className="text-xs text-text-muted">{checklistProgress.total - checklistProgress.completed} remaining</span>
                </div>
                <div className="h-2 bg-neutral rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${checklistProgress.percentage}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${
                      checklistProgress.percentage === 100 ? 'bg-success' :
                      checklistProgress.percentage > 50 ? 'bg-teal' : 'bg-warning'
                    }`}
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <motion.div
                variants={containerVariants}
                className="space-y-2"
              >
                {room.checklist.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ChecklistItem
                      item={item}
                      onToggle={handleChecklistToggle}
                      disabled={room.status === 'inspected'}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </Card>
          </motion.div>

          {/* Notes */}
          <motion.div variants={itemVariants}>
            <Card>
              {/* Header with divider */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-beige/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-beige" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Service Notes</h2>
                    <p className="text-sm text-text-muted">Add any observations or issues</p>
                  </div>
                </div>
              </div>

              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes about this room (issues, special observations, items to replace...)"
                rows={4}
                className="mb-4"
              />

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <AnimatePresence>
                  {showSaveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-success mr-auto"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Note saved</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={handleSaveNote}
                  disabled={isSavingNote}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSavingNote ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Room Information */}
          <motion.div variants={itemVariants}>
            <Card>
              {/* Header with divider */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                  <BedDouble className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Room Information</h2>
                  <p className="text-sm text-text-muted">Guest and schedule details</p>
                </div>
              </div>

              {/* Simple Info List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Guest</span>
                  <span className="text-sm font-medium text-text">{room.guestName || '—'}</span>
                </div>

                {room.guestCheckout && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Check-out</span>
                    <span className="text-sm font-medium text-danger">{room.guestCheckout}</span>
                  </div>
                )}

                {room.nextCheckin && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Check-in</span>
                    <span className="text-sm font-medium text-success">{room.nextCheckin}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Last Serviced</span>
                  <span className="text-sm font-medium text-text">{room.lastCleaned || '—'}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Special Requests */}
          {room.specialRequests && (
            <motion.div variants={itemVariants}>
              <Card padding="lg" className="border-gold/30 bg-gold/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-gold" />
                  </div>
                  <h3 className="font-semibold text-text">Special Request</h3>
                </div>
                <p className="text-sm text-text-light leading-relaxed">
                  {room.specialRequests}
                </p>
              </Card>
            </motion.div>
          )}

          {/* Priority Alert */}
          {(room.priority === 'urgent' || room.priority === 'high') && (
            <motion.div variants={itemVariants}>
              <Card
                padding="lg"
                className={`border ${room.priority === 'urgent' ? 'border-danger/30 bg-danger/5' : 'border-warning/30 bg-warning/5'}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    room.priority === 'urgent' ? 'bg-danger/20' : 'bg-warning/20'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${
                      room.priority === 'urgent' ? 'text-danger' : 'text-warning'
                    }`} />
                  </div>
                  <h3 className="font-semibold text-text">
                    {room.priority === 'urgent' ? 'Urgent Priority' : 'High Priority'}
                  </h3>
                </div>
                <p className="text-sm text-text-light">
                  {room.priority === 'urgent'
                    ? 'This room requires immediate attention. VIP guest or time-sensitive check-in.'
                    : 'This room is marked as high priority. Please complete service as soon as possible.'}
                </p>
              </Card>
            </motion.div>
          )}

          {/* Service Summary */}
          <motion.div variants={itemVariants}>
            <Card>
              {/* Header with divider */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Service Summary</h2>
                  <p className="text-sm text-text-muted">Task completion overview</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-success/5 rounded-[12px] border border-success/10">
                  <p className="text-3xl font-bold text-success">{checklistProgress.completed}</p>
                  <p className="text-xs font-medium text-text-muted mt-1">Tasks Done</p>
                </div>
                <div className="p-4 bg-neutral rounded-[12px] border border-border">
                  <p className="text-3xl font-bold text-text">{checklistProgress.total - checklistProgress.completed}</p>
                  <p className="text-xs font-medium text-text-muted mt-1">Remaining</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomDetails;
