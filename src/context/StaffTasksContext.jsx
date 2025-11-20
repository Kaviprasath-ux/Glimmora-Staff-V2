import { createContext, useContext, useState, useEffect } from 'react';
import { staffTasks as initialTasks } from '../data/staffTasks';

const StaffTasksContext = createContext();

export const useStaffTasks = () => {
  const context = useContext(StaffTasksContext);
  if (!context) {
    throw new Error('useStaffTasks must be used within StaffTasksProvider');
  }
  return context;
};

export const StaffTasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('glimmora_staff_tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('glimmora_staff_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    const task = {
      ...newTask,
      id: `TASK${String(tasks.length + 1).padStart(3, '0')}`,
    };
    setTasks(prev => [...prev, task]);
    return task;
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const updateTaskChecklist = (taskId, checklistId, completed) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              checklist: task.checklist.map(item =>
                item.id === checklistId ? { ...item, completed } : item
              )
            }
          : task
      )
    );
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  };

  const value = {
    tasks,
    addTask,
    updateTaskStatus,
    updateTaskChecklist,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTaskStats,
  };

  return (
    <StaffTasksContext.Provider value={value}>
      {children}
    </StaffTasksContext.Provider>
  );
};
