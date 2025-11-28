import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  ChevronRight,
  Play,
  MapPin,
  User,
  AlertTriangle
} from 'lucide-react';
import { DashboardHeader } from '../../layouts/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useProfile, useRunner, useNotifications } from '../../hooks/useStaffPortal';

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
    switch (type) {
      case 'luggage':
        return '🧳';
      case 'laundry':
        return '👔';
      case 'amenity_request':
        return '🎁';
      case 'room_service':
        return '🍽️';
      case 'package':
        return '📦';
      default:
        return '📋';
    }
  };

  return (
    <div>
      <DashboardHeader name={profile?.name} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Pickups"
          value={stats.pendingPickups + stats.inProgressPickups}
          subtitle={`${stats.urgentPickups} urgent`}
          icon={Package}
          color="primary"
        />
        <StatCard
          title="Active Deliveries"
          value={stats.pendingDeliveries + stats.inTransitDeliveries}
          subtitle={`${stats.inTransitDeliveries} in transit`}
          icon={Truck}
          color="teal"
        />
        <StatCard
          title="Avg Completion Time"
          value={averageCompletionTime}
          subtitle="Per delivery"
          icon={Clock}
          color="gold"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedPickups + stats.deliveredDeliveries}
          subtitle="Pickups & deliveries"
          icon={CheckCircle}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pickup Requests */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-text">Active Pickups</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/runner/pickups')}
                icon={ChevronRight}
                iconPosition="right"
              >
                View All
              </Button>
            </div>

            {activePickups.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-light">No active pickups</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activePickups.map((pickup) => (
                  <div
                    key={pickup.id}
                    className={`
                      p-4 rounded-[12px] transition-colors
                      ${pickup.priority === 'urgent' ? 'bg-danger-light/30 border border-danger/20' :
                        pickup.status === 'in_progress' ? 'bg-warning-light/30' :
                        'bg-neutral hover:bg-neutral-dark'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getTypeIcon(pickup.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-text">Room {pickup.room}</span>
                          <StatusBadge status={pickup.status} />
                          {pickup.priority !== 'normal' && <PriorityBadge priority={pickup.priority} />}
                        </div>

                        <p className="text-sm text-text-light mt-1 truncate">{pickup.items}</p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{pickup.guestName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(pickup.scheduledTime)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {pickup.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={(e) => handleAcceptPickup(pickup, e)}
                          >
                            Accept
                          </Button>
                        )}
                        {pickup.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={(e) => handleCompletePickup(pickup, e)}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Deliveries */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal" />
                <h2 className="text-lg font-semibold text-text">Active Deliveries</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/runner/deliveries')}
                icon={ChevronRight}
                iconPosition="right"
              >
                View All
              </Button>
            </div>

            {activeDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-light">No active deliveries</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className={`
                      p-4 rounded-[12px] transition-colors
                      ${delivery.status === 'in_transit' ? 'bg-info-light/30 border border-info/20' :
                        'bg-neutral hover:bg-neutral-dark'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getTypeIcon(delivery.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-text">Room {delivery.room}</span>
                          <StatusBadge status={delivery.status} />
                          {delivery.priority !== 'normal' && <PriorityBadge priority={delivery.priority} />}
                        </div>

                        <p className="text-sm text-text-light mt-1 truncate">{delivery.items}</p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{delivery.origin} → {delivery.destination}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>ETA: {formatTime(delivery.estimatedDelivery)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {delivery.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={(e) => handleAcceptDelivery(delivery, e)}
                          >
                            Accept
                          </Button>
                        )}
                        {delivery.status === 'in_transit' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={(e) => handleCompleteDelivery(delivery, e)}
                          >
                            Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={Package}
                onClick={() => navigate('/runner/pickups')}
              >
                View All Pickups
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={Truck}
                onClick={() => navigate('/runner/deliveries')}
              >
                View All Deliveries
              </Button>
            </div>
          </Card>

          {/* Stats Summary */}
          <Card>
            <h2 className="text-lg font-semibold text-text mb-4">Today's Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-text-light">Total Pickups</span>
                </div>
                <span className="font-semibold text-text">{stats.totalPickups}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-teal" />
                  </div>
                  <span className="text-sm text-text-light">Total Deliveries</span>
                </div>
                <span className="font-semibold text-text">{stats.totalDeliveries}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-success-light flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm text-text-light">Completed</span>
                </div>
                <span className="font-semibold text-text">
                  {stats.completedPickups + stats.deliveredDeliveries}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-warning-light flex items-center justify-center">
                    <Clock className="w-4 h-4 text-warning" />
                  </div>
                  <span className="text-sm text-text-light">In Progress</span>
                </div>
                <span className="font-semibold text-text">
                  {stats.inProgressPickups + stats.inTransitDeliveries}
                </span>
              </div>
            </div>
          </Card>

          {/* Urgent Alerts */}
          {urgentNotifications.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-danger" />
                <h2 className="text-lg font-semibold text-text">Urgent Alerts</h2>
              </div>
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

export default RunnerDashboard;
