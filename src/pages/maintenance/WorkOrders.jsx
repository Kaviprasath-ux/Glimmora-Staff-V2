import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench,
  Plus,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import { StatusBadge, SeverityBadge } from '../../components/ui/Badge';
import { SearchInput, Select, Textarea } from '../../components/ui/Input';
import Input from '../../components/ui/Input';
import { FormModal } from '../../components/ui/Modal';
import { useMaintenance, useProfile } from '../../hooks/useStaffPortal';

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

const WorkOrders = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { workOrders, stats, addWorkOrder, updateWorkOrderStatus, addWorkOrderComment } = useMaintenance();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [newWorkOrder, setNewWorkOrder] = useState({
    title: '',
    description: '',
    location: '',
    room: '',
    issueType: 'General',
    severity: 'medium',
    estimatedHours: 1
  });

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(wo => {
      const matchesSearch =
        wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const statusOrder = { in_progress: 0, pending: 1, completed: 2 };

      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [workOrders, searchQuery, statusFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredWorkOrders.length / itemsPerPage);
  const paginatedWorkOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredWorkOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWorkOrders, currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleAddWorkOrder = () => {
    addWorkOrder({
      ...newWorkOrder,
      status: 'pending',
      reportedBy: profile?.name || 'Staff',
      assignedTo: profile?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + newWorkOrder.estimatedHours * 3600000).toISOString(),
      comments: [],
      photos: [],
      parts: []
    });
    setNewWorkOrder({
      title: '',
      description: '',
      location: '',
      room: '',
      issueType: 'General',
      severity: 'medium',
      estimatedHours: 1
    });
    setShowAddModal(false);
  };

  const handleAddComment = () => {
    if (selectedWorkOrder && newComment.trim()) {
      addWorkOrderComment(selectedWorkOrder.id, {
        author: profile?.name || 'Staff',
        text: newComment
      });
      setNewComment('');
      setShowCommentModal(false);
      setSelectedWorkOrder(null);
    }
  };

  const handleStartWorkOrder = (wo, e) => {
    e?.stopPropagation();
    updateWorkOrderStatus(wo.id, 'in_progress');
  };

  const handleCompleteWorkOrder = (wo, e) => {
    e?.stopPropagation();
    updateWorkOrderStatus(wo.id, 'completed');
  };

  const issueTypeOptions = [
    { value: 'General', label: 'General' },
    { value: 'HVAC', label: 'HVAC' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Elevator', label: 'Elevator' },
    { value: 'Structural', label: 'Structural' },
    { value: 'Appliance', label: 'Appliance' },
    { value: 'Safety', label: 'Safety' }
  ];

  const severityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader
        title="Work Orders"
        subtitle={`${stats.pendingWorkOrders + stats.inProgressWorkOrders} open work orders`}
      />

      {/* Main Card */}
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">All Work Orders</h2>
              <p className="text-sm text-text-muted">{filteredWorkOrders.length} orders</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Order
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <SearchInput
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <div className="flex items-center gap-2">
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
                {stats.pendingWorkOrders}
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
                {stats.inProgressWorkOrders}
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
                {stats.completedWorkOrders}
              </span>
            </button>
          </div>
        </div>

        {/* Work Orders List */}
        {filteredWorkOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">No work orders found</h3>
            <p className="text-sm text-text-muted mb-4">Create a new work order to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Work Order
            </button>
          </div>
        ) : (
          <motion.div
            key={statusFilter}
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {paginatedWorkOrders.map((wo) => (
              <motion.div
                key={wo.id}
                variants={itemVariants}
                className="p-4 rounded-[12px] border border-border hover:border-primary-200 transition-all"
              >
                {/* Header Row */}
                <div className="flex items-start gap-3 mb-3">
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-text">{wo.title}</h3>
                      <SeverityBadge severity={wo.severity} />
                      <StatusBadge status={wo.status} />
                    </div>
                    <p className="text-xs text-text-muted mt-1">{wo.issueType}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {wo.status === 'pending' && (
                      <button
                        onClick={(e) => handleStartWorkOrder(wo, e)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Start
                      </button>
                    )}
                    {wo.status === 'in_progress' && (
                      <button
                        onClick={(e) => handleCompleteWorkOrder(wo, e)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-success text-white hover:bg-success/90 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Complete
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWorkOrder(wo);
                        setShowCommentModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {wo.comments?.length || 0}
                    </button>
                  </div>
                </div>

                {wo.description && (
                  <p className="text-sm text-text-muted mb-3 line-clamp-2">{wo.description}</p>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-xs text-text-muted">{wo.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-xs text-text-muted">{wo.assignedTo || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-xs text-text-muted">Due: {formatDate(wo.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-xs text-text-muted">Est: {wo.estimatedHours}h</span>
                  </div>
                </div>

                {/* Latest Comment */}
                {wo.comments && wo.comments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Latest comment</p>
                    <div className="bg-neutral/50 p-3 rounded-[8px]">
                      <p className="text-xs text-text">{wo.comments[wo.comments.length - 1].text}</p>
                      <p className="text-[10px] text-text-muted mt-1">— {wo.comments[wo.comments.length - 1].author}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {filteredWorkOrders.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredWorkOrders.length)} of {filteredWorkOrders.length}
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

      {/* Add Work Order Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddWorkOrder}
        title="Create Work Order"
        submitText="Create"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Brief description of the issue"
            value={newWorkOrder.title}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, title: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Detailed description of the problem..."
            value={newWorkOrder.description}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="e.g., Room 305, Lobby"
              value={newWorkOrder.location}
              onChange={(e) => setNewWorkOrder({ ...newWorkOrder, location: e.target.value })}
              required
            />

            <Input
              label="Room Number (if applicable)"
              placeholder="e.g., 305"
              value={newWorkOrder.room}
              onChange={(e) => setNewWorkOrder({ ...newWorkOrder, room: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Issue Type"
              options={issueTypeOptions}
              value={newWorkOrder.issueType}
              onChange={(e) => setNewWorkOrder({ ...newWorkOrder, issueType: e.target.value })}
            />

            <Select
              label="Severity"
              options={severityOptions}
              value={newWorkOrder.severity}
              onChange={(e) => setNewWorkOrder({ ...newWorkOrder, severity: e.target.value })}
            />
          </div>

          <Input
            label="Estimated Hours"
            type="number"
            min={0.5}
            step={0.5}
            value={newWorkOrder.estimatedHours}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, estimatedHours: parseFloat(e.target.value) || 1 })}
          />
        </div>
      </FormModal>

      {/* Comment Modal */}
      <FormModal
        isOpen={showCommentModal}
        onClose={() => {
          setShowCommentModal(false);
          setSelectedWorkOrder(null);
          setNewComment('');
        }}
        onSubmit={handleAddComment}
        title="Add Comment"
        subtitle={selectedWorkOrder?.title}
        submitText="Add Comment"
        size="default"
      >
        <div className="space-y-4">
          {/* Existing Comments */}
          {selectedWorkOrder?.comments && selectedWorkOrder.comments.length > 0 && (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {selectedWorkOrder.comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-neutral rounded-[10px]">
                  <p className="text-sm text-text">{comment.text}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {comment.author} • {formatDate(comment.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Textarea
            label="New Comment"
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
        </div>
      </FormModal>
    </motion.div>
  );
};

export default WorkOrders;
