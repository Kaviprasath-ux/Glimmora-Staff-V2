import { useState, useMemo } from 'react';
import { useWorkOrders } from '../context/WorkOrdersContext';
import { useStaffNotifications } from '../context/StaffNotificationsContext';
import { useAuth } from '../context/AuthContext';
import WorkOrderCard from '../components/workorders/WorkOrderCard';
import WorkOrderModal from '../components/workorders/WorkOrderModal';
import WorkOrderStatusTabs from '../components/workorders/WorkOrderStatusTabs';
import KPIBar from '../components/workorders/KPIBar';
import { categories, technicians } from '../data/workOrders';

export default function MaintenanceDashboard() {
  const {
    workOrders,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getMaintenanceKPIs,
    filterWorkOrders,
    assignTechnician,
  } = useWorkOrders();

  const { addNotification } = useStaffNotifications();
  const { staff } = useAuth();

  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    assignedTo: 'all',
    search: '',
  });

  const kpis = useMemo(() => getMaintenanceKPIs(), [getMaintenanceKPIs]);

  const filteredOrders = useMemo(() => {
    return filterWorkOrders({
      status: activeTab,
      priority: filters.priority,
      category: filters.category,
      assignedTo: filters.assignedTo,
      search: filters.search,
    });
  }, [filterWorkOrders, activeTab, filters]);

  const counts = useMemo(() => ({
    total: workOrders.length,
    new: workOrders.filter(o => o.status === 'new').length,
    inprogress: workOrders.filter(o => o.status === 'inprogress').length,
    paused: workOrders.filter(o => o.status === 'paused').length,
    completed: workOrders.filter(o => o.status === 'completed').length,
  }), [workOrders]);

  const handleCreateOrder = (orderData) => {
    const newOrder = createWorkOrder({
      ...orderData,
      reportedBy: staff?.id,
    });

    if (addNotification) {
      addNotification({
        type: 'maintenance',
        title: 'New Work Order Created',
        message: `Work order "${newOrder.title}" has been created`,
      });

      if (orderData.priority === 'critical') {
        addNotification({
          type: 'maintenance',
          title: 'Critical Work Order',
          message: `URGENT: "${newOrder.title}" requires immediate attention`,
        });
      }

      if (orderData.assignedTo) {
        const tech = technicians.find(t => t.id === orderData.assignedTo);
        addNotification({
          type: 'maintenance',
          title: 'Technician Assigned',
          message: `${tech?.name || 'Technician'} assigned to "${newOrder.title}"`,
        });
      }
    }
  };

  const handleUpdateOrder = (orderData) => {
    if (editingOrder?.id) {
      updateWorkOrder(editingOrder.id, orderData);

      if (orderData.assignedTo && orderData.assignedTo !== editingOrder.assignedTo) {
        assignTechnician(editingOrder.id, orderData.assignedTo);
        const tech = technicians.find(t => t.id === orderData.assignedTo);
        if (addNotification) {
          addNotification({
            type: 'maintenance',
            title: 'Technician Assigned',
            message: `${tech?.name || 'Technician'} assigned to "${orderData.title}"`,
          });
        }
      }
    }
    setEditingOrder(null);
  };

  const handleDeleteOrder = (orderId) => {
    deleteWorkOrder(orderId);
    setShowDeleteConfirm(null);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priority: 'all',
      assignedTo: 'all',
      search: '',
    });
  };

  const hasActiveFilters = filters.category !== 'all' || filters.priority !== 'all' || filters.assignedTo !== 'all' || filters.search;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4E5840]">Maintenance Dashboard</h1>
          <p className="text-sm text-[#6B6F63] mt-1">
            Manage and track maintenance work orders
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Work Order
        </button>
      </div>

      {/* KPI Bar */}
      <KPIBar kpis={kpis} />

      {/* Status Tabs */}
      <WorkOrderStatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {/* Filters */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6F63]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by title or room..."
                className="w-full pl-10 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filters.assignedTo}
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
            >
              <option value="all">All Technicians</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm font-medium text-[#A57865] hover:bg-[#A57865]/10 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Work Order Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <WorkOrderCard
              key={order.id}
              order={order}
              onEdit={openEditModal}
              onDelete={(id) => setShowDeleteConfirm(id)}
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-[#4E5840] mb-2">
              No work orders found
            </h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              {hasActiveFilters
                ? 'No work orders match your current filters.'
                : "There are no work orders yet. Create your first work order to get started."}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Work Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* Work Order Modal */}
      <WorkOrderModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}
        order={editingOrder}
        mode={editingOrder ? 'edit' : 'add'}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[#4E5840] mb-2">
              Delete Work Order
            </h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              Are you sure you want to delete this work order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-[#6B6F63] border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(showDeleteConfirm)}
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
