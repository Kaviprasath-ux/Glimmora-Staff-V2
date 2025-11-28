import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunner } from '../context/RunnerContext';
import { useStaffNotifications } from '../context/StaffNotificationsContext';
import RunnerKPIBar from '../components/runner/RunnerKPIBar';
import RunnerStatusTabs from '../components/runner/RunnerStatusTabs';
import RunnerTaskCard from '../components/runner/RunnerTaskCard';
import RunnerTaskModal from '../components/runner/RunnerTaskModal';
import ProofOfDeliveryModal from '../components/runner/ProofOfDeliveryModal';

export default function RunnerDashboard() {
  const navigate = useNavigate();
  const {
    tasks,
    createRunnerTask,
    acceptRunnerTask,
    startRunnerTask,
    completeRunnerTask,
    getRunnerKPIs
  } = useRunner();
  const { addNotification } = useStaffNotifications();

  const [activeTab, setActiveTab] = useState('all');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  const kpis = useMemo(() => getRunnerKPIs(), [getRunnerKPIs]);

  // Calculate counts for tabs
  const statusCounts = useMemo(() => ({
    pending: tasks.filter(t => t.status === 'pending').length,
    accepted: tasks.filter(t => t.status === 'accepted').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  }), [tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Status filter
    if (activeTab !== 'all') {
      result = result.filter(t => t.status === activeTab);
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // Sort
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const statusOrder = { inprogress: 0, accepted: 1, pending: 2, completed: 3 };

    result.sort((a, b) => {
      if (sortBy === 'priority') {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'status') {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

    return result;
  }, [tasks, activeTab, typeFilter, priorityFilter, sortBy]);

  const handleAccept = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    acceptRunnerTask(taskId);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'Task Accepted',
        message: `You accepted: ${task?.title}`
      });
    }
  };

  const handleStart = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    startRunnerTask(taskId);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'Task Started',
        message: `Started: ${task?.title}`
      });
    }
  };

  const handleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setShowProofModal(task);
  };

  const handleProofComplete = (taskId, proofData) => {
    const task = tasks.find(t => t.id === taskId);
    completeRunnerTask(taskId, proofData);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'Task Completed',
        message: `Completed: ${task?.title}`
      });
    }
  };

  const handleCreateTask = (taskData) => {
    const newTask = createRunnerTask(taskData);
    if (addNotification) {
      addNotification({
        type: 'runner',
        title: 'New Task Created',
        message: `Created: ${newTask.title}`
      });
    }
  };

  const handleTaskClick = (task) => {
    navigate(`/runner/tasks/${task.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4E5840]">Runner Dashboard</h1>
          <p className="text-sm text-[#6B6F63] mt-1">
            Manage pickups and deliveries
          </p>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* KPI Bar */}
      <RunnerKPIBar kpis={kpis} />

      {/* Filters & Tabs */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Status Tabs */}
          <RunnerStatusTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={statusCounts}
          />

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30"
            >
              <option value="all">All Types</option>
              <option value="delivery">Deliveries</option>
              <option value="pickup">Pickups</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30"
            >
              <option value="priority">Sort: Priority</option>
              <option value="status">Sort: Status</option>
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-12 text-center">
          <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-medium text-[#4E5840] mb-2">No tasks found</h3>
          <p className="text-sm text-[#6B6F63] mb-4">
            {activeTab === 'all'
              ? 'Create a new task to get started'
              : `No ${activeTab} tasks at the moment`}
          </p>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <RunnerTaskCard
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
              onAccept={handleAccept}
              onStart={handleStart}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B6F63]">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#5C9BA4]">
              <div className="w-2 h-2 rounded-full bg-[#5C9BA4]"></div>
              {statusCounts.inprogress} in progress
            </span>
            <span className="flex items-center gap-1 text-[#CDB261]">
              <div className="w-2 h-2 rounded-full bg-[#CDB261]"></div>
              {statusCounts.accepted} accepted
            </span>
            <span className="flex items-center gap-1 text-neutral-500">
              <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
              {statusCounts.pending} pending
            </span>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <RunnerTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onSave={handleCreateTask}
        />
      )}

      {/* Proof of Delivery Modal */}
      {showProofModal && (
        <ProofOfDeliveryModal
          task={showProofModal}
          onClose={() => setShowProofModal(null)}
          onComplete={handleProofComplete}
        />
      )}
    </div>
  );
}
