import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { staffTasks as seedTasks } from '../data/staffTasks';

const StaffTasksContext = createContext(null);
const STORAGE_KEY = 'glimmora_staff_tasks';

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadStaffTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
  }
  return null;
}

function saveStaffTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function StaffTasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const loaded = loadStaffTasks();
    return loaded || seedTasks.map(task => ({
      ...task,
      description: task.description || '',
      priority: task.priority || 'medium',
      status: normalizeStatus(task.status),
      assignedBy: task.assignedBy || 'Supervisor',
      assignedTo: task.assignedTo || 'staff-001',
      dueTime: task.dueTime || task.due || '12:00',
      checklist: task.checklist || [],
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: task.updatedAt || new Date().toISOString(),
    }));
  });

  useEffect(() => {
    saveStaffTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      room: taskData.room || '',
      priority: taskData.priority || 'medium',
      status: 'todo',
      assignedBy: taskData.assignedBy || 'Supervisor',
      assignedTo: taskData.assignedTo || 'staff-001',
      dueTime: taskData.dueTime || '12:00',
      checklist: taskData.checklist || [],
      issueCategory: taskData.issueCategory || null,
      estimatedTime: taskData.estimatedTime || null,
      pickupLocation: taskData.pickupLocation || null,
      deliveryLocation: taskData.deliveryLocation || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId, updatedFields) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          ...updatedFields,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const updateTaskStatus = useCallback((taskId, status) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
  }, []);

  const toggleChecklistItem = useCallback((taskId, itemId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedChecklist = task.checklist.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });

        const allCompleted = updatedChecklist.length > 0 &&
          updatedChecklist.every(item => item.completed);

        return {
          ...task,
          checklist: updatedChecklist,
          status: allCompleted ? 'completed' : task.status,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
  }, []);

  const addChecklistItem = useCallback((taskId, label) => {
    const newItem = {
      id: `checklist-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      label,
      completed: false,
    };
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          checklist: [...task.checklist, newItem],
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
    return newItem;
  }, []);

  const removeChecklistItem = useCallback((taskId, itemId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          checklist: task.checklist.filter(item => item.id !== itemId),
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
  }, []);

  const getKPIsForToday = useCallback((role) => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toDateString();
      return taskDate === today;
    });

    const filtered = role
      ? todayTasks.filter(task => {
          if (role === 'housekeeping') return task.room;
          if (role === 'maintenance') return task.issueCategory;
          if (role === 'runner') return task.pickupLocation || task.deliveryLocation;
          return true;
        })
      : tasks;

    return {
      total: filtered.length || tasks.length,
      todo: (filtered.length ? filtered : tasks).filter(t => t.status === 'todo').length,
      inProgress: (filtered.length ? filtered : tasks).filter(t => t.status === 'inprogress').length,
      completed: (filtered.length ? filtered : tasks).filter(t => t.status === 'completed').length,
    };
  }, [tasks]);

  const getTasksByStatus = useCallback((status) => {
    if (!status || status === 'all') return tasks;
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getTaskById = useCallback((taskId) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const value = {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    getKPIsForToday,
    getTasksByStatus,
    getTaskById,
  };

  return (
    <StaffTasksContext.Provider value={value}>
      {children}
    </StaffTasksContext.Provider>
  );
}

function normalizeStatus(status) {
  const statusMap = {
    'pending': 'todo',
    'in-progress': 'inprogress',
    'blocked': 'todo',
  };
  return statusMap[status] || status || 'todo';
}

export function useStaffTasks() {
  const context = useContext(StaffTasksContext);
  if (!context) {
    throw new Error('useStaffTasks must be used within a StaffTasksProvider');
  }
  return context;
}
