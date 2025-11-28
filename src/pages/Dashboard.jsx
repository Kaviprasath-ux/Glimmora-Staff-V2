import { useMemo } from 'react';
import ShiftWidget from '../components/dashboard/ShiftWidget';
import QuickActions from '../components/dashboard/QuickActions';
import TasksPreview from '../components/dashboard/TasksPreview';
import RoomsPreview from '../components/dashboard/RoomsPreview';
import AlertsPreview from '../components/dashboard/AlertsPreview';
import WorkOrdersPreview from '../components/dashboard/WorkOrdersPreview';
import PendingRepairs from '../components/dashboard/PendingRepairs';
import EquipmentIssuesOverview from '../components/dashboard/EquipmentIssuesOverview';
import DeliveryTasksOverview from '../components/dashboard/DeliveryTasksOverview';
import PickupRequestsPreview from '../components/dashboard/PickupRequestsPreview';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import { useStaffTasks } from '../context/StaffTasksContext';

export default function Dashboard() {
  const { staff } = useAuth();
  const role = staff?.role || 'housekeeping';
  const { tasks } = useStaffTasks();

  const taskStats = useMemo(() => {
    const totals = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };
    return totals;
  }, [tasks]);

  const renderKpis = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card>
        <p className="text-xs text-[#6B6F63]">Total Tasks</p>
        <p className="text-2xl font-semibold text-[#4E5840]">{taskStats.total}</p>
      </Card>
      <Card>
        <p className="text-xs text-[#6B6F63]">To Do</p>
        <p className="text-2xl font-semibold text-[#4E5840]">{taskStats.pending}</p>
      </Card>
      <Card>
        <p className="text-xs text-[#6B6F63]">In Progress</p>
        <p className="text-2xl font-semibold text-[#4E5840]">{taskStats.inProgress}</p>
      </Card>
      <Card>
        <p className="text-xs text-[#6B6F63]">Completed</p>
        <p className="text-2xl font-semibold text-[#4E5840]">{taskStats.completed}</p>
      </Card>
    </div>
  );

  const renderHousekeeping = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <ShiftWidget role={role} />
        <QuickActions role={role} />
      </div>
      {renderKpis()}
      <div className="grid md:grid-cols-2 gap-4">
        <TasksPreview role={role} />
        <RoomsPreview role={role} />
      </div>
      <AlertsPreview role={role} />
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <ShiftWidget role={role} />
        <QuickActions role={role} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <WorkOrdersPreview />
        <PendingRepairs />
      </div>
      <EquipmentIssuesOverview />
      <AlertsPreview role={role} />
    </div>
  );

  const renderRunner = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <ShiftWidget role={role} />
        <QuickActions role={role} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <DeliveryTasksOverview />
        <PickupRequestsPreview />
      </div>
      <AlertsPreview role={role} />
    </div>
  );

  if (role === 'maintenance') return renderMaintenance();
  if (role === 'runner') return renderRunner();
  return renderHousekeeping();
}
