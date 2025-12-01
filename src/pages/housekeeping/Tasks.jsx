import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Plus,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trash2,
  BedDouble,
  Timer,
  User,
  Tag,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card, { StatCard as KPICard } from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { SearchInput, Select, Textarea } from '../../components/ui/Input';
import { FormModal, ConfirmModal } from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useHousekeeping, useProfile } from '../../hooks/useStaffPortal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
};

// Status Stat Card Component
const StatCard = ({ label, count, icon: Icon, color, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      w-full p-4 rounded-[24px] text-left transition-all duration-200
      ${active
        ? `${color === 'beige' ? 'bg-beige/20 ring-2 ring-beige' :
           color === 'warning' ? 'bg-warning/10 ring-2 ring-warning' :
           'bg-success/10 ring-2 ring-success'}`
        : 'bg-white border border-border hover:border-primary/30'}
    `}
  >
    <div className="flex items-center gap-3">
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center
        ${color === 'beige' ? 'bg-beige/20' :
          color === 'warning' ? 'bg-warning/10' :
          'bg-success/10'}
      `}>
        <Icon className={`w-5 h-5 ${
          color === 'beige' ? 'text-beige' :
          color === 'warning' ? 'text-warning' :
          'text-success'
        }`} />
      </div>
      <div>
        <span className="text-2xl font-bold text-text">{count}</span>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </div>
  </motion.button>
);

// Category Badge Component
const CategoryBadge = ({ category }) => {
  const categoryLabels = {
    cleaning: 'Regular Cleaning',
    deep_clean: 'Deep Clean',
    turndown: 'Turndown Service',
    restock: 'Restock',
    special_setup: 'Special Setup',
    maintenance: 'Maintenance'
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
      <Tag className="w-3 h-3" />
      {categoryLabels[category] || category}
    </span>
  );
};

// Task Card Component
const TaskCard = ({ task, onStart, onComplete, onDelete }) => {
  const isOverdue = useMemo(() => {
    if (!task.dueTime || task.status === 'completed') return false;
    return new Date(task.dueTime) < new Date();
  }, [task.dueTime, task.status]);

  const formatDueTime = (dueTime) => {
    if (!dueTime) return null;
    const date = new Date(dueTime);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      className={`
        relative bg-white rounded-[24px] border overflow-hidden
        transition-all duration-200
        ${isOverdue ? 'border-danger/50' : 'border-border/50'}
        ${task.status === 'completed' ? 'opacity-60' : ''}
      `}
    >
      {/* Priority Indicator */}
      {(task.priority === 'urgent' || task.priority === 'high') && (
        <div className={`absolute top-0 left-0 w-1 h-full rounded-l-[24px] ${
          task.priority === 'urgent' ? 'bg-danger' : 'bg-warning'
        }`} />
      )}

      {/* Overdue Banner */}
      {isOverdue && (
        <div className="bg-danger/10 px-4 py-2 border-b border-danger/20">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-semibold">Overdue</span>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className={`
            w-11 h-11 rounded-xl flex items-center justify-center shrink-0
            ${task.status === 'completed' ? 'bg-success/10' :
              task.status === 'in_progress' ? 'bg-warning/10' :
              'bg-neutral'}
          `}>
            {task.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : task.status === 'in_progress' ? (
              <Clock className="w-5 h-5 text-warning" />
            ) : (
              <ClipboardList className="w-5 h-5 text-text-muted" />
            )}
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className={`
                  font-semibold text-text leading-tight
                  ${task.status === 'completed' ? 'line-through' : ''}
                `}>
                  {task.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <CategoryBadge category={task.category} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => onDelete(task)}
                className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-text-light mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted mb-4">
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5" />
                <span>Room {task.room}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>From {task.assignedBy}</span>
              </div>
              {task.estimatedMinutes && (
                <div className="flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5" />
                  <span>About {task.estimatedMinutes} min</span>
                </div>
              )}
              {task.dueTime && (
                <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-danger font-medium' : ''}`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due {formatDueTime(task.dueTime)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {task.status === 'todo' && (
                <Button
                  size="sm"
                  icon={Play}
                  onClick={() => onStart(task)}
                >
                  Start Task
                </Button>
              )}
              {task.status === 'in_progress' && (
                <Button
                  size="sm"
                  variant="success"
                  icon={CheckCircle}
                  onClick={() => onComplete(task)}
                >
                  Mark Complete
                </Button>
              )}
              {task.status === 'completed' && (
                <div className="flex items-center gap-1.5 text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
              <StatusBadge status={task.status} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ hasFilters, onClearFilters, onAddTask }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <div className="w-20 h-20 rounded-[24px] bg-neutral flex items-center justify-center mx-auto mb-4">
      <ClipboardList className="w-10 h-10 text-text-muted" />
    </div>
    <h3 className="text-xl font-semibold text-text mb-2">
      {hasFilters ? 'No matching tasks' : 'No tasks yet'}
    </h3>
    <p className="text-text-light mb-6 max-w-sm mx-auto">
      {hasFilters
        ? 'Try adjusting your search or filters to find what you\'re looking for.'
        : 'Create your first task to start tracking your work.'}
    </p>
    {hasFilters ? (
      <Button variant="outline" icon={X} onClick={onClearFilters}>
        Clear Filters
      </Button>
    ) : (
      <Button icon={Plus} onClick={onAddTask}>
        Create Task
      </Button>
    )}
  </motion.div>
);

const HousekeepingTasks = () => {
  const { profile } = useProfile();
  const { tasks, rooms, addHKTask, deleteHKTask, updateHKTaskStatus } = useHousekeeping();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    room: '',
    priority: 'normal',
    category: 'cleaning',
    estimatedMinutes: 30
  });

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = !searchQuery ||
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.room?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Sort by status first (in_progress, todo, completed)
        const statusOrder = { in_progress: 0, todo: 1, completed: 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }

        // Then by priority
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }, [tasks, searchQuery, statusFilter]);

  const taskStats = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  }), [tasks]);

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.room) return;

    addHKTask({
      ...newTask,
      status: 'todo',
      assignedBy: profile?.name || 'Self',
      assignedAt: new Date().toISOString(),
      dueTime: new Date(Date.now() + newTask.estimatedMinutes * 60000).toISOString()
    });

    setNewTask({
      title: '',
      description: '',
      room: '',
      priority: 'normal',
      category: 'cleaning',
      estimatedMinutes: 30
    });
    setShowAddModal(false);
  };

  const handleStartTask = (task) => {
    updateHKTaskStatus(task.id, 'in_progress');
  };

  const handleCompleteTask = (task) => {
    updateHKTaskStatus(task.id, 'completed');
  };

  const handleDeleteConfirm = () => {
    if (selectedTask) {
      deleteHKTask(selectedTask.id);
      setSelectedTask(null);
      setShowDeleteModal(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all';

  const roomOptions = rooms.map(r => ({
    value: r.roomNumber,
    label: `Room ${r.roomNumber} - ${r.type}`
  }));

  const categoryOptions = [
    { value: 'cleaning', label: 'Regular Cleaning' },
    { value: 'deep_clean', label: 'Deep Cleaning' },
    { value: 'turndown', label: 'Turndown Service' },
    { value: 'restock', label: 'Restock Amenities' },
    { value: 'special_setup', label: 'Special Setup' },
    { value: 'maintenance', label: 'Light Maintenance' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent Priority' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="My Tasks"
        subtitle={`${taskStats.todo + taskStats.in_progress} tasks remaining today`}
        actions={
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Create Task
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="To Do"
          value={taskStats.todo}
          subtitle="Pending tasks"
          icon={ClipboardList}
          color="gold"
        />
        <KPICard
          title="In Progress"
          value={taskStats.in_progress}
          subtitle="Currently working"
          icon={Clock}
          color="warning"
        />
        <KPICard
          title="Completed"
          value={taskStats.completed}
          subtitle="Done today"
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title="Total Tasks"
          value={tasks.length}
          subtitle="All assigned"
          icon={Sparkles}
          color="teal"
        />
      </div>

      {/* All Tasks Card */}
      <Card className="mb-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">All Tasks</h2>
              <p className="text-sm text-text-muted">
                {filteredTasks.length} of {tasks.length} tasks · {taskStats.in_progress} in progress
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <SearchInput
              placeholder="Search tasks by title, description, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 text-sm font-medium rounded-[10px] transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('todo')}
              className={`px-3 py-2 text-sm font-medium rounded-[10px] transition-colors ${
                statusFilter === 'todo'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              To Do
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-2 text-sm font-medium rounded-[10px] transition-colors ${
                statusFilter === 'in_progress'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-2 text-sm font-medium rounded-[10px] transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onAddTask={() => setShowAddModal(true)}
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => {
                const isOverdue = task.dueTime && task.status !== 'completed' && new Date(task.dueTime) < new Date();
                const isInProgress = task.status === 'in_progress';
                const isCompleted = task.status === 'completed';
                const isUrgent = task.priority === 'urgent';
                const isHighPriority = task.priority === 'high';

                return (
                  <motion.div
                    key={task.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`
                      relative bg-white rounded-[20px] border overflow-hidden
                      transition-all duration-200 cursor-pointer group
                      ${isCompleted
                        ? 'border-border opacity-60'
                        : isUrgent || isOverdue
                          ? 'border-danger/30 hover:border-danger/50 hover:shadow-md hover:shadow-danger/5'
                          : 'border-border hover:border-primary-200 hover:shadow-md hover:shadow-primary/5'}
                    `}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Status icon */}
                        <div className={`
                          w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0
                          ${isCompleted ? 'bg-success/10' :
                            isInProgress ? 'bg-teal/10' :
                            isOverdue || isUrgent ? 'bg-danger/10' :
                            isHighPriority ? 'bg-warning/10' : 'bg-primary-100'}
                        `}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-success" />
                          ) : isInProgress ? (
                            <Play className="w-6 h-6 text-teal" />
                          ) : isOverdue || isUrgent ? (
                            <AlertTriangle className="w-6 h-6 text-danger" />
                          ) : isHighPriority ? (
                            <Clock className="w-6 h-6 text-warning" />
                          ) : (
                            <ClipboardList className="w-6 h-6 text-primary" />
                          )}
                        </div>

                        {/* Task details */}
                        <div className="flex-1 min-w-0">
                          {/* Title row */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold text-[15px] leading-tight ${
                                isCompleted ? 'line-through text-text-muted' : 'text-text'
                              }`}>
                                {task.title}
                              </h3>
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-2 shrink-0">
                              {isUrgent && !isCompleted && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase bg-danger text-white flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Urgent
                                </span>
                              )}
                              {isOverdue && !isCompleted && !isUrgent && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase bg-warning text-white flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Overdue
                                </span>
                              )}
                              {isInProgress && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal/10 text-teal flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                                  In Progress
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Meta info */}
                          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-4">
                            <div className="flex items-center gap-1.5 text-sm text-text-muted">
                              <BedDouble className="w-4 h-4" />
                              <span>Room {task.room}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary">
                                <Tag className="w-3 h-3" />
                                {task.category === 'deep_clean' ? 'Deep Clean' :
                                 task.category === 'turndown' ? 'Turndown Service' :
                                 task.category === 'restock' ? 'Restock' :
                                 task.category === 'special_setup' ? 'Special Setup' :
                                 task.category === 'maintenance' ? 'Maintenance' : 'Cleaning'}
                              </span>
                            </div>
                            {task.dueTime && (
                              <div className={`flex items-center gap-1.5 text-sm ${
                                isOverdue && !isCompleted ? 'text-danger font-medium' : 'text-text-muted'
                              }`}>
                                <Timer className="w-4 h-4" />
                                <span>Due {new Date(task.dueTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                              </div>
                            )}
                            {task.estimatedMinutes && (
                              <div className="flex items-center gap-1.5 text-sm text-text-muted">
                                <Clock className="w-4 h-4" />
                                <span>~{task.estimatedMinutes} min</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            {task.status === 'todo' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartTask(task);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                              >
                                <Play className="w-3.5 h-3.5" />
                                Start
                              </button>
                            )}
                            {isInProgress && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompleteTask(task);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[8px] bg-primary text-white hover:bg-primary-dark transition-all"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Complete
                              </button>
                            )}
                            {isCompleted && (
                              <div className="flex items-center gap-1.5 text-success">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">Completed</span>
                              </div>
                            )}

                            {/* Delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTask(task);
                                setShowDeleteModal(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {/* Add Task Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
        title="Create New Task"
        subtitle="Add a new task to your work queue"
        submitText="Create Task"
        submitDisabled={!newTask.title.trim() || !newTask.room}
      >
        <div className="space-y-5">
          <Input
            label="Task Title"
            placeholder="What needs to be done?"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />

          <Textarea
            label="Description (optional)"
            placeholder="Add any additional details or instructions..."
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Room"
              options={roomOptions}
              value={newTask.room}
              onChange={(e) => setNewTask({ ...newTask, room: e.target.value })}
              placeholder="Select a room"
              required
            />

            <Select
              label="Category"
              options={categoryOptions}
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={priorityOptions}
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            />

            <Input
              label="Estimated Time"
              type="number"
              min={5}
              max={240}
              value={newTask.estimatedMinutes}
              onChange={(e) => setNewTask({ ...newTask, estimatedMinutes: parseInt(e.target.value) || 30 })}
              suffix="minutes"
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTask(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={
          <span>
            Are you sure you want to delete <strong>"{selectedTask?.title}"</strong>?
            This action cannot be undone.
          </span>
        }
        confirmText="Delete Task"
        variant="danger"
      />
    </motion.div>
  );
};

export default HousekeepingTasks;
