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
  Sparkles
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
      .slice(0, 4);
  }, [rooms]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Assigned Rooms */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Today's Assigned Rooms</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/housekeeping/rooms')}
                icon={ChevronRight}
                iconPosition="right"
              >
                View All
              </Button>
            </div>

            {todaysRooms.length === 0 ? (
              <div className="text-center py-8">
                <BedDouble className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-light">No pending rooms</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center gap-4 p-4 rounded-[12px] bg-neutral hover:bg-neutral-dark transition-colors cursor-pointer"
                    onClick={() => navigate(`/housekeeping/rooms/${room.id}`)}
                  >
                    <div className="w-12 h-12 rounded-[10px] bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BedDouble className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text">Room {room.roomNumber}</span>
                        <StatusBadge status={room.status} />
                        {room.priority === 'urgent' && <PriorityBadge priority="urgent" />}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-text-light">
                        <span>{room.type}</span>
                        <span>•</span>
                        <span>Check-in: {room.nextCheckin || 'TBD'}</span>
                      </div>
                      {room.specialRequests && (
                        <p className="text-xs text-gold mt-1 truncate">
                          Note: {room.specialRequests}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {room.status === 'dirty' && (
                        <Button
                          size="sm"
                          icon={Play}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRoom(room);
                          }}
                        >
                          Start
                        </Button>
                      )}
                      <ChevronRight className="w-5 h-5 text-text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions & Notifications */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={Play}
                onClick={() => {
                  const nextRoom = rooms.find(r => r.status === 'dirty');
                  if (nextRoom) handleStartRoom(nextRoom);
                }}
              >
                Start Next Room
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={ClipboardList}
                onClick={() => navigate('/housekeeping/tasks')}
              >
                View All Tasks
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={AlertTriangle}
                onClick={() => navigate('/housekeeping/rooms?priority=urgent')}
              >
                Urgent Rooms ({stats.urgentRooms})
              </Button>
            </div>
          </Card>

          {/* Active Tasks */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Active Tasks</h2>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate('/housekeeping/tasks')}
              >
                View All
              </Button>
            </div>

            {activeTasks.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm text-text-light">All tasks completed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-[10px] bg-neutral hover:bg-neutral-dark transition-colors cursor-pointer"
                    onClick={() => navigate('/housekeeping/tasks')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-text-light">Room {task.room}</span>
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                      {task.status === 'todo' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Play}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTask(task);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Notifications */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Recent Alerts</h2>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate('/notifications')}
              >
                View All
              </Button>
            </div>

            {recentNotifications.length === 0 ? (
              <p className="text-sm text-text-light text-center py-4">No new alerts</p>
            ) : (
              <div className="space-y-3">
                {recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`
                      p-3 rounded-[10px] border-l-3
                      ${notif.priority === 'urgent' ? 'border-l-danger bg-danger-light/30' :
                        notif.priority === 'high' ? 'border-l-warning bg-warning-light/30' :
                        'border-l-primary bg-primary/5'}
                    `}
                  >
                    <p className="text-sm font-medium text-text">{notif.title}</p>
                    <p className="text-xs text-text-light mt-0.5 line-clamp-1">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HousekeepingDashboard;
