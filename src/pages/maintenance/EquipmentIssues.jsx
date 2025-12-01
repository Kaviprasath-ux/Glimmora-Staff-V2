import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Plus,
  Play,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Shield,
  Wrench,
  Trash2
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import { StatusBadge, SeverityBadge } from '../../components/ui/Badge';
import { SearchInput, Select, Textarea } from '../../components/ui/Input';
import Input from '../../components/ui/Input';
import { FormModal, ConfirmModal } from '../../components/ui/Modal';
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

const EquipmentIssues = () => {
  const { profile } = useProfile();
  const { equipmentIssues, addEquipmentIssue, updateEquipmentIssue, deleteEquipmentIssue, stats } = useMaintenance();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [newIssue, setNewIssue] = useState({
    equipment: '',
    location: '',
    issue: '',
    description: '',
    severity: 'medium'
  });

  const filteredIssues = useMemo(() => {
    return equipmentIssues.filter(issue => {
      const matchesSearch =
        issue.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const statusOrder = { in_progress: 0, pending: 1, resolved: 2 };

      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [equipmentIssues, searchQuery, statusFilter]);

  const issueStats = useMemo(() => ({
    pending: equipmentIssues.filter(i => i.status === 'pending').length,
    in_progress: equipmentIssues.filter(i => i.status === 'in_progress').length,
    resolved: equipmentIssues.filter(i => i.status === 'resolved').length,
    critical: equipmentIssues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length
  }), [equipmentIssues]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredIssues.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredIssues, currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAddIssue = () => {
    addEquipmentIssue({
      ...newIssue,
      status: 'pending',
      reportedBy: profile?.name || 'Staff',
      reportedAt: new Date().toISOString(),
      assignedTo: null,
      lastServiceDate: null,
      warrantyStatus: 'Unknown'
    });
    setNewIssue({
      equipment: '',
      location: '',
      issue: '',
      description: '',
      severity: 'medium'
    });
    setShowAddModal(false);
  };

  const handleStartIssue = (issue) => {
    updateEquipmentIssue({
      ...issue,
      status: 'in_progress',
      assignedTo: profile?.name
    });
  };

  const handleResolveIssue = (issue) => {
    updateEquipmentIssue({
      ...issue,
      status: 'resolved'
    });
  };

  const handleDeleteConfirm = () => {
    if (selectedIssue) {
      deleteEquipmentIssue(selectedIssue.id);
      setSelectedIssue(null);
    }
    setShowDeleteModal(false);
  };

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
        title="Equipment Issues"
        subtitle={`${issueStats.pending + issueStats.in_progress} open issues`}
      />

      {/* Main Card */}
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">Equipment Issues</h2>
              <p className="text-sm text-text-muted">{filteredIssues.length} issues</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Report Issue
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <SearchInput
              placeholder="Search equipment issues..."
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
                {issueStats.pending}
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
                {issueStats.in_progress}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[8px] transition-colors ${
                statusFilter === 'resolved'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              Resolved
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                statusFilter === 'resolved' ? 'bg-white/20' : 'bg-success/10 text-success'
              }`}>
                {issueStats.resolved}
              </span>
            </button>
            {issueStats.critical > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[8px] bg-danger/10 text-danger">
                <AlertTriangle className="w-3 h-3" />
                {issueStats.critical} Critical
              </span>
            )}
          </div>
        </div>

        {/* Issues Grid */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">No equipment issues found</h3>
            <p className="text-sm text-text-muted mb-4">Report an issue to track equipment problems</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Report Issue
            </button>
          </div>
        ) : (
          <motion.div
            key={statusFilter}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {paginatedIssues.map((issue) => (
              <motion.div
                key={issue.id}
                variants={itemVariants}
                className={`p-5 rounded-[16px] border transition-all ${
                  issue.status === 'resolved'
                    ? 'bg-success/5 border-success/20'
                    : issue.severity === 'critical'
                    ? 'bg-danger/5 border-danger/20 hover:shadow-md'
                    : 'bg-white border-border hover:border-primary/30 hover:shadow-sm'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`
                    w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                    ${issue.severity === 'critical' ? 'bg-danger/10' :
                      issue.severity === 'high' ? 'bg-warning/10' :
                      issue.status === 'resolved' ? 'bg-success/10' :
                      'bg-primary/10'}
                  `}>
                    {issue.status === 'resolved' ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className={`w-5 h-5 ${
                        issue.severity === 'critical' ? 'text-danger' :
                        issue.severity === 'high' ? 'text-warning' :
                        'text-primary'
                      }`} />
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <SeverityBadge severity={issue.severity} />
                    <button
                      onClick={() => {
                        setSelectedIssue(issue);
                        setShowDeleteModal(true);
                      }}
                      className="p-1.5 rounded-[6px] text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className={`font-semibold text-text mb-1 ${issue.status === 'resolved' ? 'line-through opacity-60' : ''}`}>
                    {issue.equipment}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-2">{issue.issue}</p>
                  {issue.description && (
                    <p className="text-sm text-text-muted line-clamp-2">{issue.description}</p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <StatusBadge status={issue.status} />
                </div>

                {/* Details Card */}
                <div className="bg-neutral/50 rounded-[10px] p-3 space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{issue.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{formatDate(issue.reportedAt)}</span>
                  </div>
                  {issue.warrantyStatus && issue.warrantyStatus !== 'Unknown' && (
                    <div className="flex items-center gap-2 text-xs">
                      <Shield className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                      <span className={
                        issue.warrantyStatus.includes('Active') ? 'text-success font-medium' :
                        issue.warrantyStatus === 'Expired' ? 'text-danger font-medium' : 'text-text-muted'
                      }>
                        {issue.warrantyStatus}
                      </span>
                    </div>
                  )}
                  {issue.assignedTo && (
                    <div className="flex items-center gap-2 text-xs">
                      <Wrench className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                      <span className="text-text-muted">Assigned to</span>
                      <span className="font-medium text-text">{issue.assignedTo}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {issue.status === 'pending' && (
                  <button
                    onClick={() => handleStartIssue(issue)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Start Work
                  </button>
                )}
                {issue.status === 'in_progress' && (
                  <button
                    onClick={() => handleResolveIssue(issue)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-[8px] bg-success text-white hover:bg-success/90 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mark Resolved
                  </button>
                )}
                {issue.status === 'resolved' && (
                  <div className="flex items-center justify-center gap-2 py-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Issue Resolved</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {filteredIssues.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredIssues.length)} of {filteredIssues.length}
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

      {/* Add Issue Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddIssue}
        title="Report Equipment Issue"
        submitText="Report Issue"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Equipment Name"
            placeholder="e.g., Ice Machine - Floor 2"
            value={newIssue.equipment}
            onChange={(e) => setNewIssue({ ...newIssue, equipment: e.target.value })}
            required
          />

          <Input
            label="Location"
            placeholder="e.g., Floor 2 Utility Room"
            value={newIssue.location}
            onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
            required
          />

          <Input
            label="Issue Summary"
            placeholder="Brief description of the problem"
            value={newIssue.issue}
            onChange={(e) => setNewIssue({ ...newIssue, issue: e.target.value })}
            required
          />

          <Textarea
            label="Detailed Description"
            placeholder="Provide more details about the issue..."
            value={newIssue.description}
            onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
            rows={3}
          />

          <Select
            label="Severity"
            options={severityOptions}
            value={newIssue.severity}
            onChange={(e) => setNewIssue({ ...newIssue, severity: e.target.value })}
          />
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedIssue(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Equipment Issue"
        message={`Are you sure you want to delete the issue for "${selectedIssue?.equipment}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </motion.div>
  );
};

export default EquipmentIssues;
