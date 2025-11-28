import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { seedDemoData, generateId, generateNotifications } from '../data/seedDemo';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'glimmora_staff_portal';

const StaffPortalContext = createContext(null);

const initialState = {
  profile: null,
  notifications: [],
  housekeeping: {
    rooms: [],
    tasks: []
  },
  maintenance: {
    workOrders: [],
    tasks: [],
    equipmentIssues: []
  },
  runner: {
    pickupRequests: [],
    deliveries: []
  },
  ui: {
    sidebarOpen: true,
    notificationDrawerOpen: false,
    activeModal: null,
    modalData: null
  }
};

const actionTypes = {
  LOAD_STATE: 'LOAD_STATE',
  SET_PROFILE: 'SET_PROFILE',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  CLOCK_IN: 'CLOCK_IN',
  CLOCK_OUT: 'CLOCK_OUT',

  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  MARK_ALL_NOTIFICATIONS_READ: 'MARK_ALL_NOTIFICATIONS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',

  UPDATE_ROOM: 'UPDATE_ROOM',
  UPDATE_ROOM_CHECKLIST: 'UPDATE_ROOM_CHECKLIST',
  ADD_ROOM_NOTE: 'ADD_ROOM_NOTE',
  UPDATE_ROOM_STATUS: 'UPDATE_ROOM_STATUS',

  ADD_HK_TASK: 'ADD_HK_TASK',
  UPDATE_HK_TASK: 'UPDATE_HK_TASK',
  DELETE_HK_TASK: 'DELETE_HK_TASK',
  UPDATE_HK_TASK_STATUS: 'UPDATE_HK_TASK_STATUS',

  ADD_WORK_ORDER: 'ADD_WORK_ORDER',
  UPDATE_WORK_ORDER: 'UPDATE_WORK_ORDER',
  DELETE_WORK_ORDER: 'DELETE_WORK_ORDER',
  ADD_WORK_ORDER_COMMENT: 'ADD_WORK_ORDER_COMMENT',
  UPDATE_WORK_ORDER_STATUS: 'UPDATE_WORK_ORDER_STATUS',

  ADD_MT_TASK: 'ADD_MT_TASK',
  UPDATE_MT_TASK: 'UPDATE_MT_TASK',
  DELETE_MT_TASK: 'DELETE_MT_TASK',
  UPDATE_MT_TASK_STATUS: 'UPDATE_MT_TASK_STATUS',
  UPDATE_MT_TASK_CHECKLIST: 'UPDATE_MT_TASK_CHECKLIST',

  ADD_EQUIPMENT_ISSUE: 'ADD_EQUIPMENT_ISSUE',
  UPDATE_EQUIPMENT_ISSUE: 'UPDATE_EQUIPMENT_ISSUE',
  DELETE_EQUIPMENT_ISSUE: 'DELETE_EQUIPMENT_ISSUE',

  ADD_PICKUP_REQUEST: 'ADD_PICKUP_REQUEST',
  UPDATE_PICKUP_REQUEST: 'UPDATE_PICKUP_REQUEST',
  DELETE_PICKUP_REQUEST: 'DELETE_PICKUP_REQUEST',
  UPDATE_PICKUP_STATUS: 'UPDATE_PICKUP_STATUS',
  ACCEPT_PICKUP: 'ACCEPT_PICKUP',
  COMPLETE_PICKUP: 'COMPLETE_PICKUP',

  ADD_DELIVERY: 'ADD_DELIVERY',
  UPDATE_DELIVERY: 'UPDATE_DELIVERY',
  DELETE_DELIVERY: 'DELETE_DELIVERY',
  UPDATE_DELIVERY_STATUS: 'UPDATE_DELIVERY_STATUS',
  ACCEPT_DELIVERY: 'ACCEPT_DELIVERY',
  COMPLETE_DELIVERY: 'COMPLETE_DELIVERY',

  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  TOGGLE_NOTIFICATION_DRAWER: 'TOGGLE_NOTIFICATION_DRAWER',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',

  RESET_ALL: 'RESET_ALL',
  SEED_DEMO_DATA: 'SEED_DEMO_DATA'
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_STATE:
      return { ...state, ...action.payload };

    case actionTypes.SET_PROFILE:
      return { ...state, profile: action.payload };

    case actionTypes.UPDATE_PROFILE:
      return {
        ...state,
        profile: { ...state.profile, ...action.payload }
      };

    case actionTypes.CLOCK_IN:
      return {
        ...state,
        profile: {
          ...state.profile,
          clockedIn: true,
          clockInTime: new Date().toISOString()
        }
      };

    case actionTypes.CLOCK_OUT:
      return {
        ...state,
        profile: {
          ...state.profile,
          clockedIn: false,
          clockInTime: null
        }
      };

    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };

    case actionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };

    case actionTypes.MARK_ALL_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      };

    case actionTypes.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    case actionTypes.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };

    case actionTypes.UPDATE_ROOM:
      return {
        ...state,
        housekeeping: {
          ...state.housekeeping,
          rooms: state.housekeeping.rooms.map(r =>
            r.id === action.payload.id ? { ...r, ...action.payload } : r
          )
        }
      };

    case actionTypes.UPDATE_ROOM_CHECKLIST:
      return {
        ...state,
        housekeeping: {
          ...state.housekeeping,
          rooms: state.housekeeping.rooms.map(r =>
            r.id === action.payload.roomId
              ? {
                  ...r,
                  checklist: r.checklist.map(c =>
                    c.id === action.payload.checklistId
                      ? { ...c, completed: action.payload.completed }
                      : c
                  )
                }
              : r
          )
        }
      };

    case actionTypes.ADD_ROOM_NOTE:
      return {
        ...state,
        housekeeping: {
          ...state.housekeeping,
          rooms: state.housekeeping.rooms.map(r =>
            r.id === action.payload.roomId
              ? { ...r, notes: action.payload.note }
              : r
          )
        }
      };

    case actionTypes.UPDATE_ROOM_STATUS:
      return {
        ...state,
        housekeeping: {
          ...state.housekeeping,
          rooms: state.housekeeping.rooms.map(r =>
            r.id === action.payload.roomId
              ? { ...r, status: action.payload.status }
              : r
          )
        }
      };

    case actionTypes.ADD_HK_TASK:
      return {
        ...state,
        housekeeping: {
          ...state.housekeeping,
          tasks: [...state.housekeeping.tasks, { ...action.payload, id: generateId() }]
        }
      };

    case actionTypes.UPDATE_HK_TASK:
      return {
        ...state,
        housekeeping: {
          ...state.housekeeping,
          tasks: state.housekeeping.tasks.map(t =>
            t.id === action.payload.id ? { ...t, ...action.payload } : t
          )
        }
      };

    case actionTypes.DELETE_HK_TASK:
      return {
        ...state,
        housekeeping: {
          ...state.housekeeping,
          tasks: state.housekeeping.tasks.filter(t => t.id !== action.payload)
        }
      };

    case actionTypes.UPDATE_HK_TASK_STATUS:
      return {
        ...state,
        housekeeping: {
          ...state.housekeeping,
          tasks: state.housekeeping.tasks.map(t =>
            t.id === action.payload.taskId
              ? {
                  ...t,
                  status: action.payload.status,
                  ...(action.payload.status === 'completed' && { completedAt: new Date().toISOString() })
                }
              : t
          )
        }
      };

    case actionTypes.ADD_WORK_ORDER:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          workOrders: [...state.maintenance.workOrders, { ...action.payload, id: generateId() }]
        }
      };

    case actionTypes.UPDATE_WORK_ORDER:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          workOrders: state.maintenance.workOrders.map(wo =>
            wo.id === action.payload.id ? { ...wo, ...action.payload } : wo
          )
        }
      };

    case actionTypes.DELETE_WORK_ORDER:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          workOrders: state.maintenance.workOrders.filter(wo => wo.id !== action.payload)
        }
      };

    case actionTypes.ADD_WORK_ORDER_COMMENT:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          workOrders: state.maintenance.workOrders.map(wo =>
            wo.id === action.payload.workOrderId
              ? {
                  ...wo,
                  comments: [...wo.comments, {
                    id: generateId(),
                    ...action.payload.comment,
                    timestamp: new Date().toISOString()
                  }]
                }
              : wo
          )
        }
      };

    case actionTypes.UPDATE_WORK_ORDER_STATUS:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          workOrders: state.maintenance.workOrders.map(wo =>
            wo.id === action.payload.workOrderId
              ? {
                  ...wo,
                  status: action.payload.status,
                  updatedAt: new Date().toISOString()
                }
              : wo
          )
        }
      };

    case actionTypes.ADD_MT_TASK:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          tasks: [...state.maintenance.tasks, { ...action.payload, id: generateId() }]
        }
      };

    case actionTypes.UPDATE_MT_TASK:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          tasks: state.maintenance.tasks.map(t =>
            t.id === action.payload.id ? { ...t, ...action.payload } : t
          )
        }
      };

    case actionTypes.DELETE_MT_TASK:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          tasks: state.maintenance.tasks.filter(t => t.id !== action.payload)
        }
      };

    case actionTypes.UPDATE_MT_TASK_STATUS:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          tasks: state.maintenance.tasks.map(t =>
            t.id === action.payload.taskId
              ? { ...t, status: action.payload.status }
              : t
          )
        }
      };

    case actionTypes.UPDATE_MT_TASK_CHECKLIST:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          tasks: state.maintenance.tasks.map(t =>
            t.id === action.payload.taskId
              ? {
                  ...t,
                  checklist: t.checklist.map(c =>
                    c.id === action.payload.checklistId
                      ? { ...c, completed: action.payload.completed }
                      : c
                  )
                }
              : t
          )
        }
      };

    case actionTypes.ADD_EQUIPMENT_ISSUE:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          equipmentIssues: [...state.maintenance.equipmentIssues, { ...action.payload, id: generateId() }]
        }
      };

    case actionTypes.UPDATE_EQUIPMENT_ISSUE:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          equipmentIssues: state.maintenance.equipmentIssues.map(ei =>
            ei.id === action.payload.id ? { ...ei, ...action.payload } : ei
          )
        }
      };

    case actionTypes.DELETE_EQUIPMENT_ISSUE:
      return {
        ...state,
        maintenance: {
          ...state.maintenance,
          equipmentIssues: state.maintenance.equipmentIssues.filter(ei => ei.id !== action.payload)
        }
      };

    case actionTypes.ADD_PICKUP_REQUEST:
      return {
        ...state,
        runner: {
          ...state.runner,
          pickupRequests: [...state.runner.pickupRequests, { ...action.payload, id: generateId() }]
        }
      };

    case actionTypes.UPDATE_PICKUP_REQUEST:
      return {
        ...state,
        runner: {
          ...state.runner,
          pickupRequests: state.runner.pickupRequests.map(pr =>
            pr.id === action.payload.id ? { ...pr, ...action.payload } : pr
          )
        }
      };

    case actionTypes.DELETE_PICKUP_REQUEST:
      return {
        ...state,
        runner: {
          ...state.runner,
          pickupRequests: state.runner.pickupRequests.filter(pr => pr.id !== action.payload)
        }
      };

    case actionTypes.UPDATE_PICKUP_STATUS:
      return {
        ...state,
        runner: {
          ...state.runner,
          pickupRequests: state.runner.pickupRequests.map(pr =>
            pr.id === action.payload.pickupId
              ? { ...pr, status: action.payload.status }
              : pr
          )
        }
      };

    case actionTypes.ACCEPT_PICKUP:
      return {
        ...state,
        runner: {
          ...state.runner,
          pickupRequests: state.runner.pickupRequests.map(pr =>
            pr.id === action.payload.pickupId
              ? {
                  ...pr,
                  status: 'in_progress',
                  assignedTo: state.profile?.name || 'Staff'
                }
              : pr
          )
        }
      };

    case actionTypes.COMPLETE_PICKUP:
      return {
        ...state,
        runner: {
          ...state.runner,
          pickupRequests: state.runner.pickupRequests.map(pr =>
            pr.id === action.payload.pickupId
              ? {
                  ...pr,
                  status: 'completed',
                  completedAt: new Date().toISOString()
                }
              : pr
          )
        }
      };

    case actionTypes.ADD_DELIVERY:
      return {
        ...state,
        runner: {
          ...state.runner,
          deliveries: [...state.runner.deliveries, { ...action.payload, id: generateId() }]
        }
      };

    case actionTypes.UPDATE_DELIVERY:
      return {
        ...state,
        runner: {
          ...state.runner,
          deliveries: state.runner.deliveries.map(d =>
            d.id === action.payload.id ? { ...d, ...action.payload } : d
          )
        }
      };

    case actionTypes.DELETE_DELIVERY:
      return {
        ...state,
        runner: {
          ...state.runner,
          deliveries: state.runner.deliveries.filter(d => d.id !== action.payload)
        }
      };

    case actionTypes.UPDATE_DELIVERY_STATUS:
      return {
        ...state,
        runner: {
          ...state.runner,
          deliveries: state.runner.deliveries.map(d =>
            d.id === action.payload.deliveryId
              ? { ...d, status: action.payload.status }
              : d
          )
        }
      };

    case actionTypes.ACCEPT_DELIVERY:
      return {
        ...state,
        runner: {
          ...state.runner,
          deliveries: state.runner.deliveries.map(d =>
            d.id === action.payload.deliveryId
              ? {
                  ...d,
                  status: 'in_transit',
                  assignedTo: state.profile?.name || 'Staff'
                }
              : d
          )
        }
      };

    case actionTypes.COMPLETE_DELIVERY:
      return {
        ...state,
        runner: {
          ...state.runner,
          deliveries: state.runner.deliveries.map(d =>
            d.id === action.payload.deliveryId
              ? {
                  ...d,
                  status: 'delivered',
                  deliveredAt: new Date().toISOString()
                }
              : d
          )
        }
      };

    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
      };

    case actionTypes.TOGGLE_NOTIFICATION_DRAWER:
      return {
        ...state,
        ui: { ...state.ui, notificationDrawerOpen: !state.ui.notificationDrawerOpen }
      };

    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          activeModal: action.payload.modal,
          modalData: action.payload.data || null
        }
      };

    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        ui: { ...state.ui, activeModal: null, modalData: null }
      };

    case actionTypes.RESET_ALL:
      return initialState;

    case actionTypes.SEED_DEMO_DATA:
      const demoData = seedDemoData(action.payload);
      return {
        ...state,
        profile: demoData.profile,
        notifications: demoData.notifications,
        housekeeping: demoData.housekeeping,
        maintenance: demoData.maintenance,
        runner: demoData.runner
      };

    default:
      return state;
  }
}

export function StaffPortalProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Sync portal data with authenticated user
  useEffect(() => {
    if (isAuthenticated && user) {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedRole = stored ? JSON.parse(stored)?.profile?.role : null;

      // If role changed or no stored data, seed fresh data for the user's role
      if (!stored || storedRole !== user.role) {
        dispatch({ type: actionTypes.SEED_DEMO_DATA, payload: user.role });
      } else {
        try {
          const parsed = JSON.parse(stored);
          dispatch({ type: actionTypes.LOAD_STATE, payload: parsed });
        } catch (e) {
          console.error('Failed to parse stored state:', e);
          dispatch({ type: actionTypes.SEED_DEMO_DATA, payload: user.role });
        }
      }
    } else if (!isAuthenticated) {
      // Reset state when user logs out
      dispatch({ type: actionTypes.RESET_ALL });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (state.profile) {
      const { ui, ...dataToStore } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    }
  }, [state]);

  const setRole = useCallback((role) => {
    dispatch({ type: actionTypes.SEED_DEMO_DATA, payload: role });
  }, []);

  const clockIn = useCallback(() => {
    dispatch({ type: actionTypes.CLOCK_IN });
  }, []);

  const clockOut = useCallback(() => {
    dispatch({ type: actionTypes.CLOCK_OUT });
  }, []);

  const updateProfile = useCallback((updates) => {
    dispatch({ type: actionTypes.UPDATE_PROFILE, payload: updates });
  }, []);

  const addNotification = useCallback((notification) => {
    dispatch({
      type: actionTypes.ADD_NOTIFICATION,
      payload: {
        id: generateId(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification
      }
    });
  }, []);

  const markNotificationRead = useCallback((id) => {
    dispatch({ type: actionTypes.MARK_NOTIFICATION_READ, payload: id });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    dispatch({ type: actionTypes.MARK_ALL_NOTIFICATIONS_READ });
  }, []);

  const deleteNotification = useCallback((id) => {
    dispatch({ type: actionTypes.DELETE_NOTIFICATION, payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_NOTIFICATIONS });
  }, []);

  const updateRoom = useCallback((roomData) => {
    dispatch({ type: actionTypes.UPDATE_ROOM, payload: roomData });
  }, []);

  const updateRoomChecklist = useCallback((roomId, checklistId, completed) => {
    dispatch({
      type: actionTypes.UPDATE_ROOM_CHECKLIST,
      payload: { roomId, checklistId, completed }
    });
  }, []);

  const updateRoomStatus = useCallback((roomId, status) => {
    dispatch({ type: actionTypes.UPDATE_ROOM_STATUS, payload: { roomId, status } });
  }, []);

  const addRoomNote = useCallback((roomId, note) => {
    dispatch({ type: actionTypes.ADD_ROOM_NOTE, payload: { roomId, note } });
  }, []);

  const addHKTask = useCallback((task) => {
    dispatch({ type: actionTypes.ADD_HK_TASK, payload: task });
  }, []);

  const updateHKTask = useCallback((task) => {
    dispatch({ type: actionTypes.UPDATE_HK_TASK, payload: task });
  }, []);

  const deleteHKTask = useCallback((taskId) => {
    dispatch({ type: actionTypes.DELETE_HK_TASK, payload: taskId });
  }, []);

  const updateHKTaskStatus = useCallback((taskId, status) => {
    dispatch({ type: actionTypes.UPDATE_HK_TASK_STATUS, payload: { taskId, status } });
  }, []);

  const addWorkOrder = useCallback((workOrder) => {
    dispatch({ type: actionTypes.ADD_WORK_ORDER, payload: workOrder });
  }, []);

  const updateWorkOrder = useCallback((workOrder) => {
    dispatch({ type: actionTypes.UPDATE_WORK_ORDER, payload: workOrder });
  }, []);

  const deleteWorkOrder = useCallback((workOrderId) => {
    dispatch({ type: actionTypes.DELETE_WORK_ORDER, payload: workOrderId });
  }, []);

  const addWorkOrderComment = useCallback((workOrderId, comment) => {
    dispatch({ type: actionTypes.ADD_WORK_ORDER_COMMENT, payload: { workOrderId, comment } });
  }, []);

  const updateWorkOrderStatus = useCallback((workOrderId, status) => {
    dispatch({ type: actionTypes.UPDATE_WORK_ORDER_STATUS, payload: { workOrderId, status } });
  }, []);

  const addMTTask = useCallback((task) => {
    dispatch({ type: actionTypes.ADD_MT_TASK, payload: task });
  }, []);

  const updateMTTask = useCallback((task) => {
    dispatch({ type: actionTypes.UPDATE_MT_TASK, payload: task });
  }, []);

  const deleteMTTask = useCallback((taskId) => {
    dispatch({ type: actionTypes.DELETE_MT_TASK, payload: taskId });
  }, []);

  const updateMTTaskStatus = useCallback((taskId, status) => {
    dispatch({ type: actionTypes.UPDATE_MT_TASK_STATUS, payload: { taskId, status } });
  }, []);

  const updateMTTaskChecklist = useCallback((taskId, checklistId, completed) => {
    dispatch({
      type: actionTypes.UPDATE_MT_TASK_CHECKLIST,
      payload: { taskId, checklistId, completed }
    });
  }, []);

  const addEquipmentIssue = useCallback((issue) => {
    dispatch({ type: actionTypes.ADD_EQUIPMENT_ISSUE, payload: issue });
  }, []);

  const updateEquipmentIssue = useCallback((issue) => {
    dispatch({ type: actionTypes.UPDATE_EQUIPMENT_ISSUE, payload: issue });
  }, []);

  const deleteEquipmentIssue = useCallback((issueId) => {
    dispatch({ type: actionTypes.DELETE_EQUIPMENT_ISSUE, payload: issueId });
  }, []);

  const addPickupRequest = useCallback((request) => {
    dispatch({ type: actionTypes.ADD_PICKUP_REQUEST, payload: request });
  }, []);

  const updatePickupRequest = useCallback((request) => {
    dispatch({ type: actionTypes.UPDATE_PICKUP_REQUEST, payload: request });
  }, []);

  const deletePickupRequest = useCallback((requestId) => {
    dispatch({ type: actionTypes.DELETE_PICKUP_REQUEST, payload: requestId });
  }, []);

  const acceptPickup = useCallback((pickupId) => {
    dispatch({ type: actionTypes.ACCEPT_PICKUP, payload: { pickupId } });
  }, []);

  const completePickup = useCallback((pickupId) => {
    dispatch({ type: actionTypes.COMPLETE_PICKUP, payload: { pickupId } });
  }, []);

  const addDelivery = useCallback((delivery) => {
    dispatch({ type: actionTypes.ADD_DELIVERY, payload: delivery });
  }, []);

  const updateDelivery = useCallback((delivery) => {
    dispatch({ type: actionTypes.UPDATE_DELIVERY, payload: delivery });
  }, []);

  const deleteDelivery = useCallback((deliveryId) => {
    dispatch({ type: actionTypes.DELETE_DELIVERY, payload: deliveryId });
  }, []);

  const acceptDelivery = useCallback((deliveryId) => {
    dispatch({ type: actionTypes.ACCEPT_DELIVERY, payload: { deliveryId } });
  }, []);

  const completeDelivery = useCallback((deliveryId) => {
    dispatch({ type: actionTypes.COMPLETE_DELIVERY, payload: { deliveryId } });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_SIDEBAR });
  }, []);

  const toggleNotificationDrawer = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_NOTIFICATION_DRAWER });
  }, []);

  const openModal = useCallback((modal, data = null) => {
    dispatch({ type: actionTypes.OPEN_MODAL, payload: { modal, data } });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: actionTypes.CLOSE_MODAL });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: actionTypes.RESET_ALL });
  }, []);

  const seedDemoDataAction = useCallback((role = 'housekeeping') => {
    dispatch({ type: actionTypes.SEED_DEMO_DATA, payload: role });
  }, []);

  const value = {
    ...state,

    setRole,
    clockIn,
    clockOut,
    updateProfile,

    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearNotifications,

    updateRoom,
    updateRoomChecklist,
    updateRoomStatus,
    addRoomNote,

    addHKTask,
    updateHKTask,
    deleteHKTask,
    updateHKTaskStatus,

    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    addWorkOrderComment,
    updateWorkOrderStatus,

    addMTTask,
    updateMTTask,
    deleteMTTask,
    updateMTTaskStatus,
    updateMTTaskChecklist,

    addEquipmentIssue,
    updateEquipmentIssue,
    deleteEquipmentIssue,

    addPickupRequest,
    updatePickupRequest,
    deletePickupRequest,
    acceptPickup,
    completePickup,

    addDelivery,
    updateDelivery,
    deleteDelivery,
    acceptDelivery,
    completeDelivery,

    toggleSidebar,
    toggleNotificationDrawer,
    openModal,
    closeModal,

    resetAll,
    seedDemoData: seedDemoDataAction
  };

  return (
    <StaffPortalContext.Provider value={value}>
      {children}
    </StaffPortalContext.Provider>
  );
}

export function useStaffPortalContext() {
  const context = useContext(StaffPortalContext);
  if (!context) {
    throw new Error('useStaffPortalContext must be used within a StaffPortalProvider');
  }
  return context;
}

export { StaffPortalContext };
export default StaffPortalProvider;
