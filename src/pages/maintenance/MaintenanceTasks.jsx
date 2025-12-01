import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Plus,
  Play,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  RefreshCw,
  CheckSquare
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
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

const MaintenanceTasks = () => {
  const { profile } = useProfile();
  const { tasks, addMTTask, updateMTTask, updateMTTaskStatus, updateMTTaskChecklist, stats } = useMaintenance();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    location: '',
    category: 'general',
    priority: 'normal',
    recurring: false,
    recurringSchedule: 'weekly'
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      const statusOrder = { in_progress: 0, todo: 1, completed: 2 };

      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tasks, searchQuery, statusFilter]);

  const tasksByStatus = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  }), [tasks]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTasks, currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getChecklistProgress = (checklist) => {
    if (!checklist || checklist.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = checklist.filter(c => c.completed).length;
    return {
      completed,
      total: checklist.length,
      percentage: Math.round((completed / checklist.length) * 100)
    };
  };

  const handleAddTask = () => {
    addMTTask({
      ...newTask,
      status: 'todo',
      assignedTo: profile?.name,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      checklist: [
        { id: 'ck1', item: 'Initial inspection', completed: false },
        { id: 'ck2', item: 'Perform maintenance', completed: false },
        { id: 'ck3', item: 'Test operation', completed: false },
        { id: 'ck4', item: 'Document findings', completed: false }
      ]
    });
    setNewTask({
      title: '',
      description: '',
      location: '',
      category: 'general',
      priority: 'normal',
      recurring: false,
      recurringSchedule: 'weekly'
    });
    setShowAddModal(false);
  };

  const handleStartTask = (task) => {
    updateMTTaskStatus(task.id, 'in_progress');
  };

  const handleCompleteTask = (task) => {
    updateMTTaskStatus(task.id, 'completed');
  };

  const handleChecklistToggle = (taskId, checklistId, completed) => {
    updateMTTaskChecklist(taskId, checklistId, completed);
  };

  const categoryOptions = [
    { value: 'general', label: 'General Maintenance' },
    { value: 'safety', label: 'Safety Inspection' },
    { value: 'equipment', label: 'Equipment Maintenance' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'preventive', label: 'Preventive Maintenance' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' }
  ];

  const scheduleOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader
        title="Maintenance Tasks"
        subtitle={`${stats.pendingTasks + stats.inProgressTasks} tasks pending`}
      />

      {/* Main Card */}
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">All Tasks</h2>
              <p className="text-sm text-text-muted">{filteredTasks.length} tasks</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <SearchInput
              placeholder="Search tasks..."
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
              onClick={() => setStatusFilter('todo')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[8px] transition-colors ${
                statusFilter === 'todo'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              To Do
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                statusFilter === 'todo' ? 'bg-white/20' : 'bg-beige/10 text-beige'
              }`}>
                {tasksByStatus.todo.length}
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
                statusFilter === 'in_progress' ? 'bg-white/20' : 'bg-warning/10 text-warning'
              }`}>
                {tasksByStatus.in_progress.length}
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
                {tasksByStatus.completed.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">No tasks found</h3>
            <p className="text-sm text-text-muted mb-4">Create a new task to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
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
            {paginatedTasks.map((task) => {
              const progress = getChecklistProgress(task.checklist);
              const isExpanded = expandedTask === task.id;

              return (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  className={`p-5 rounded-[16px] border transition-all ${
                    task.status === 'completed'
                      ? 'bg-success/5 border-success/20'
                      : 'bg-white border-border hover:border-primary/30 hover:shadow-sm'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={`
                      w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                      ${task.status === 'completed' ? 'bg-success/10' :
                        task.status === 'in_progress' ? 'bg-warning/10' :
                        'bg-primary/10'}
                    `}>
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="w-5 h-5 text-warning" />
                      ) : (
                        <ClipboardList className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Badges */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-text mb-1.5 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                            {task.recurring && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                                <RefreshCw className="w-3 h-3" />
                                {task.recurringSchedule}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0">
                          {task.status === 'todo' && (
                            <button
                              onClick={() => handleStartTask(task)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                            >
                              <Play className="w-3.5 h-3.5" />
                              Start
                            </button>
                          )}
                          {task.status === 'in_progress' && (
                            <button
                              onClick={() => handleCompleteTask(task)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-success text-white hover:bg-success/90 transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Complete
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-sm text-text-muted mb-3 line-clamp-2">{task.description}</p>
                      )}

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted mb-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{task.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      </div>

                      {/* Progress Section */}
                      {task.checklist && task.checklist.length > 0 && (
                        <div className="bg-neutral/50 rounded-[10px] p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-3.5 h-3.5 text-text-muted" />
                              <span className="text-xs font-medium text-text">Checklist Progress</span>
                            </div>
                            <span className="text-xs font-semibold text-text">
                              {progress.completed}/{progress.total}
                              <span className="text-text-muted font-normal ml-1">({progress.percentage}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress.percentage}%` }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                              className={`h-full rounded-full ${
                                progress.percentage === 100 ? 'bg-success' :
                                progress.percentage > 50 ? 'bg-teal' :
                                progress.percentage > 0 ? 'bg-warning' :
                                'bg-neutral'
                              }`}
                            />
                          </div>

                          {/* Checklist Toggle */}
                          <button
                            onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                            className="flex items-center gap-1.5 text-xs text-primary font-medium mt-2 hover:text-primary-dark transition-colors"
                          >
                            {isExpanded ? 'Hide details' : 'View details'}
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="inline-block"
                            >
                              ↓
                            </motion.span>
                          </button>
                        </div>
                      )}

                      {/* Expanded Checklist */}
                      {isExpanded && task.checklist && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-2"
                        >
                          {task.checklist.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleChecklistToggle(task.id, item.id, !item.completed)}
                              className={`
                                flex items-center gap-3 p-3 rounded-[10px] cursor-pointer transition-all
                                ${item.completed
                                  ? 'bg-success/10'
                                  : 'bg-white border border-border hover:border-primary/30'}
                              `}
                            >
                              <div className={`
                                w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all
                                ${item.completed
                                  ? 'bg-success text-white'
                                  : 'border-2 border-border bg-white'}
                              `}>
                                {item.completed && <CheckSquare className="w-3.5 h-3.5" />}
                              </div>
                              <span className={`text-sm ${item.completed ? 'line-through text-text-muted' : 'text-text'}`}>
                                {item.item}
                              </span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {filteredTasks.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of {filteredTasks.length}
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

      {/* Add Task Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
        title="Add Maintenance Task"
        submitText="Create Task"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter task description..."
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            rows={3}
          />

          <Input
            label="Location"
            placeholder="e.g., Pool Area, Floors 1-3"
            value={newTask.location}
            onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            />

            <Select
              label="Priority"
              options={priorityOptions}
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-neutral rounded-[10px]">
            <input
              type="checkbox"
              id="recurring"
              checked={newTask.recurring}
              onChange={(e) => setNewTask({ ...newTask, recurring: e.target.checked })}
              className="w-4 h-4 rounded border-border text-primary"
            />
            <label htmlFor="recurring" className="text-sm text-text cursor-pointer">
              This is a recurring task
            </label>
          </div>

          {newTask.recurring && (
            <Select
              label="Recurring Schedule"
              options={scheduleOptions}
              value={newTask.recurringSchedule}
              onChange={(e) => setNewTask({ ...newTask, recurringSchedule: e.target.value })}
            />
          )}
        </div>
      </FormModal>
    </motion.div>
  );
};

export default MaintenanceTasks;
