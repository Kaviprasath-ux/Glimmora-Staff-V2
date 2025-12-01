import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle,
  User,
  MapPin,
  MessageSquare,
  Play,
  Briefcase,
  Shirt,
  Gift,
  ClipboardList,
  ArrowRight
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/Input';
import { useRunner } from '../../hooks/useStaffPortal';

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

const PickupRequests = () => {
  const { pickupRequests, stats, acceptPickup, completePickup } = useRunner();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

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

  // Pagination
  const totalPages = Math.ceil(filteredPickups.length / itemsPerPage);
  const paginatedPickups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPickups.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPickups, currentPage]);

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
    const iconClass = "w-5 h-5 text-text-muted";
    switch (type) {
      case 'luggage':
        return <Briefcase className={iconClass} />;
      case 'laundry':
        return <Shirt className={iconClass} />;
      case 'amenity_request':
        return <Gift className={iconClass} />;
      case 'package':
        return <Package className={iconClass} />;
      default:
        return <ClipboardList className={iconClass} />;
    }
  };

  const handleAccept = (pickup) => {
    acceptPickup(pickup.id);
  };

  const handleComplete = (pickup) => {
    completePickup(pickup.id);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader
        title="Pickup Requests"
        subtitle={`${stats.pendingPickups + stats.inProgressPickups} active requests`}
      />

      {/* Main Card */}
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">All Pickup Requests</h2>
              <p className="text-sm text-text-muted">{filteredPickups.length} requests</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <SearchInput
              placeholder="Search pickup requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 text-xs font-medium rounded-[8px] transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[8px] transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              Pending
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                statusFilter === 'pending' ? 'bg-white/20' : 'bg-warning/10 text-warning'
              }`}>
                {stats.pendingPickups}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[8px] transition-colors ${
                statusFilter === 'in_progress'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              In Progress
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                statusFilter === 'in_progress' ? 'bg-white/20' : 'bg-primary/10 text-primary'
              }`}>
                {stats.inProgressPickups}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[8px] transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              Completed
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                statusFilter === 'completed' ? 'bg-white/20' : 'bg-success/10 text-success'
              }`}>
                {stats.completedPickups}
              </span>
            </button>
          </div>
        </div>

        {/* Pickup Requests List */}
        {filteredPickups.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">No pickup requests found</h3>
            <p className="text-sm text-text-muted">New requests will appear here</p>
          </div>
        ) : (
          <motion.div
            key={statusFilter}
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {paginatedPickups.map((pickup) => (
              <motion.div
                key={pickup.id}
                variants={itemVariants}
                className={`p-5 rounded-[16px] border transition-all relative overflow-hidden ${
                  pickup.status === 'completed'
                    ? 'bg-success/5 border-success/20'
                    : pickup.priority === 'urgent'
                    ? 'bg-danger/5 border-danger/20'
                    : pickup.status === 'in_progress'
                    ? 'bg-warning/5 border-warning/20'
                    : 'bg-white border-border hover:border-primary/30 hover:shadow-sm'
                }`}
              >
                {/* Priority indicator - only show for non-completed urgent items */}
                {pickup.priority === 'urgent' && pickup.status !== 'completed' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-danger" />
                )}

                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div className="w-12 h-12 rounded-xl bg-neutral flex items-center justify-center shrink-0">
                    {getTypeIcon(pickup.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-lg font-semibold text-text">Room {pickup.room}</span>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {getTypeLabel(pickup.type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={pickup.status} />
                          {pickup.priority !== 'normal' && <PriorityBadge priority={pickup.priority} />}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {pickup.status === 'pending' && (
                          <button
                            onClick={() => handleAccept(pickup)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Accept
                          </button>
                        )}
                        {pickup.status === 'in_progress' && (
                          <button
                            onClick={() => handleComplete(pickup)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-success text-white hover:bg-success/90 transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Complete
                          </button>
                        )}
                        {pickup.status === 'completed' && (
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-3 bg-neutral/50 rounded-[10px] mb-4">
                      <p className="text-xs font-medium text-text-muted mb-1">Items</p>
                      <p className="text-sm text-text">{pickup.items}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-text-muted mt-0.5" />
                        <div>
                          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Guest</p>
                          <p className="text-sm text-text">{pickup.guestName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-text-muted mt-0.5" />
                        <div>
                          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Pickup</p>
                          <p className="text-sm text-text">{pickup.pickupLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-text-muted mt-0.5" />
                        <div>
                          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Destination</p>
                          <p className="text-sm text-text">{pickup.destination}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-text-muted mt-0.5" />
                        <div>
                          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Scheduled</p>
                          <p className="text-sm text-text">{formatTime(pickup.scheduledTime)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {pickup.notes && (
                      <div className="p-3 bg-gold/10 rounded-[10px] border border-gold/20 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-3.5 h-3.5 text-gold" />
                          <span className="text-xs font-medium text-gold">Notes</span>
                        </div>
                        <p className="text-sm text-text-muted">{pickup.notes}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-text-muted">
                      <div className="flex items-center gap-4">
                        <span>Requested: {formatDate(pickup.requestedAt)}</span>
                        {pickup.assignedTo && (
                          <span>Assigned: <span className="text-text font-medium">{pickup.assignedTo}</span></span>
                        )}
                      </div>
                      {pickup.completedAt && (
                        <span className="text-success font-medium">Completed: {formatDate(pickup.completedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {filteredPickups.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredPickups.length)} of {filteredPickups.length}
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

export default PickupRequests;
