import { useState, useMemo } from 'react';
import { useStaffTasks } from '../context/StaffTasksContext';
import { useStaffNotifications } from '../context/StaffNotificationsContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import KPIBar from '../components/tasks/KPIBar';
import TaskStatusTabs from '../components/tasks/TaskStatusTabs';

export default function TasksPage() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    getKPIsForToday,
  } = useStaffTasks();

  const { addNotification } = useStaffNotifications();
  const { staff } = useAuth();
  const role = staff?.role || 'housekeeping';

  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const kpis = useMemo(() => getKPIsForToday(role), [getKPIsForToday, role]);

  const filteredTasks = useMemo(() => {
    if (activeTab === 'all') return tasks;
    return tasks.filter(task => task.status === activeTab);
  }, [tasks, activeTab]);

  const counts = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const handleAddTask = (taskData) => {
    const newTask = addTask({
      ...taskData,
      assignedTo: staff?.id || 'staff-001',
    });

    if (addNotification) {
      addNotification({
        type: 'task',
        title: 'New Task Assigned',
        message: `Task "${newTask.title}" has been created`,
      });

      if (taskData.priority === 'high') {
        addNotification({
          type: 'task',
          title: 'High Priority Task',
          message: `Urgent: "${newTask.title}" requires immediate attention`,
        });
      }
    }
  };

  const handleUpdateTask = (taskData) => {
    if (editingTask?.id) {
      updateTask(editingTask.id, taskData);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    setShowDeleteConfirm(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    updateTaskStatus(taskId, newStatus);

    if (newStatus === 'completed' && addNotification) {
      addNotification({
        type: 'task',
        title: 'Task Completed',
        message: `Task "${task?.title}" has been marked as complete`,
      });
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4E5840]">My Tasks</h1>
          <p className="text-sm text-[#6B6F63] mt-1">
            Manage and track your assigned tasks
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* KPI Bar */}
      <KPIBar kpis={kpis} />

      {/* Status Filter Tabs */}
      <TaskStatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {/* Task Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditModal}
              onDelete={(id) => setShowDeleteConfirm(id)}
              onStatusChange={handleStatusChange}
              onToggleChecklist={toggleChecklistItem}
              onAddChecklistItem={addChecklistItem}
              onRemoveChecklistItem={removeChecklistItem}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-12 text-center">
          <div className="max-w-sm mx-auto">
            <svg
              className="w-16 h-16 mx-auto text-neutral-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-[#4E5840] mb-2">
              No tasks found
            </h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              {activeTab === 'all'
                ? "You don't have any tasks yet. Add your first task to get started."
                : `No tasks with status "${activeTab === 'inprogress' ? 'In Progress' : activeTab === 'todo' ? 'To Do' : 'Completed'}".`}
            </p>
            {activeTab === 'all' && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            )}
          </div>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        task={editingTask}
        mode={editingTask ? 'edit' : 'add'}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[#4E5840] mb-2">
              Delete Task
            </h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(showDeleteConfirm)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
