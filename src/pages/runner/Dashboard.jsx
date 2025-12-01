import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  ChevronRight,
  Play,
  MapPin,
  User,
  AlertTriangle,
  ArrowRight,
  Timer,
  Zap,
  Briefcase,
  Shirt,
  Gift,
  UtensilsCrossed,
  ClipboardList
} from 'lucide-react';
import { DashboardHeader } from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { useProfile, useRunner, useNotifications } from '../../hooks/useStaffPortal';

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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const RunnerDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const {
    pickupRequests,
    deliveries,
    stats,
    acceptPickup,
    completePickup,
    acceptDelivery,
    completeDelivery
  } = useRunner();
  const { notifications } = useNotifications();

  const averageCompletionTime = useMemo(() => {
    const completedDeliveries = deliveries.filter(d => d.status === 'delivered' && d.deliveredAt);
    if (completedDeliveries.length === 0) return '0m';

    const totalMs = completedDeliveries.reduce((acc, d) => {
      const ordered = new Date(d.orderedAt);
      const delivered = new Date(d.deliveredAt);
      return acc + (delivered - ordered);
    }, 0);

    const avgMs = totalMs / completedDeliveries.length;
    const minutes = Math.round(avgMs / 60000);
    return `${minutes}m`;
  }, [deliveries]);

  const activePickups = useMemo(() => {
    return pickupRequests
      .filter(pr => pr.status !== 'completed')
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 3);
  }, [pickupRequests]);

  const activeDeliveries = useMemo(() => {
    return deliveries
      .filter(d => d.status !== 'delivered')
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 3);
  }, [deliveries]);

  const urgentNotifications = useMemo(() => {
    return notifications
      .filter(n => !n.read && (n.priority === 'urgent' || n.priority === 'high'))
      .slice(0, 3);
  }, [notifications]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleAcceptPickup = (pickup, e) => {
    e?.stopPropagation();
    acceptPickup(pickup.id);
  };

  const handleCompletePickup = (pickup, e) => {
    e?.stopPropagation();
    completePickup(pickup.id);
  };

  const handleAcceptDelivery = (delivery, e) => {
    e?.stopPropagation();
    acceptDelivery(delivery.id);
  };

  const handleCompleteDelivery = (delivery, e) => {
    e?.stopPropagation();
    completeDelivery(delivery.id);
  };

  const getTypeIcon = (type) => {
    const iconClass = "w-5 h-5 text-text-muted";
    switch (type) {
      case 'luggage':
        return <Briefcase className={iconClass} />;
      case 'laundry':
        return <Shirt className={iconClass} />;
      case 'amenity_request':
        return <Gift className={iconClass} />;
      case 'room_service':
        return <UtensilsCrossed className={iconClass} />;
      case 'package':
        return <Package className={iconClass} />;
      default:
        return <ClipboardList className={iconClass} />;
    }
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
          className="bg-white rounded-[16px] border border-border p-4 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Active Pickups</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-[18px] h-[18px] text-primary" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-text">{stats.pendingPickups + stats.inProgressPickups}</span>
            {stats.urgentPickups > 0 && (
              <span className="text-xs font-medium text-danger bg-danger/10 px-2 py-0.5 rounded-full">
                {stats.urgentPickups} urgent
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Active Deliveries</span>
            <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center">
              <Truck className="w-[18px] h-[18px] text-teal" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-text">{stats.pendingDeliveries + stats.inTransitDeliveries}</span>
            {stats.inTransitDeliveries > 0 && (
              <span className="text-xs font-medium text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                {stats.inTransitDeliveries} in transit
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Avg Time</span>
            <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
              <Timer className="w-[18px] h-[18px] text-warning" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-text">{averageCompletionTime}</span>
            <span className="text-xs text-text-muted">per delivery</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Completed Today</span>
            <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-[18px] h-[18px] text-success" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-success">{stats.completedPickups + stats.deliveredDeliveries}</span>
            <span className="text-xs text-text-muted">tasks done</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pickup Requests */}
          <motion.div variants={itemVariants}>
            <Card>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Active Pickups</h2>
                    <p className="text-sm text-text-muted">{activePickups.length} pending</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/runner/pickups')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary/30 transition-colors"
                >
                  View All
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {activePickups.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-neutral flex items-center justify-center mx-auto mb-3">
                    <Package className="w-7 h-7 text-text-muted" />
                  </div>
                  <p className="text-sm text-text-muted">No active pickups</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activePickups.map((pickup) => (
                    <motion.div
                      key={pickup.id}
                      variants={itemVariants}
                      className={`
                        p-4 rounded-[12px] border transition-all
                        ${pickup.priority === 'urgent'
                          ? 'bg-danger/5 border-danger/20 hover:shadow-md'
                          : pickup.status === 'in_progress'
                          ? 'bg-warning/5 border-warning/20'
                          : 'bg-white border-border hover:border-primary/30 hover:shadow-sm'}
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-neutral flex items-center justify-center shrink-0">
                          {getTypeIcon(pickup.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-text">Room {pickup.room}</span>
                            <StatusBadge status={pickup.status} />
                            {pickup.priority !== 'normal' && <PriorityBadge priority={pickup.priority} />}
                          </div>

                          <p className="text-sm text-text-muted mb-2 line-clamp-1">{pickup.items}</p>

                          <div className="flex items-center gap-4 text-xs text-text-muted">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span>{pickup.guestName}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatTime(pickup.scheduledTime)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {pickup.status === 'pending' && (
                            <button
                              onClick={(e) => handleAcceptPickup(pickup, e)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                            >
                              <Play className="w-3.5 h-3.5" />
                              Accept
                            </button>
                          )}
                          {pickup.status === 'in_progress' && (
                            <button
                              onClick={(e) => handleCompletePickup(pickup, e)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-success text-white hover:bg-success/90 transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Deliveries */}
          <motion.div variants={itemVariants}>
            <Card>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Active Deliveries</h2>
                    <p className="text-sm text-text-muted">{activeDeliveries.length} pending</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/runner/deliveries')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary/30 transition-colors"
                >
                  View All
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeDeliveries.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-neutral flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-7 h-7 text-text-muted" />
                  </div>
                  <p className="text-sm text-text-muted">No active deliveries</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeDeliveries.map((delivery) => (
                    <motion.div
                      key={delivery.id}
                      variants={itemVariants}
                      className={`
                        p-4 rounded-[12px] border transition-all
                        ${delivery.status === 'in_transit'
                          ? 'bg-teal/5 border-teal/20'
                          : 'bg-white border-border hover:border-primary/30 hover:shadow-sm'}
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-neutral flex items-center justify-center shrink-0">
                          {getTypeIcon(delivery.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-text">Room {delivery.room}</span>
                            <StatusBadge status={delivery.status} />
                            {delivery.priority !== 'normal' && <PriorityBadge priority={delivery.priority} />}
                          </div>

                          <p className="text-sm text-text-muted mb-2 line-clamp-1">{delivery.items}</p>

                          <div className="flex items-center gap-4 text-xs text-text-muted">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="flex items-center gap-1">
                                {delivery.origin}
                                <ArrowRight className="w-3 h-3" />
                                {delivery.destination}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>ETA: {formatTime(delivery.estimatedDelivery)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {delivery.status === 'pending' && (
                            <button
                              onClick={(e) => handleAcceptDelivery(delivery, e)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                            >
                              <Play className="w-3.5 h-3.5" />
                              Accept
                            </button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <button
                              onClick={(e) => handleCompleteDelivery(delivery, e)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-success text-white hover:bg-success/90 transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-text">Quick Actions</h2>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/runner/pickups')}
                  className="w-full flex items-center gap-3 p-3 rounded-[10px] bg-neutral hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-text">View All Pickups</span>
                  <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
                </button>
                <button
                  onClick={() => navigate('/runner/deliveries')}
                  className="w-full flex items-center gap-3 p-3 rounded-[10px] bg-neutral hover:bg-teal/5 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                    <Truck className="w-4 h-4 text-teal" />
                  </div>
                  <span className="text-sm font-medium text-text">View All Deliveries</span>
                  <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Stats Summary */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <h2 className="text-lg font-semibold text-text">Today's Summary</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-[10px] bg-neutral/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-text-muted">Total Pickups</span>
                  </div>
                  <span className="text-lg font-bold text-text">{stats.totalPickups}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-[10px] bg-neutral/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-teal" />
                    </div>
                    <span className="text-sm text-text-muted">Total Deliveries</span>
                  </div>
                  <span className="text-lg font-bold text-text">{stats.totalDeliveries}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-[10px] bg-success/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm text-text-muted">Completed</span>
                  </div>
                  <span className="text-lg font-bold text-success">
                    {stats.completedPickups + stats.deliveredDeliveries}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-[10px] bg-warning/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-warning" />
                    </div>
                    <span className="text-sm text-text-muted">In Progress</span>
                  </div>
                  <span className="text-lg font-bold text-warning">
                    {stats.inProgressPickups + stats.inTransitDeliveries}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Urgent Alerts */}
          {urgentNotifications.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-danger" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Urgent Alerts</h2>
                    <p className="text-xs text-danger">{urgentNotifications.length} require attention</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {urgentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 rounded-[10px] bg-danger/5 border-l-3 border-l-danger"
                    >
                      <p className="text-sm font-medium text-text">{notif.title}</p>
                      <p className="text-xs text-text-muted mt-1 line-clamp-2">{notif.message}</p>
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

export default RunnerDashboard;
