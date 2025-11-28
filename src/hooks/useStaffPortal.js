import { useStaffPortalContext } from '../context/StaffPortalContext';
import { useMemo } from 'react';

export function useStaffPortal() {
  return useStaffPortalContext();
}

export function useProfile() {
  const { profile, clockIn, clockOut, updateProfile } = useStaffPortalContext();
  return { profile, clockIn, clockOut, updateProfile };
}

export function useNotifications() {
  const {
    notifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearNotifications
  } = useStaffPortalContext();

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const urgentNotifications = useMemo(
    () => notifications.filter(n => n.priority === 'urgent' && !n.read),
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    urgentNotifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearNotifications
  };
}

export function useHousekeeping() {
  const {
    housekeeping,
    updateRoom,
    updateRoomChecklist,
    updateRoomStatus,
    addRoomNote,
    addHKTask,
    updateHKTask,
    deleteHKTask,
    updateHKTaskStatus
  } = useStaffPortalContext();

  const { rooms, tasks } = housekeeping;

  const stats = useMemo(() => {
    const dirtyRooms = rooms.filter(r => r.status === 'dirty').length;
    const inProgressRooms = rooms.filter(r => r.status === 'in_progress').length;
    const cleanRooms = rooms.filter(r => r.status === 'clean' || r.status === 'inspected').length;
    const urgentRooms = rooms.filter(r => r.priority === 'urgent' || r.priority === 'high').length;

    const pendingTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    return {
      dirtyRooms,
      inProgressRooms,
      cleanRooms,
      urgentRooms,
      totalRooms: rooms.length,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      totalTasks: tasks.length
    };
  }, [rooms, tasks]);

  const roomsByStatus = useMemo(() => ({
    dirty: rooms.filter(r => r.status === 'dirty'),
    in_progress: rooms.filter(r => r.status === 'in_progress'),
    clean: rooms.filter(r => r.status === 'clean'),
    inspected: rooms.filter(r => r.status === 'inspected')
  }), [rooms]);

  const tasksByStatus = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  }), [tasks]);

  return {
    rooms,
    tasks,
    stats,
    roomsByStatus,
    tasksByStatus,
    updateRoom,
    updateRoomChecklist,
    updateRoomStatus,
    addRoomNote,
    addHKTask,
    updateHKTask,
    deleteHKTask,
    updateHKTaskStatus
  };
}

export function useMaintenance() {
  const {
    maintenance,
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
    deleteEquipmentIssue
  } = useStaffPortalContext();

  const { workOrders, tasks, equipmentIssues } = maintenance;

  const stats = useMemo(() => {
    const pendingWorkOrders = workOrders.filter(wo => wo.status === 'pending').length;
    const inProgressWorkOrders = workOrders.filter(wo => wo.status === 'in_progress').length;
    const completedWorkOrders = workOrders.filter(wo => wo.status === 'completed').length;
    const criticalWorkOrders = workOrders.filter(wo => wo.severity === 'critical').length;

    const pendingTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    const pendingIssues = equipmentIssues.filter(ei => ei.status === 'pending').length;
    const inProgressIssues = equipmentIssues.filter(ei => ei.status === 'in_progress').length;

    return {
      pendingWorkOrders,
      inProgressWorkOrders,
      completedWorkOrders,
      criticalWorkOrders,
      totalWorkOrders: workOrders.length,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      totalTasks: tasks.length,
      pendingIssues,
      inProgressIssues,
      totalIssues: equipmentIssues.length
    };
  }, [workOrders, tasks, equipmentIssues]);

  const workOrdersByStatus = useMemo(() => ({
    pending: workOrders.filter(wo => wo.status === 'pending'),
    in_progress: workOrders.filter(wo => wo.status === 'in_progress'),
    completed: workOrders.filter(wo => wo.status === 'completed')
  }), [workOrders]);

  const tasksByStatus = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  }), [tasks]);

  return {
    workOrders,
    tasks,
    equipmentIssues,
    stats,
    workOrdersByStatus,
    tasksByStatus,
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
    deleteEquipmentIssue
  };
}

export function useRunner() {
  const {
    runner,
    addPickupRequest,
    updatePickupRequest,
    deletePickupRequest,
    acceptPickup,
    completePickup,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    acceptDelivery,
    completeDelivery
  } = useStaffPortalContext();

  const { pickupRequests, deliveries } = runner;

  const stats = useMemo(() => {
    const pendingPickups = pickupRequests.filter(pr => pr.status === 'pending').length;
    const inProgressPickups = pickupRequests.filter(pr => pr.status === 'in_progress').length;
    const completedPickups = pickupRequests.filter(pr => pr.status === 'completed').length;
    const urgentPickups = pickupRequests.filter(pr => pr.priority === 'urgent').length;

    const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
    const inTransitDeliveries = deliveries.filter(d => d.status === 'in_transit').length;
    const deliveredDeliveries = deliveries.filter(d => d.status === 'delivered').length;

    return {
      pendingPickups,
      inProgressPickups,
      completedPickups,
      urgentPickups,
      totalPickups: pickupRequests.length,
      pendingDeliveries,
      inTransitDeliveries,
      deliveredDeliveries,
      totalDeliveries: deliveries.length,
      activeTasksCount: pendingPickups + inProgressPickups + pendingDeliveries + inTransitDeliveries
    };
  }, [pickupRequests, deliveries]);

  const pickupsByStatus = useMemo(() => ({
    pending: pickupRequests.filter(pr => pr.status === 'pending'),
    in_progress: pickupRequests.filter(pr => pr.status === 'in_progress'),
    completed: pickupRequests.filter(pr => pr.status === 'completed')
  }), [pickupRequests]);

  const deliveriesByStatus = useMemo(() => ({
    pending: deliveries.filter(d => d.status === 'pending'),
    in_transit: deliveries.filter(d => d.status === 'in_transit'),
    delivered: deliveries.filter(d => d.status === 'delivered')
  }), [deliveries]);

  return {
    pickupRequests,
    deliveries,
    stats,
    pickupsByStatus,
    deliveriesByStatus,
    addPickupRequest,
    updatePickupRequest,
    deletePickupRequest,
    acceptPickup,
    completePickup,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    acceptDelivery,
    completeDelivery
  };
}

export function useUI() {
  const {
    ui,
    toggleSidebar,
    toggleNotificationDrawer,
    openModal,
    closeModal
  } = useStaffPortalContext();

  return {
    ...ui,
    toggleSidebar,
    toggleNotificationDrawer,
    openModal,
    closeModal
  };
}

export default useStaffPortal;
