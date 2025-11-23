import { useState } from 'react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useStaffTasks } from '../../context/StaffTasksContext';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';

const Tasks = () => {
  const { tasks, getTaskStats } = useStaffTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('all'); // all, todo, in_progress, completed
  const [priorityFilter, setPriorityFilter] = useState('all'); // all, high, medium, low

  const stats = getTaskStats();

  // Get today's tasks
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(
    task => task.dueDate === today && task.status !== 'completed'
  );

  // Filter tasks based on active view and priority
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by status
    if (activeView !== 'all') {
      filtered = filtered.filter(task => task.status === activeView);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Tasks</h1>
          <p className="text-neutral-600">
            {stats.total === 0
              ? 'No tasks yet'
              : `${stats.completed} of ${stats.total} tasks completed`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
        >
          <PlusIcon className="h-5 w-5" />
          New Task
        </button>
      </div>

      {/* Stats Cards - Read Only */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-neutral-900">{stats.total}</div>
            <div className="text-sm text-neutral-600 mt-1">Total Tasks</div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-neutral-600">{stats.todo}</div>
            <div className="text-sm text-neutral-600 mt-1">To Do</div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-neutral-600 mt-1">In Progress</div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-neutral-600 mt-1">Completed</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      {stats.total > 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg p-1">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveView('all')}
              className={`flex-1 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                activeView === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setActiveView('todo')}
              className={`flex-1 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                activeView === 'todo'
                  ? 'bg-neutral-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              To Do
            </button>
            <button
              onClick={() => setActiveView('in_progress')}
              className={`flex-1 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                activeView === 'in_progress'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveView('completed')}
              className={`flex-1 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                activeView === 'completed'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      )}

      {/* Alert Banner for Due Today */}
      {todaysTasks.length > 0 && activeView === 'all' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-yellow-900">
                  {todaysTasks.length} {todaysTasks.length === 1 ? 'task' : 'tasks'} due today
                </h3>
                <p className="text-xs text-yellow-700">Complete these tasks before end of day</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Banner for High Priority */}
      {highPriorityCount > 0 && activeView === 'all' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-900">
                  {highPriorityCount} high priority {highPriorityCount === 1 ? 'task' : 'tasks'}
                </h3>
                <p className="text-xs text-red-700">These tasks need immediate attention</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {stats.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-700">Filter by Priority:</span>
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => setPriorityFilter('all')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  priorityFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriorityFilter('high')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  priorityFilter === 'high'
                    ? 'bg-red-600 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                High
              </button>
              <button
                onClick={() => setPriorityFilter('medium')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  priorityFilter === 'medium'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setPriorityFilter('low')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  priorityFilter === 'low'
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Low
              </button>
            </div>
          </div>
          <span className="text-sm text-neutral-500">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      )}

      {/* Task List */}
      {stats.total > 0 && (
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="bg-white border border-neutral-200 rounded-lg">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">No tasks found</h3>
                <p className="text-sm text-neutral-600">
                  {priorityFilter !== 'all'
                    ? `No ${priorityFilter} priority tasks in this view`
                    : 'No tasks match the current filter'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg">
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No tasks yet</h3>
            <p className="text-neutral-600 mb-6 max-w-sm mx-auto">
              Get started by creating your first task. Stay organized and track your daily responsibilities.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
            >
              <PlusIcon className="h-5 w-5" />
              Create Your First Task
            </button>
          </div>
        </div>
      )}

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Tasks;
