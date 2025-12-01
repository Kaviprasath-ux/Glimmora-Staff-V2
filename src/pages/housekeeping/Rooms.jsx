import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BedDouble,
  Search,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  MessageCircle,
  Sparkles,
  Filter,
  X,
  Play,
  ArrowRight,
  User,
  Calendar
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Input';
import { useHousekeeping } from '../../hooks/useStaffPortal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.2 }
  }
};

// Filter Pill Component
const FilterPill = ({ label, count, color, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
      transition-all duration-200
      ${active
        ? color === 'danger' ? 'bg-danger text-white' :
          color === 'warning' ? 'bg-warning text-white' :
          color === 'success' ? 'bg-success text-white' :
          'bg-primary text-white'
        : 'bg-white border border-border hover:border-primary/30 text-text'}
    `}
  >
    <span>{label}</span>
    <span className={`
      px-1.5 py-0.5 rounded-full text-xs font-bold
      ${active ? 'bg-white/20 text-inherit' : 'bg-neutral text-text-muted'}
    `}>
      {count}
    </span>
  </motion.button>
);

// Status Icon Component
const StatusIcon = ({ status }) => {
  const config = {
    dirty: { icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
    in_progress: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    clean: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    inspected: { icon: Sparkles, color: 'text-teal', bg: 'bg-teal/10' }
  };

  const { icon: Icon, color, bg } = config[status] || config.dirty;

  return (
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">Checklist</span>
        <span className="font-medium text-text">{completed}/{total}</span>
      </div>
      <div className="h-1.5 bg-neutral-dark rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            percentage === 100 ? 'bg-success' :
            percentage > 50 ? 'bg-teal' :
            percentage > 0 ? 'bg-warning' : 'bg-neutral-dark'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

// Room Card Component
const RoomCard = ({ room, onStartCleaning, onMarkClean, onClick }) => {
  const progress = useMemo(() => {
    if (!room.checklist?.length) return { completed: 0, total: 0 };
    const completed = room.checklist.filter(c => c.completed).length;
    return { completed, total: room.checklist.length };
  }, [room.checklist]);

  const isUrgent = room.priority === 'urgent' || room.priority === 'high';

  return (
    <motion.div
      layout
      variants={itemVariants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative bg-white rounded-[24px] border border-border/50 overflow-hidden
                 cursor-pointer hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
    >
      {/* Priority Indicator */}
      {isUrgent && (
        <div className={`absolute top-0 left-0 w-1 h-full rounded-l-[24px] ${
          room.priority === 'urgent' ? 'bg-danger' : 'bg-warning'
        }`} />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <StatusIcon status={room.status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-text">Room {room.roomNumber}</h3>
              {room.priority === 'urgent' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-danger/10 text-danger">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-sm text-text-light">{room.type}</p>
          </div>
          <StatusBadge status={room.status} />
        </div>

        {/* Room Details */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Floor</span>
            <span className="font-medium text-text">{room.floor}</span>
          </div>

          {room.nextCheckin && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Check-in
              </span>
              <span className="font-medium text-text">{room.nextCheckin}</span>
            </div>
          )}

          {room.guestName && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Guest</span>
              <span className="font-medium text-text truncate max-w-[140px]">{room.guestName}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar completed={progress.completed} total={progress.total} />
        </div>

        {/* Special Request */}
        {room.specialRequests && (
          <div className="mb-4 p-3 rounded-xl bg-gold/10 border border-gold/20">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gold mb-0.5">Special Request</p>
                <p className="text-xs text-text-light line-clamp-2">{room.specialRequests}</p>
              </div>
            </div>
          </div>
        )}

        {/* Priority Badge */}
        {room.priority && room.priority !== 'normal' && room.priority !== 'urgent' && (
          <div className="mb-4">
            <PriorityBadge priority={room.priority} />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          {room.status === 'dirty' && (
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onStartCleaning(room, e);
              }}
            >
              Begin Service
            </Button>
          )}
          {room.status === 'in_progress' && (
            <Button
              size="sm"
              variant="success"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onMarkClean(room, e);
              }}
            >
              Complete
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            icon={ChevronRight}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ hasFilters, onClearFilters }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <div className="w-20 h-20 rounded-[24px] bg-neutral flex items-center justify-center mx-auto mb-4">
      <BedDouble className="w-10 h-10 text-text-muted" />
    </div>
    <h3 className="text-xl font-semibold text-text mb-2">No rooms found</h3>
    <p className="text-text-light mb-6 max-w-sm mx-auto">
      {hasFilters
        ? 'Try adjusting your search or filters to find what you\'re looking for.'
        : 'No rooms have been assigned to you yet.'}
    </p>
    {hasFilters && (
      <Button variant="outline" icon={X} onClick={onClearFilters}>
        Clear Filters
      </Button>
    )}
  </motion.div>
);

const HousekeepingRooms = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { rooms, stats, updateRoomStatus } = useHousekeeping();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room => {
        const matchesSearch = !searchQuery ||
          room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.guestName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' ||
          (priorityFilter === 'urgent' && (room.priority === 'urgent' || room.priority === 'high'));

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        // Then by status
        const statusOrder = { in_progress: 0, dirty: 1, clean: 2, inspected: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
  }, [rooms, searchQuery, statusFilter, priorityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRooms, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter]);

  const handleStartCleaning = (room, e) => {
    e.stopPropagation();
    updateRoomStatus(room.id, 'in_progress');
  };

  const handleMarkClean = (room, e) => {
    e.stopPropagation();
    updateRoomStatus(room.id, 'clean');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="My Rooms"
        subtitle={`${rooms.length} rooms assigned • ${stats.dirtyRooms + stats.inProgressRooms} need attention`}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Needs Service"
          value={stats.dirtyRooms}
          subtitle="Awaiting cleaning"
          icon={AlertTriangle}
          color="danger"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressRooms}
          subtitle="Currently cleaning"
          icon={Clock}
          color="warning"
        />
        <StatCard
          title="Ready"
          value={stats.cleanRooms}
          subtitle="Cleaned today"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Total Assigned"
          value={stats.totalRooms}
          subtitle="All rooms"
          icon={BedDouble}
          color="teal"
        />
      </div>

      {/* All Rooms Card */}
      <Card className="mb-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BedDouble className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">All Rooms</h2>
              <p className="text-sm text-text-muted">
                {filteredRooms.length} of {rooms.length} rooms · {stats.urgentRooms} urgent
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by room number, type, or guest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 text-sm font-medium rounded-[8px] transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('dirty')}
              className={`px-3 py-2 text-sm font-medium rounded-[8px] transition-colors ${
                statusFilter === 'dirty'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              Needs Service
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-2 text-sm font-medium rounded-[8px] transition-colors ${
                statusFilter === 'in_progress'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('clean')}
              className={`px-3 py-2 text-sm font-medium rounded-[8px] transition-colors ${
                statusFilter === 'clean'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              Ready
            </button>
          </div>
        </div>

        {/* Rooms List */}
        {filteredRooms.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {paginatedRooms.map((room) => {
                const isUrgent = room.priority === 'urgent';
                const isHighPriority = room.priority === 'high';
                const isInProgress = room.status === 'in_progress';
                const isClean = room.status === 'clean';
                const isDirty = room.status === 'dirty';

                const progress = room.checklist?.length
                  ? Math.round((room.checklist.filter(c => c.completed).length / room.checklist.length) * 100)
                  : 0;

                return (
                  <motion.div
                    key={room.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => navigate(`/housekeeping/rooms/${room.id}`)}
                    className={`
                      relative bg-white rounded-[20px] border overflow-hidden
                      transition-all duration-200 cursor-pointer group
                      ${isClean
                        ? 'border-border opacity-70'
                        : isUrgent
                          ? 'border-danger/30 hover:border-danger/50 hover:shadow-md hover:shadow-danger/5'
                          : 'border-border hover:border-primary-200 hover:shadow-md hover:shadow-primary/5'}
                    `}
                  >
                    <div className="p-5">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-11 h-11 rounded-full flex items-center justify-center shrink-0
                            ${isClean ? 'bg-success/10' :
                              isInProgress ? 'bg-teal/10' :
                              isUrgent ? 'bg-danger/10' :
                              isHighPriority ? 'bg-warning/10' : 'bg-primary/10'}
                          `}>
                            {isClean ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : isInProgress ? (
                              <Clock className="w-5 h-5 text-teal" />
                            ) : isUrgent ? (
                              <AlertTriangle className="w-5 h-5 text-danger" />
                            ) : isHighPriority ? (
                              <AlertTriangle className="w-5 h-5 text-warning" />
                            ) : (
                              <BedDouble className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-text">Room {room.roomNumber}</h3>
                            <p className="text-sm text-text-muted">{room.type}</p>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2">
                          {isUrgent && (
                            <span className="px-2.5 py-1 rounded-[8px] text-[11px] font-semibold uppercase bg-danger text-white">
                              Urgent
                            </span>
                          )}
                          <span className={`px-2.5 py-1 rounded-[8px] text-[11px] font-medium ${
                            isClean ? 'bg-success/10 text-success' :
                            isInProgress ? 'bg-teal/10 text-teal' :
                            'bg-neutral text-text-muted'
                          }`}>
                            {isClean ? 'Ready' : isInProgress ? 'Cleaning' : 'Needs Service'}
                          </span>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-4 gap-4 py-3 px-4 mb-4 rounded-[12px] border border-border bg-neutral/30">
                        <div>
                          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Floor</p>
                          <p className="text-sm font-semibold text-text">{room.floor}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Guest</p>
                          <p className="text-sm font-semibold text-text truncate">{room.guestName || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Check-in</p>
                          <p className="text-sm font-semibold text-text">{room.nextCheckin || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Progress</p>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-semibold ${
                              progress === 100 ? 'text-success' :
                              progress > 50 ? 'text-teal' :
                              progress > 0 ? 'text-warning' : 'text-text-muted'
                            }`}>{progress}%</p>
                            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  progress === 100 ? 'bg-success' :
                                  progress > 50 ? 'bg-teal' :
                                  progress > 0 ? 'bg-warning' : 'bg-border'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Special Request */}
                      {room.specialRequests && (
                        <div className="flex items-center gap-3 py-3 px-4 mb-4 rounded-[12px] border border-gold/20 bg-gold/5">
                          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                            <MessageCircle className="w-4 h-4 text-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-text">{room.specialRequests}</p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                        {isClean && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-success mr-auto">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/housekeeping/rooms/${room.id}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 hover:bg-primary-50 transition-all"
                        >
                          View Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {isDirty && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartCleaning(room, e);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Start Cleaning
                          </button>
                        )}
                        {isInProgress && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkClean(room, e);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {filteredRooms.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredRooms.length)} of {filteredRooms.length} rooms
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 text-sm font-medium rounded-[8px] border transition-colors ${
                  currentPage === 1
                    ? 'border-border text-text-muted cursor-not-allowed opacity-50'
                    : 'border-border text-text hover:border-primary-200 hover:bg-primary-50'
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm font-medium rounded-[8px] transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:bg-primary-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 text-sm font-medium rounded-[8px] border transition-colors ${
                  currentPage === totalPages
                    ? 'border-border text-text-muted cursor-not-allowed opacity-50'
                    : 'border-border text-text hover:border-primary-200 hover:bg-primary-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default HousekeepingRooms;
