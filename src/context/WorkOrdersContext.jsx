import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { workOrders as seedWorkOrders, technicians } from '../data/workOrders';

const WorkOrdersContext = createContext(null);
const STORAGE_KEY = 'glimmora_work_orders';

function generateId(prefix = 'wo') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadWorkOrders() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to load work orders from localStorage', err);
  }
  return null;
}

function saveWorkOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save work orders to localStorage', err);
  }
}

export function WorkOrdersProvider({ children }) {
  const [workOrders, setWorkOrders] = useState(() => {
    const loaded = loadWorkOrders();
    return loaded || seedWorkOrders;
  });

  useEffect(() => {
    saveWorkOrders(workOrders);
  }, [workOrders]);

  const createWorkOrder = useCallback((data) => {
    const now = new Date().toISOString();
    const newOrder = {
      id: generateId('wo'),
      title: data.title,
      description: data.description || '',
      room: data.room || null,
      category: data.category || 'General',
      priority: data.priority || 'medium',
      status: 'new',
      reportedBy: data.reportedBy || null,
      assignedTo: data.assignedTo || null,
      createdAt: now,
      updatedAt: now,
      photos: data.photos || [],
      checklist: data.checklist || [],
      comments: [],
      activityLog: [
        { id: generateId('log'), text: 'Work order created', timestamp: now },
      ],
    };
    setWorkOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateWorkOrder = useCallback((id, updates) => {
    setWorkOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    }));
  }, []);

  const deleteWorkOrder = useCallback((id) => {
    setWorkOrders(prev => prev.filter(order => order.id !== id));
  }, []);

  // FIX MT-M03: Add completedAt timestamp when status changes to completed
  const updateWorkOrderStatus = useCallback((id, status) => {
    const now = new Date().toISOString();
    setWorkOrders(prev => prev.map(order => {
      if (order.id === id) {
        const statusLabels = {
          new: 'New',
          inprogress: 'In Progress',
          paused: 'Paused',
          completed: 'Completed',
        };
        return {
          ...order,
          status,
          updatedAt: now,
          // FIX MT-M03: Add completedAt timestamp when completing
          ...(status === 'completed' && { completedAt: now }),
          // Clear completedAt if reopening
          ...(status !== 'completed' && order.completedAt && { completedAt: null }),
          activityLog: [
            ...order.activityLog,
            { id: generateId('log'), text: `Status changed to ${statusLabels[status]}`, timestamp: now },
          ],
        };
      }
      return order;
    }));
  }, []);

  const assignTechnician = useCallback((id, techId) => {
    const now = new Date().toISOString();
    const tech = technicians.find(t => t.id === techId);
    setWorkOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          assignedTo: techId,
          updatedAt: now,
          activityLog: [
            ...order.activityLog,
            { id: generateId('log'), text: `Assigned to ${tech?.name || techId}`, timestamp: now },
          ],
        };
      }
      return order;
    }));
  }, []);

  const addChecklistItem = useCallback((id, label) => {
    const now = new Date().toISOString();
    const newItem = {
      id: generateId('cl'),
      label,
      completed: false,
    };
    setWorkOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          checklist: [...order.checklist, newItem],
          updatedAt: now,
          activityLog: [
            ...order.activityLog,
            { id: generateId('log'), text: `Checklist item added: "${label}"`, timestamp: now },
          ],
        };
      }
      return order;
    }));
    return newItem;
  }, []);

  const toggleChecklistItem = useCallback((orderId, itemId) => {
    const now = new Date().toISOString();
    setWorkOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedChecklist = order.checklist.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });

        const toggledItem = order.checklist.find(item => item.id === itemId);
        const wasCompleted = toggledItem?.completed;

        return {
          ...order,
          checklist: updatedChecklist,
          updatedAt: now,
          activityLog: [
            ...order.activityLog,
            {
              id: generateId('log'),
              text: wasCompleted
                ? `Checklist item unchecked: "${toggledItem?.label}"`
                : `Checklist item completed: "${toggledItem?.label}"`,
              timestamp: now,
            },
          ],
        };
      }
      return order;
    }));
  }, []);

  const removeChecklistItem = useCallback((orderId, itemId) => {
    const now = new Date().toISOString();
    setWorkOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const removedItem = order.checklist.find(item => item.id === itemId);
        return {
          ...order,
          checklist: order.checklist.filter(item => item.id !== itemId),
          updatedAt: now,
          activityLog: [
            ...order.activityLog,
            { id: generateId('log'), text: `Checklist item removed: "${removedItem?.label}"`, timestamp: now },
          ],
        };
      }
      return order;
    }));
  }, []);

  const addComment = useCallback((id, message, author) => {
    const now = new Date().toISOString();
    const newComment = {
      id: generateId('cmt'),
      message,
      author,
      timestamp: now,
    };
    setWorkOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          comments: [...order.comments, newComment],
          updatedAt: now,
          activityLog: [
            ...order.activityLog,
            { id: generateId('log'), text: `Comment added by ${author}`, timestamp: now },
          ],
        };
      }
      return order;
    }));
    return newComment;
  }, []);

  const addPhoto = useCallback((id, base64File) => {
    const now = new Date().toISOString();
    setWorkOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          photos: [...order.photos, base64File],
          updatedAt: now,
          activityLog: [
            ...order.activityLog,
            { id: generateId('log'), text: 'Photo added', timestamp: now },
          ],
        };
      }
      return order;
    }));
  }, []);

  const removePhoto = useCallback((orderId, photoIndex) => {
    const now = new Date().toISOString();
    setWorkOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedPhotos = order.photos.filter((_, idx) => idx !== photoIndex);
        return {
          ...order,
          photos: updatedPhotos,
          updatedAt: now,
          activityLog: [
            ...order.activityLog,
            { id: generateId('log'), text: 'Photo removed', timestamp: now },
          ],
        };
      }
      return order;
    }));
  }, []);

  const logActivity = useCallback((id, text) => {
    const now = new Date().toISOString();
    setWorkOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          activityLog: [
            ...order.activityLog,
            { id: generateId('log'), text, timestamp: now },
          ],
          updatedAt: now,
        };
      }
      return order;
    }));
  }, []);

  const getWorkOrderById = useCallback((id) => {
    return workOrders.find(order => order.id === id);
  }, [workOrders]);

  const getMaintenanceKPIs = useCallback(() => {
    return {
      total: workOrders.length,
      new: workOrders.filter(o => o.status === 'new').length,
      inprogress: workOrders.filter(o => o.status === 'inprogress').length,
      paused: workOrders.filter(o => o.status === 'paused').length,
      completed: workOrders.filter(o => o.status === 'completed').length,
      criticalCount: workOrders.filter(o => o.priority === 'critical' && o.status !== 'completed').length,
    };
  }, [workOrders]);

  const filterWorkOrders = useCallback(({ status, priority, category, assignedTo, search }) => {
    return workOrders.filter(order => {
      if (status && status !== 'all' && order.status !== status) return false;
      if (priority && priority !== 'all' && order.priority !== priority) return false;
      if (category && category !== 'all' && order.category !== category) return false;
      if (assignedTo && assignedTo !== 'all' && order.assignedTo !== assignedTo) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesTitle = order.title.toLowerCase().includes(searchLower);
        const matchesRoom = order.room?.toLowerCase().includes(searchLower);
        const matchesDesc = order.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesRoom && !matchesDesc) return false;
      }
      return true;
    });
  }, [workOrders]);

  const value = {
    workOrders,
    technicians,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    updateWorkOrderStatus,
    assignTechnician,
    addChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
    addComment,
    addPhoto,
    removePhoto,
    logActivity,
    getWorkOrderById,
    getMaintenanceKPIs,
    filterWorkOrders,
  };

  return (
    <WorkOrdersContext.Provider value={value}>
      {children}
    </WorkOrdersContext.Provider>
  );
}

export function useWorkOrders() {
  const context = useContext(WorkOrdersContext);
  if (!context) {
    throw new Error('useWorkOrders must be used within a WorkOrdersProvider');
  }
  return context;
}
