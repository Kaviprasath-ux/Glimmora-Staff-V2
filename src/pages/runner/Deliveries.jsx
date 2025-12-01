import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Clock,
  CheckCircle,
  User,
  MapPin,
  MessageSquare,
  ArrowRight,
  Play,
  UtensilsCrossed,
  Package,
  Shirt,
  Gift,
  ClipboardList
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

const Deliveries = () => {
  const { deliveries, stats, acceptDelivery, completeDelivery } = useRunner();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(delivery => {
      const matchesSearch =
        delivery.room?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.items?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const statusOrder = { pending: 0, in_transit: 1, delivered: 2 };

      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [deliveries, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const paginatedDeliveries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDeliveries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDeliveries, currentPage]);

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
      room_service: 'Room Service',
      package: 'Package',
      laundry: 'Laundry Return',
      amenity: 'Amenity',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type) => {
    const iconClass = "w-5 h-5 text-text-muted";
    switch (type) {
      case 'room_service':
        return <UtensilsCrossed className={iconClass} />;
      case 'package':
        return <Package className={iconClass} />;
      case 'laundry':
        return <Shirt className={iconClass} />;
      case 'amenity':
        return <Gift className={iconClass} />;
      default:
        return <ClipboardList className={iconClass} />;
    }
  };

  const handleAccept = (delivery) => {
    acceptDelivery(delivery.id);
  };

  const handleComplete = (delivery) => {
    completeDelivery(delivery.id);
  };

  const getDeliveryTimeDiff = (estimatedDelivery) => {
    if (!estimatedDelivery) return null;
    const estimated = new Date(estimatedDelivery);
    const now = new Date();
    const diffMs = estimated - now;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0) return { text: `${Math.abs(diffMins)}m overdue`, isLate: true };
    if (diffMins === 0) return { text: 'Due now', isLate: false };
    return { text: `${diffMins}m remaining`, isLate: false };
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader
        title="Deliveries"
        subtitle={`${stats.pendingDeliveries + stats.inTransitDeliveries} active deliveries`}
      />

      {/* Main Card */}
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-teal" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">All Deliveries</h2>
              <p className="text-sm text-text-muted">{filteredDeliveries.length} deliveries</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <SearchInput
              placeholder="Search deliveries..."
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
                {stats.pendingDeliveries}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter('in_transit')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[8px] transition-colors ${
                statusFilter === 'in_transit'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              In Transit
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                statusFilter === 'in_transit' ? 'bg-white/20' : 'bg-teal/10 text-teal'
              }`}>
                {stats.inTransitDeliveries}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[8px] transition-colors ${
                statusFilter === 'delivered'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              Delivered
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                statusFilter === 'delivered' ? 'bg-white/20' : 'bg-success/10 text-success'
              }`}>
                {stats.deliveredDeliveries}
              </span>
            </button>
          </div>
        </div>

        {/* Deliveries List */}
        {filteredDeliveries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">No deliveries found</h3>
            <p className="text-sm text-text-muted">New deliveries will appear here</p>
          </div>
        ) : (
          <motion.div
            key={statusFilter}
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {paginatedDeliveries.map((delivery) => {
              const timeDiff = getDeliveryTimeDiff(delivery.estimatedDelivery);

              return (
                <motion.div
                  key={delivery.id}
                  variants={itemVariants}
                  className={`p-5 rounded-[16px] border transition-all relative overflow-hidden ${
                    delivery.status === 'delivered'
                      ? 'bg-success/5 border-success/20'
                      : delivery.status === 'in_transit'
                      ? 'bg-teal/5 border-teal/20'
                      : delivery.priority === 'urgent'
                      ? 'bg-danger/5 border-danger/20'
                      : 'bg-white border-border hover:border-primary/30 hover:shadow-sm'
                  }`}
                >
                  {/* Status indicator - only for in_transit */}
                  {delivery.status === 'in_transit' && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-teal" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className="w-12 h-12 rounded-xl bg-neutral flex items-center justify-center shrink-0">
                      {getTypeIcon(delivery.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-lg font-semibold text-text">Room {delivery.room}</span>
                            <span className="text-xs font-medium text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                              {getTypeLabel(delivery.type)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={delivery.status} />
                            {delivery.priority !== 'normal' && <PriorityBadge priority={delivery.priority} />}
                            {delivery.status !== 'delivered' && timeDiff && (
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                timeDiff.isLate
                                  ? 'bg-danger/10 text-danger'
                                  : 'bg-success/10 text-success'
                              }`}>
                                {timeDiff.text}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {delivery.status === 'pending' && (
                            <button
                              onClick={() => handleAccept(delivery)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                            >
                              <Play className="w-3.5 h-3.5" />
                              Accept
                            </button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <button
                              onClick={() => handleComplete(delivery)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-success text-white hover:bg-success/90 transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Delivered
                            </button>
                          )}
                          {delivery.status === 'delivered' && (
                            <div className="flex items-center gap-2 text-success">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Delivered</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-3 bg-neutral/50 rounded-[10px] mb-4">
                        <p className="text-xs font-medium text-text-muted mb-1">Items</p>
                        <p className="text-sm text-text">{delivery.items}</p>
                      </div>

                      {/* Route */}
                      <div className="p-3 bg-teal/5 rounded-[10px] border border-teal/10 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-3.5 h-3.5 text-teal" />
                              <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">From</p>
                            </div>
                            <p className="text-sm font-medium text-text">{delivery.origin}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                            <ArrowRight className="w-4 h-4 text-teal" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-3.5 h-3.5 text-teal" />
                              <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">To</p>
                            </div>
                            <p className="text-sm font-medium text-text">{delivery.destination}</p>
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 text-text-muted mt-0.5" />
                          <div>
                            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Guest</p>
                            <p className="text-sm text-text">{delivery.guestName}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-text-muted mt-0.5" />
                          <div>
                            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">ETA</p>
                            <p className="text-sm text-text">{formatTime(delivery.estimatedDelivery)}</p>
                          </div>
                        </div>

                        {delivery.assignedTo && (
                          <div className="flex items-start gap-2">
                            <Truck className="w-4 h-4 text-text-muted mt-0.5" />
                            <div>
                              <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Runner</p>
                              <p className="text-sm text-text">{delivery.assignedTo}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Special Instructions */}
                      {delivery.specialInstructions && (
                        <div className="p-3 bg-gold/10 rounded-[10px] border border-gold/20 mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-3.5 h-3.5 text-gold" />
                            <span className="text-xs font-medium text-gold">Special Instructions</span>
                          </div>
                          <p className="text-sm text-text-muted">{delivery.specialInstructions}</p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-text-muted">
                        <span>Ordered: {formatDate(delivery.orderedAt)}</span>
                        {delivery.deliveredAt && (
                          <span className="text-success font-medium">Delivered: {formatDate(delivery.deliveredAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {filteredDeliveries.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredDeliveries.length)} of {filteredDeliveries.length}
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

export default Deliveries;
