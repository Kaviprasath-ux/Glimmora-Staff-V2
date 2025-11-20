import { useState } from 'react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useStaffTasks } from '../../context/StaffTasksContext';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';

const Tasks = () => {
  const { tasks, getTaskStats } = useStaffTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = getTaskStats();

  const filteredTasks = filterStatus === 'all'
    ? tasks
    : tasks.filter(task => task.status === filterStatus);

  const statusOptions = [
    { value: 'all', label: 'All Tasks', count: stats.total },
    { value: 'todo', label: 'To Do', count: stats.todo },
    { value: 'in_progress', label: 'In Progress', count: stats.inProgress },
    { value: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-deepgreen">My Tasks</h1>
          <p className="text-neutral-600 mt-1">Manage your assigned tasks and track progress</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#8E6554] transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="text-neutral-600 text-sm mb-1">Total Tasks</div>
          <div className="text-3xl font-bold text-neutral-900">{stats.total}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="text-neutral-600 text-sm mb-1">To Do</div>
          <div className="text-3xl font-bold text-neutral-700">{stats.todo}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="text-neutral-600 text-sm mb-1">In Progress</div>
          <div className="text-3xl font-bold text-teal">{stats.inProgress}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="text-neutral-600 text-sm mb-1">Completed</div>
          <div className="text-3xl font-bold text-deepgreen">{stats.completed}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <FunnelIcon className="h-5 w-5 text-neutral-600" />
          <span className="font-medium text-neutral-900">Filter by Status</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === option.value
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-12 text-center">
          <div className="text-neutral-400 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">No tasks found</h3>
          <p className="text-neutral-600">
            {filterStatus === 'all'
              ? 'Add a new task to get started'
              : `No ${filterStatus.replace('_', ' ')} tasks at the moment`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Tasks;
