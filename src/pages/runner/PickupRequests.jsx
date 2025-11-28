import { useState, useMemo } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  User,
  MapPin,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button, { ButtonGroup, ButtonGroupItem } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Input';
import { useRunner } from '../../hooks/useStaffPortal';

const PickupRequests = () => {
  const { pickupRequests, stats, acceptPickup, completePickup } = useRunner();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPickups = useMemo(() => {
    return pickupRequests.filter(pickup => {
      const matchesSearch =
        pickup.room?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pickup.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pickup.items?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || pickup.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const statusOrder = { pending: 0, in_progress: 1, completed: 2 };

      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [pickupRequests, searchQuery, statusFilter]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      luggage: 'Luggage',
      laundry: 'Laundry',
      amenity_request: 'Amenity Request',
      package: 'Package',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'luggage':
        return '🧳';
      case 'laundry':
        return '👔';
      case 'amenity_request':
        return '🎁';
      case 'package':
        return '📦';
      default:
        return '📋';
    }
  };

  const handleAccept = (pickup) => {
    acceptPickup(pickup.id);
  };

  const handleComplete = (pickup) => {
    completePickup(pickup.id);
  };

  return (
    <div>
      <PageHeader
        title="Pickup Requests"
        subtitle={`${stats.pendingPickups + stats.inProgressPickups} active requests`}
      />

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          className={`p-4 rounded-[14px] cursor-pointer transition-all ${
            statusFilter === 'pending' ? 'bg-warning-light ring-2 ring-warning' : 'bg-white border border-border hover:border-warning'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            <span className="text-2xl font-bold text-text">{stats.pendingPickups}</span>
          </div>
          <p className="text-sm text-text-light mt-1">Pending</p>
        </div>

        <div
          className={`p-4 rounded-[14px] cursor-pointer transition-all ${
            statusFilter === 'in_progress' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-white border border-border hover:border-primary'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
        >
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-text">{stats.inProgressPickups}</span>
          </div>
          <p className="text-sm text-text-light mt-1">In Progress</p>
        </div>

        <div
          className={`p-4 rounded-[14px] cursor-pointer transition-all ${
            statusFilter === 'completed' ? 'bg-success-light ring-2 ring-success' : 'bg-white border border-border hover:border-success'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-2xl font-bold text-text">{stats.completedPickups}</span>
          </div>
          <p className="text-sm text-text-light mt-1">Completed</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search pickup requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Pickup Requests List */}
      {filteredPickups.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No pickup requests found</h3>
          <p className="text-text-light">New requests will appear here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPickups.map((pickup) => (
            <Card key={pickup.id} className="relative overflow-hidden">
              {/* Priority indicator */}
              {pickup.priority === 'urgent' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-danger" />
              )}

              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className="text-3xl flex-shrink-0">{getTypeIcon(pickup.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-semibold text-text">Room {pickup.room}</span>
                        <span className="text-sm text-primary font-medium">{getTypeLabel(pickup.type)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={pickup.status} />
                        {pickup.priority !== 'normal' && <PriorityBadge priority={pickup.priority} />}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {pickup.status === 'pending' && (
                        <Button onClick={() => handleAccept(pickup)}>
                          Accept
                        </Button>
                      )}
                      {pickup.status === 'in_progress' && (
                        <Button variant="success" onClick={() => handleComplete(pickup)}>
                          Mark Complete
                        </Button>
                      )}
                      {pickup.status === 'completed' && (
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-3 p-3 bg-neutral rounded-[10px]">
                    <p className="text-sm font-medium text-text">Items:</p>
                    <p className="text-sm text-text-light">{pickup.items}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-text-muted" />
                      <div>
                        <p className="text-text-muted text-xs">Guest</p>
                        <p className="text-text font-medium">{pickup.guestName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-text-muted" />
                      <div>
                        <p className="text-text-muted text-xs">Pickup Location</p>
                        <p className="text-text font-medium">{pickup.pickupLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-text-muted" />
                      <div>
                        <p className="text-text-muted text-xs">Destination</p>
                        <p className="text-text font-medium">{pickup.destination}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-muted" />
                      <div>
                        <p className="text-text-muted text-xs">Scheduled</p>
                        <p className="text-text font-medium">{formatTime(pickup.scheduledTime)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {pickup.notes && (
                    <div className="mt-4 p-3 bg-gold/10 rounded-[10px] border border-gold/20">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-gold" />
                        <span className="text-xs font-medium text-gold">Notes</span>
                      </div>
                      <p className="text-sm text-text-light">{pickup.notes}</p>
                    </div>
                  )}

                  {/* Assigned To & Timestamps */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-text-muted">
                    <div className="flex items-center gap-4">
                      <span>Requested: {formatDate(pickup.requestedAt)}</span>
                      {pickup.assignedTo && (
                        <span>Assigned to: <span className="text-text font-medium">{pickup.assignedTo}</span></span>
                      )}
                    </div>
                    {pickup.completedAt && (
                      <span className="text-success">Completed: {formatDate(pickup.completedAt)}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PickupRequests;
