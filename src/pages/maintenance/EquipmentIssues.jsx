import { useState, useMemo } from 'react';
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
import Button from '../../components/ui/Button';
import { SearchInput, Select, Textarea } from '../../components/ui/Input';
import Input from '../../components/ui/Input';
import { FormModal, ConfirmModal } from '../../components/ui/Modal';
import { useMaintenance, useProfile } from '../../hooks/useStaffPortal';

const EquipmentIssues = () => {
  const { profile } = useProfile();
  const { equipmentIssues, addEquipmentIssue, updateEquipmentIssue, deleteEquipmentIssue, stats } = useMaintenance();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
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
  };

  const severityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  return (
    <div>
      <PageHeader
        title="Equipment Issues"
        subtitle={`${issueStats.pending + issueStats.in_progress} open issues`}
        actions={
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Report Issue
          </Button>
        }
      />

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div
          className={`p-4 rounded-[14px] cursor-pointer transition-all ${
            statusFilter === 'pending' ? 'bg-warning-light ring-2 ring-warning' : 'bg-white border border-border hover:border-warning'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            <span className="text-2xl font-bold text-text">{issueStats.pending}</span>
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
            <Wrench className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-text">{issueStats.in_progress}</span>
          </div>
          <p className="text-sm text-text-light mt-1">In Progress</p>
        </div>

        <div
          className={`p-4 rounded-[14px] cursor-pointer transition-all ${
            statusFilter === 'resolved' ? 'bg-success-light ring-2 ring-success' : 'bg-white border border-border hover:border-success'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved')}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-2xl font-bold text-text">{issueStats.resolved}</span>
          </div>
          <p className="text-sm text-text-light mt-1">Resolved</p>
        </div>

        <div className="p-4 rounded-[14px] bg-danger-light border border-danger/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <span className="text-2xl font-bold text-text">{issueStats.critical}</span>
          </div>
          <p className="text-sm text-text-light mt-1">Critical</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search equipment issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <Card className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No equipment issues found</h3>
          <p className="text-text-light mb-4">Report an issue to track equipment problems</p>
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Report Issue
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="relative">
              {/* Severity indicator */}
              {issue.severity === 'critical' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-danger rounded-t-[14px]" />
              )}

              <div className="flex items-start justify-between mb-3">
                <div className={`
                  w-12 h-12 rounded-[10px] flex items-center justify-center
                  ${issue.severity === 'critical' ? 'bg-danger-light' :
                    issue.severity === 'high' ? 'bg-warning-light' :
                    'bg-primary/10'}
                `}>
                  <AlertTriangle className={`w-6 h-6 ${
                    issue.severity === 'critical' ? 'text-danger' :
                    issue.severity === 'high' ? 'text-warning' :
                    'text-primary'
                  }`} />
                </div>

                <div className="flex items-center gap-2">
                  <SeverityBadge severity={issue.severity} />
                  <button
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-text mb-1">{issue.equipment}</h3>
              <p className="text-sm text-primary font-medium mb-2">{issue.issue}</p>

              {issue.description && (
                <p className="text-sm text-text-light mb-3 line-clamp-2">{issue.description}</p>
              )}

              {/* Status */}
              <div className="mb-4">
                <StatusBadge status={issue.status} />
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-light">
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <span>{issue.location}</span>
                </div>

                <div className="flex items-center gap-2 text-text-light">
                  <Calendar className="w-4 h-4 text-text-muted" />
                  <span>Reported: {formatDate(issue.reportedAt)}</span>
                </div>

                {issue.lastServiceDate && (
                  <div className="flex items-center gap-2 text-text-light">
                    <Wrench className="w-4 h-4 text-text-muted" />
                    <span>Last Service: {formatDate(issue.lastServiceDate)}</span>
                  </div>
                )}

                {issue.warrantyStatus && (
                  <div className="flex items-center gap-2 text-text-light">
                    <Shield className="w-4 h-4 text-text-muted" />
                    <span className={
                      issue.warrantyStatus.includes('Active') ? 'text-success' :
                      issue.warrantyStatus === 'Expired' ? 'text-danger' :
                      ''
                    }>
                      Warranty: {issue.warrantyStatus}
                    </span>
                  </div>
                )}

                {issue.assignedTo && (
                  <div className="flex items-center gap-2 text-text-light">
                    <span className="text-text-muted">Assigned to:</span>
                    <span className="font-medium text-text">{issue.assignedTo}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                {issue.status === 'pending' && (
                  <Button
                    size="sm"
                    className="flex-1"
                    icon={Play}
                    onClick={() => handleStartIssue(issue)}
                  >
                    Start Work
                  </Button>
                )}
                {issue.status === 'in_progress' && (
                  <Button
                    size="sm"
                    variant="success"
                    className="flex-1"
                    icon={CheckCircle}
                    onClick={() => handleResolveIssue(issue)}
                  >
                    Mark Resolved
                  </Button>
                )}
                {issue.status === 'resolved' && (
                  <div className="flex items-center gap-2 text-success flex-1 justify-center">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Resolved</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

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
    </div>
  );
};

export default EquipmentIssues;
