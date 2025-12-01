import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BedDouble,
  ClipboardList,
  AlertTriangle,
  Clock,
  Play,
  CheckCircle,
  ChevronRight,
  Sparkles,
  User,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { DashboardHeader } from '../../layouts/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useProfile, useHousekeeping, useNotifications } from '../../hooks/useStaffPortal';

const HousekeepingDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { rooms, tasks, stats, updateHKTaskStatus, updateRoomStatus } = useHousekeeping();
  const { notifications } = useNotifications();

  const shiftHoursLeft = useMemo(() => {
    if (!profile?.shiftEnd || !profile?.clockedIn) return null;
    const [endHour, endMin] = profile.shiftEnd.split(':').map(Number);
    const now = new Date();
    const shiftEnd = new Date();
    shiftEnd.setHours(endHour, endMin, 0);

    const diffMs = shiftEnd - now;
    if (diffMs <= 0) return '0h 0m';

    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }, [profile]);

  const todaysRooms = useMemo(() => {
    return rooms
      .filter(r => r.status === 'dirty' || r.status === 'in_progress')
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // Then by status (in_progress first)
        const statusOrder = { in_progress: 0, dirty: 1 };
        return statusOrder[a.status] - statusOrder[b.status];
      })
      .slice(0, 5);
  }, [rooms]);

  // Calculate checklist progress for a room
  const getChecklistProgress = (room) => {
    if (!room.checklist?.length) return 0;
    const completed = room.checklist.filter(c => c.completed).length;
    return Math.round((completed / room.checklist.length) * 100);
  };

  const activeTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'completed')
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 3);
  }, [tasks]);

  const recentNotifications = useMemo(() => {
    return notifications.filter(n => !n.read).slice(0, 3);
  }, [notifications]);

  const handleStartTask = (task) => {
    updateHKTaskStatus(task.id, 'in_progress');
  };

  const handleStartRoom = (room) => {
    updateRoomStatus(room.id, 'in_progress');
    navigate(`/housekeeping/rooms/${room.id}`);
  };

  return (
    <div>
      <DashboardHeader name={profile?.name} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Rooms Cleaned Today"
          value={stats.cleanRooms}
          subtitle={`of ${stats.totalRooms} assigned`}
          icon={Sparkles}
          color="green"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks + stats.inProgressTasks}
          subtitle={`${stats.inProgressTasks} in progress`}
          icon={ClipboardList}
          color="gold"
        />
        <StatCard
          title="High Priority Rooms"
          value={stats.urgentRooms}
          subtitle="Require attention"
          icon={AlertTriangle}
          color="danger"
        />
        <StatCard
          title="Shift Hours Left"
          value={shiftHoursLeft || '--'}
          subtitle={profile?.clockedIn ? 'Currently clocked in' : 'Not clocked in'}
          icon={Clock}
          color="teal"
        />
      </div>

      {/* Rooms Needing Attention - Full Width */}
      <div className="mb-6">
        <div>
          <Card>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BedDouble className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Rooms Needing Attention</h2>
                  <p className="text-sm text-text-muted">
                    {stats.dirtyRooms + stats.inProgressRooms} pending · {stats.cleanRooms} completed today
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/housekeeping/rooms')}
                icon={ArrowRight}
                iconPosition="right"
              >
                View All
              </Button>
            </div>

            {todaysRooms.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">All Caught Up!</h3>
                <p className="text-sm text-text-light max-w-xs mx-auto">
                  Great work! All rooms have been serviced. Check back later for new assignments.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[16px] border border-border">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-neutral/50 border-b border-border text-xs font-medium text-text-muted uppercase tracking-wide">
                  <div className="col-span-4">Room</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Check-in</div>
                  <div className="col-span-2">Progress</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {/* Room Rows */}
                <div className="divide-y divide-border">
                  {todaysRooms.map((room) => {
                    const progress = getChecklistProgress(room);
                    const isUrgent = room.priority === 'urgent' || room.priority === 'high';

                    return (
                      <div
                        key={room.id}
                        className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-neutral/30 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/housekeeping/rooms/${room.id}`)}
                      >
                        {/* Room Info */}
                        <div className="col-span-4 flex items-center gap-3">
                          <div className={`
                            w-12 h-12 rounded-[12px] flex items-center justify-center font-bold text-lg
                            ${isUrgent ? 'bg-danger/10 text-danger' :
                              room.status === 'in_progress' ? 'bg-warning/10 text-warning' :
                              'bg-primary/10 text-primary'}
                          `}>
                            {room.roomNumber}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text">{room.type}</span>
                              {isUrgent && (
                                <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                              <span>Floor {room.floor}</span>
                              {room.guestName && (
                                <>
                                  <span>·</span>
                                  <span className="truncate">{room.guestName}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <span className={`
                            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                            ${room.status === 'dirty' ? 'bg-danger/10 text-danger' :
                              room.status === 'in_progress' ? 'bg-warning/10 text-warning' :
                              'bg-success/10 text-success'}
                          `}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              room.status === 'dirty' ? 'bg-danger' :
                              room.status === 'in_progress' ? 'bg-warning' :
                              'bg-success'
                            }`} />
                            {room.status === 'dirty' ? 'Needs Service' :
                             room.status === 'in_progress' ? 'In Progress' : 'Ready'}
                          </span>
                        </div>

                        {/* Check-in Time */}
                        <div className="col-span-2">
                          {room.nextCheckin ? (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Clock className="w-4 h-4 text-text-muted" />
                              <span className="text-text">{room.nextCheckin}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-text-muted">—</span>
                          )}
                        </div>

                        {/* Progress */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-neutral-dark rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  progress === 100 ? 'bg-success' :
                                  progress > 50 ? 'bg-teal' :
                                  progress > 0 ? 'bg-warning' : 'bg-neutral-dark'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-text-muted w-8">{progress}%</span>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="col-span-2 flex items-center justify-end gap-2">
                          {room.status === 'dirty' ? (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartRoom(room);
                              }}
                            >
                              Start
                            </Button>
                          ) : room.status === 'in_progress' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/housekeeping/rooms/${room.id}`);
                              }}
                            >
                              Continue
                            </Button>
                          ) : null}
                          <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Special Requests Banner (if any room has special requests) */}
                {todaysRooms.some(r => r.specialRequests) && (
                  <div className="px-4 py-3 bg-gold/5 border-t border-gold/20">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-gold" />
                      <span className="font-medium text-gold">Special requests pending</span>
                      <span className="text-text-muted">
                        — {todaysRooms.filter(r => r.specialRequests).length} room(s) have notes
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show more indicator */}
            {rooms.filter(r => r.status === 'dirty' || r.status === 'in_progress').length > 5 && (
              <button
                onClick={() => navigate('/housekeeping/rooms')}
                className="w-full mt-4 py-3 text-sm font-medium text-primary hover:text-primary-dark
                           border border-dashed border-primary/30 hover:border-primary/50 rounded-[12px] transition-colors"
              >
                View {rooms.filter(r => r.status === 'dirty' || r.status === 'in_progress').length - 5} more rooms
              </button>
            )}
          </Card>
        </div>
      </div>

      {/* Quick Actions & Active Tasks - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quick Actions */}
        <Card>
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">Quick Actions</h2>
                <p className="text-sm text-text-muted">Get started with common tasks</p>
              </div>
            </div>
          </div>

          {/* Primary Action - Start Next Room */}
          {(() => {
            const nextRoom = rooms.find(r => r.status === 'dirty');
            const hasNextRoom = !!nextRoom;

            return (
              <button
                onClick={() => hasNextRoom && handleStartRoom(nextRoom)}
                disabled={!hasNextRoom}
                className={`
                  w-full mb-4 p-4 rounded-[16px] transition-all duration-200 group
                  ${hasNextRoom
                    ? 'bg-success hover:bg-success/90 cursor-pointer'
                    : 'bg-neutral-dark cursor-not-allowed'}
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-[10px] flex items-center justify-center
                    ${hasNextRoom ? 'bg-white/15' : 'bg-text-muted/10'}
                  `}>
                    {hasNextRoom ? (
                      <Play className="w-5 h-5 text-white" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-text-muted" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${hasNextRoom ? 'text-white' : 'text-text-muted'}`}>
                      {hasNextRoom ? 'Start Next Room' : 'All Rooms Done'}
                    </p>
                    <p className={`text-sm ${hasNextRoom ? 'text-white/70' : 'text-text-muted/60'}`}>
                      {hasNextRoom
                        ? `Room ${nextRoom.roomNumber} · ${nextRoom.type}`
                        : 'No pending rooms'}
                    </p>
                  </div>

                  {/* Arrow */}
                  {hasNextRoom && (
                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
              </button>
            );
          })()}

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/housekeeping/tasks')}
              className="flex items-center gap-3 p-4 rounded-[16px] bg-neutral hover:bg-primary-100 border border-transparent hover:border-primary-200 transition-all group"
            >
              <div className="w-11 h-11 rounded-[10px] bg-gold/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ClipboardList className="w-5 h-5 text-gold" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text">My Tasks</p>
                <p className="text-xs text-text-muted">{stats.pendingTasks + stats.inProgressTasks} pending</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/housekeeping/rooms?priority=urgent')}
              className="flex items-center gap-3 p-4 rounded-[16px] bg-neutral hover:bg-primary-100 border border-transparent hover:border-primary-200 transition-all group"
            >
              <div className="w-11 h-11 rounded-[10px] bg-danger/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5 text-danger" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text">Urgent Rooms</p>
                <p className="text-xs text-text-muted">{stats.urgentRooms} need attention</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/housekeeping/rooms')}
              className="flex items-center gap-3 p-4 rounded-[16px] bg-neutral hover:bg-primary-100 border border-transparent hover:border-primary-200 transition-all group"
            >
              <div className="w-11 h-11 rounded-[10px] bg-teal/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BedDouble className="w-5 h-5 text-teal" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text">All Rooms</p>
                <p className="text-xs text-text-muted">{stats.totalRooms} assigned</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/housekeeping/rooms?status=clean')}
              className="flex items-center gap-3 p-4 rounded-[16px] bg-neutral hover:bg-primary-100 border border-transparent hover:border-primary-200 transition-all group"
            >
              <div className="w-11 h-11 rounded-[10px] bg-success/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text">Completed</p>
                <p className="text-xs text-text-muted">{stats.cleanRooms} today</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Active Tasks */}
        <Card>
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">Active Tasks</h2>
                <p className="text-sm text-text-muted">
                  {activeTasks.length} pending · {tasks.filter(t => t.status === 'completed').length} done today
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/housekeeping/tasks')}
              icon={ArrowRight}
              iconPosition="right"
            >
              View All
            </Button>
          </div>

          {activeTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <p className="font-medium text-text">All tasks completed!</p>
              <p className="text-sm text-text-muted mt-1">Great job today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 rounded-[14px] bg-neutral hover:bg-primary-100 transition-colors cursor-pointer group border border-transparent hover:border-primary-200"
                  onClick={() => navigate('/housekeeping/tasks')}
                >
                  {/* Priority indicator */}
                  <div className={`w-1 h-12 rounded-full shrink-0 ${
                    task.priority === 'urgent' ? 'bg-danger' :
                    task.priority === 'high' ? 'bg-warning' : 'bg-primary/30'
                  }`} />

                  {/* Task icon */}
                  <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${
                    task.priority === 'urgent' ? 'bg-danger/10' :
                    task.priority === 'high' ? 'bg-warning/10' : 'bg-primary/10'
                  }`}>
                    <ClipboardList className={`w-5 h-5 ${
                      task.priority === 'urgent' ? 'text-danger' :
                      task.priority === 'high' ? 'text-warning' : 'text-primary'
                    }`} />
                  </div>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text truncate">{task.title}</p>
                      {task.priority === 'urgent' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-danger/10 text-danger">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-muted">Room {task.room}</span>
                      {task.dueTime && (
                        <>
                          <span className="text-xs text-text-muted">·</span>
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.dueTime}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  {task.status === 'todo' ? (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartTask(task);
                      }}
                    >
                      Start
                    </Button>
                  ) : (
                    <span className="text-xs font-medium text-warning px-2.5 py-1.5 rounded-full bg-warning/10 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                      In Progress
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Alerts - Full Width */}
      {recentNotifications.length > 0 && (
        <Card>
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">Recent Alerts</h2>
                <p className="text-sm text-text-muted">
                  {recentNotifications.length} unread · Requires your attention
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notifications')}
              icon={ArrowRight}
              iconPosition="right"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`
                  p-4 rounded-[16px] border
                  ${notif.priority === 'urgent' ? 'bg-danger/5 border-danger/20' :
                    notif.priority === 'high' ? 'bg-warning/5 border-warning/20' :
                    'bg-primary/5 border-primary/20'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    notif.priority === 'urgent' ? 'bg-danger/10' :
                    notif.priority === 'high' ? 'bg-warning/10' : 'bg-primary/10'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${
                      notif.priority === 'urgent' ? 'text-danger' :
                      notif.priority === 'high' ? 'text-warning' : 'text-primary'
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text">{notif.title}</p>
                    <p className="text-xs text-text-light mt-1 line-clamp-2">{notif.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HousekeepingDashboard;
