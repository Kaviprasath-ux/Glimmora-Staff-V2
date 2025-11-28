import { useState, useMemo } from 'react';
import {
  ClipboardList,
  Plus,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Edit2
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button, { ButtonGroup, ButtonGroupItem } from '../../components/ui/Button';
import { SearchInput, Select, Textarea } from '../../components/ui/Input';
import Modal, { FormModal, ConfirmModal } from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useHousekeeping, useProfile } from '../../hooks/useStaffPortal';

const HousekeepingTasks = () => {
  const { profile } = useProfile();
  const { tasks, rooms, addHKTask, updateHKTask, deleteHKTask, updateHKTaskStatus } = useHousekeeping();

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
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.room?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const statusOrder = { in_progress: 0, todo: 1, completed: 2 };

      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tasks, searchQuery, statusFilter]);

  const taskStats = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  }), [tasks]);

  const formatDueTime = (dueTime) => {
    if (!dueTime) return null;
    const date = new Date(dueTime);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleAddTask = () => {
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
    }
  };

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
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <div>
      <PageHeader
        title="My Tasks"
        subtitle={`${taskStats.todo + taskStats.in_progress} pending tasks`}
        actions={
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Add Task
          </Button>
        }
      />

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          className={`p-4 rounded-[14px] cursor-pointer transition-all ${
            statusFilter === 'todo' ? 'bg-beige/30 ring-2 ring-beige' : 'bg-white border border-border hover:border-beige'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'todo' ? 'all' : 'todo')}
        >
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-beige" />
            <span className="text-2xl font-bold text-text">{taskStats.todo}</span>
          </div>
          <p className="text-sm text-text-light mt-1">To Do</p>
        </div>

        <div
          className={`p-4 rounded-[14px] cursor-pointer transition-all ${
            statusFilter === 'in_progress' ? 'bg-warning-light ring-2 ring-warning' : 'bg-white border border-border hover:border-warning'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            <span className="text-2xl font-bold text-text">{taskStats.in_progress}</span>
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
            <span className="text-2xl font-bold text-text">{taskStats.completed}</span>
          </div>
          <p className="text-sm text-text-light mt-1">Completed</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card className="text-center py-12">
          <ClipboardList className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No tasks found</h3>
          <p className="text-text-light mb-4">Create a new task to get started</p>
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Add Task
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="relative">
              {/* Priority indicator */}
              {(task.priority === 'urgent' || task.priority === 'high') && (
                <div className={`absolute top-0 left-0 w-1 h-full rounded-l-[14px] ${
                  task.priority === 'urgent' ? 'bg-danger' : 'bg-warning'
                }`} />
              )}

              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${task.status === 'completed' ? 'bg-success-light' :
                    task.status === 'in_progress' ? 'bg-warning-light' :
                    'bg-neutral-dark'}
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
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-semibold text-text ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-text-light">Room {task.room}</span>
                        <span className="text-text-muted">•</span>
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-text-light mt-2 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                    <span>Assigned by: {task.assignedBy}</span>
                    {task.dueTime && (
                      <span>Due: {formatDueTime(task.dueTime)}</span>
                    )}
                    {task.estimatedMinutes && (
                      <span>Est: {task.estimatedMinutes}min</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    {task.status === 'todo' && (
                      <Button
                        size="sm"
                        icon={Play}
                        onClick={() => handleStartTask(task)}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="success"
                        icon={CheckCircle}
                        onClick={() => handleCompleteTask(task)}
                      >
                        Complete
                      </Button>
                    )}
                    {task.status === 'completed' && (
                      <span className="text-sm text-success flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
        title="Add New Task"
        submitText="Create Task"
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
            placeholder="Enter task description (optional)"
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
              placeholder="Select room"
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
              label="Estimated Time (minutes)"
              type="number"
              min={5}
              max={240}
              value={newTask.estimatedMinutes}
              onChange={(e) => setNewTask({ ...newTask, estimatedMinutes: parseInt(e.target.value) || 30 })}
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
        message={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default HousekeepingTasks;
