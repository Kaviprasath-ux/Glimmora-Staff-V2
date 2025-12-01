import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import Card from '../../components/ui/Card';
import { StatusBadge, SeverityBadge } from '../../components/ui/Badge';
import { useProfile, useMaintenance, useNotifications } from '../../hooks/useStaffPortal';

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <DashboardHeader name={profile?.name} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Open Orders</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-primary" />
            </div>
          </div>
          <span className="text-2xl font-bold text-text">{stats.pendingWorkOrders + stats.inProgressWorkOrders}</span>
          <p className="text-xs text-text-muted mt-1">{stats.pendingWorkOrders} pending</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Critical</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              stats.criticalWorkOrders > 0 ? 'bg-danger/10' : 'bg-neutral'
            }`}>
              <AlertTriangle className={`w-4 h-4 ${stats.criticalWorkOrders > 0 ? 'text-danger' : 'text-text-muted'}`} />
            </div>
          </div>
          <span className={`text-2xl font-bold ${stats.criticalWorkOrders > 0 ? 'text-danger' : 'text-text'}`}>
            {stats.criticalWorkOrders}
          </span>
          <p className="text-xs text-text-muted mt-1">Immediate action</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Tasks Today</span>
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-gold" />
            </div>
          </div>
          <span className="text-2xl font-bold text-text">{stats.pendingTasks + stats.inProgressTasks}</span>
          <p className="text-xs text-text-muted mt-1">{stats.inProgressTasks} in progress</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-success" />
            </div>
          </div>
          <span className="text-2xl font-bold text-success">{stats.completedWorkOrders + stats.completedTasks}</span>
          <p className="text-xs text-text-muted mt-1">This week</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Work Orders */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Recent Work Orders</h2>
                  <p className="text-sm text-text-muted">{recentWorkOrders.length} active orders</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/maintenance/work-orders')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 transition-colors"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentWorkOrders.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-neutral flex items-center justify-center mx-auto mb-3">
                  <Wrench className="w-6 h-6 text-text-muted" />
                </div>
                <p className="text-sm text-text-muted">No open work orders</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentWorkOrders.map((wo) => (
                  <div
                    key={wo.id}
                    className="flex items-center gap-4 py-4 cursor-pointer hover:bg-primary-50/50 -mx-6 px-6 transition-colors"
                    onClick={() => navigate(`/maintenance/work-orders/${wo.id}`)}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center shrink-0
                      ${wo.severity === 'critical' ? 'bg-danger/10' :
                        wo.severity === 'high' ? 'bg-warning/10' :
                        'bg-primary/10'}
                    `}>
                      {wo.severity === 'critical' ? (
                        <AlertCircle className="w-5 h-5 text-danger" />
                      ) : (
                        <Wrench className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text truncate">{wo.title}</span>
                        <SeverityBadge severity={wo.severity} />
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                        <span>{wo.location}</span>
                        <span>•</span>
                        <span>{wo.issueType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {wo.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartWorkOrder(wo);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Start
                        </button>
                      )}
                      <StatusBadge status={wo.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Timeline */}
          <motion.div variants={itemVariants} className="mt-6">
            <Card>
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Recent Activity</h2>
                  <p className="text-sm text-text-muted">Latest updates</p>
                </div>
              </div>

              {recentActivity.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No recent activity</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={`${activity.type}-${activity.id}`} className="relative flex gap-4 pl-10">
                        <div className={`
                          absolute left-2 w-5 h-5 rounded-full flex items-center justify-center
                          ${activity.status === 'completed' ? 'bg-success' :
                            activity.status === 'in_progress' ? 'bg-warning' :
                            'bg-neutral'}
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
          </motion.div>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Equipment Issues Alert */}
          {stats.pendingIssues > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Equipment Issues</h2>
                    <p className="text-sm text-text-muted">{stats.pendingIssues} pending</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/maintenance/equipment')}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 transition-colors"
                >
                  View Issues
                </button>
              </Card>
            </motion.div>
          )}

          {/* Today's Tasks */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Today's Tasks</h2>
                    <p className="text-sm text-text-muted">{todaysTasks.length} remaining</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/maintenance/tasks')}
                  className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  View All
                </button>
              </div>

              {todaysTasks.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-sm text-text-muted">All tasks completed!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between py-3 px-3 rounded-[10px] bg-neutral/50 hover:bg-neutral transition-colors cursor-pointer"
                      onClick={() => navigate('/maintenance/tasks')}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{task.title}</p>
                        <p className="text-xs text-text-muted mt-0.5">{task.location}</p>
                      </div>
                      {task.status === 'todo' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTask(task);
                          }}
                          className="p-2 rounded-[6px] text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Quick Actions</h2>
                  <p className="text-sm text-text-muted">Navigate to sections</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/maintenance/work-orders')}
                  className="w-full inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-[10px] bg-neutral/50 text-text hover:bg-neutral transition-colors"
                >
                  <Wrench className="w-4 h-4 text-primary" />
                  Work Orders
                </button>
                <button
                  onClick={() => navigate('/maintenance/tasks')}
                  className="w-full inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-[10px] bg-neutral/50 text-text hover:bg-neutral transition-colors"
                >
                  <ClipboardList className="w-4 h-4 text-gold" />
                  Maintenance Tasks
                </button>
                <button
                  onClick={() => navigate('/maintenance/equipment')}
                  className="w-full inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-[10px] bg-neutral/50 text-text hover:bg-neutral transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Equipment Issues
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Urgent Alerts */}
          {urgentNotifications.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-danger" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Urgent Alerts</h2>
                    <p className="text-sm text-text-muted">{urgentNotifications.length} alerts</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {urgentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 rounded-[10px] bg-danger/5 border-l-2 border-l-danger"
                    >
                      <p className="text-sm font-medium text-text">{notif.title}</p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MaintenanceDashboard;
