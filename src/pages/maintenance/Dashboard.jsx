import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Play,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { DashboardHeader } from '../../layouts/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import { StatusBadge, SeverityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useProfile, useMaintenance, useNotifications } from '../../hooks/useStaffPortal';

const MaintenanceDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { workOrders, tasks, equipmentIssues, stats, updateWorkOrderStatus, updateMTTaskStatus } = useMaintenance();
  const { notifications } = useNotifications();

  const recentWorkOrders = useMemo(() => {
    return workOrders
      .filter(wo => wo.status !== 'completed')
      .sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      })
      .slice(0, 4);
  }, [workOrders]);

  const todaysTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'completed')
      .slice(0, 3);
  }, [tasks]);

  const recentActivity = useMemo(() => {
    const activities = [
      ...workOrders.map(wo => ({
        id: wo.id,
        type: 'work_order',
        title: wo.title,
        status: wo.status,
        timestamp: wo.updatedAt || wo.createdAt,
        severity: wo.severity
      })),
      ...tasks.map(t => ({
        id: t.id,
        type: 'task',
        title: t.title,
        status: t.status,
        timestamp: t.createdAt,
        priority: t.priority
      }))
    ];

    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  }, [workOrders, tasks]);

  const urgentNotifications = useMemo(() => {
    return notifications
      .filter(n => !n.read && (n.priority === 'urgent' || n.priority === 'high'))
      .slice(0, 3);
  }, [notifications]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleStartWorkOrder = (workOrder) => {
    updateWorkOrderStatus(workOrder.id, 'in_progress');
  };

  const handleStartTask = (task) => {
    updateMTTaskStatus(task.id, 'in_progress');
  };

  return (
    <div>
      <DashboardHeader name={profile?.name} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Open Work Orders"
          value={stats.pendingWorkOrders + stats.inProgressWorkOrders}
          subtitle={`${stats.pendingWorkOrders} pending`}
          icon={Wrench}
          color="primary"
        />
        <StatCard
          title="Critical Issues"
          value={stats.criticalWorkOrders}
          subtitle="Require immediate action"
          icon={AlertTriangle}
          color="danger"
        />
        <StatCard
          title="Tasks Due Today"
          value={stats.pendingTasks + stats.inProgressTasks}
          subtitle={`${stats.inProgressTasks} in progress`}
          icon={ClipboardList}
          color="gold"
        />
        <StatCard
          title="Completed This Week"
          value={stats.completedWorkOrders + stats.completedTasks}
          subtitle="Work orders & tasks"
          icon={CheckCircle}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Work Orders */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Recent Work Orders</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/maintenance/work-orders')}
                icon={ChevronRight}
                iconPosition="right"
              >
                View All
              </Button>
            </div>

            {recentWorkOrders.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-light">No open work orders</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentWorkOrders.map((wo) => (
                  <div
                    key={wo.id}
                    className="flex items-center gap-4 p-4 rounded-[12px] bg-neutral hover:bg-neutral-dark transition-colors cursor-pointer"
                    onClick={() => navigate(`/maintenance/work-orders/${wo.id}`)}
                  >
                    <div className={`
                      w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0
                      ${wo.severity === 'critical' ? 'bg-danger-light' :
                        wo.severity === 'high' ? 'bg-warning-light' :
                        'bg-primary/10'}
                    `}>
                      {wo.severity === 'critical' ? (
                        <AlertCircle className="w-6 h-6 text-danger" />
                      ) : (
                        <Wrench className="w-6 h-6 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-text truncate">{wo.title}</span>
                        <SeverityBadge severity={wo.severity} />
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-text-light">
                        <span>{wo.location}</span>
                        <span>•</span>
                        <span>{wo.issueType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {wo.status === 'pending' && (
                        <Button
                          size="sm"
                          icon={Play}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartWorkOrder(wo);
                          }}
                        >
                          Start
                        </Button>
                      )}
                      <StatusBadge status={wo.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Timeline */}
          <Card className="mt-6">
            <h2 className="text-lg font-semibold text-text mb-4">Recent Activity</h2>

            {recentActivity.length === 0 ? (
              <p className="text-text-light text-center py-4">No recent activity</p>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={`${activity.type}-${activity.id}`} className="relative flex gap-4 pl-10">
                      <div className={`
                        absolute left-2 w-5 h-5 rounded-full flex items-center justify-center
                        ${activity.status === 'completed' ? 'bg-success' :
                          activity.status === 'in_progress' ? 'bg-warning' :
                          'bg-neutral-dark'}
                      `}>
                        {activity.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 text-white" />
                        ) : activity.status === 'in_progress' ? (
                          <Clock className="w-3 h-3 text-white" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-text-muted" />
                        )}
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-text">{activity.title}</p>
                            <p className="text-xs text-text-muted capitalize">
                              {activity.type.replace('_', ' ')} • {activity.status.replace('_', ' ')}
                            </p>
                          </div>
                          <span className="text-xs text-text-muted whitespace-nowrap">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Equipment Issues Alert */}
          {stats.pendingIssues > 0 && (
            <Card className="border-warning">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-[10px] bg-warning-light flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Equipment Issues</h3>
                  <p className="text-sm text-text-light">{stats.pendingIssues} pending</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/maintenance/equipment')}
              >
                View Issues
              </Button>
            </Card>
          )}

          {/* Today's Tasks */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Today's Tasks</h2>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate('/maintenance/tasks')}
              >
                View All
              </Button>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm text-text-light">All tasks completed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-[10px] bg-neutral hover:bg-neutral-dark transition-colors cursor-pointer"
                    onClick={() => navigate('/maintenance/tasks')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{task.title}</p>
                        <p className="text-xs text-text-light mt-0.5">{task.location}</p>
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

          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={Wrench}
                onClick={() => navigate('/maintenance/work-orders')}
              >
                View Work Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={ClipboardList}
                onClick={() => navigate('/maintenance/tasks')}
              >
                View Tasks
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={AlertTriangle}
                onClick={() => navigate('/maintenance/equipment')}
              >
                Equipment Issues
              </Button>
            </div>
          </Card>

          {/* Urgent Alerts */}
          {urgentNotifications.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-text mb-4">Urgent Alerts</h2>
              <div className="space-y-3">
                {urgentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-[10px] border-l-3 border-l-danger bg-danger-light/30"
                  >
                    <p className="text-sm font-medium text-text">{notif.title}</p>
                    <p className="text-xs text-text-light mt-0.5 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
