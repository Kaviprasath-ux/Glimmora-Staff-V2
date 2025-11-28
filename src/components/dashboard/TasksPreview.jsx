import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import TaskStatusBadge from '../tasks/TaskStatusBadge';
import { useStaffTasks } from '../../context/StaffTasksContext';

export default function TasksPreview({ role }) {
  const { tasks } = useStaffTasks();
  const preview = tasks.slice(0, 3);

  return (
    <Card title={role === 'runner' ? 'Delivery Tasks' : 'My Tasks'}>
      {preview.length ? (
        <div className="space-y-3">
          {preview.map((task) => (
            <div key={task.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#4E5840]">{task.title}</p>
                <p className="text-xs text-[#6B6F63]">Room {task.room}</p>
              </div>
              <TaskStatusBadge status={task.status} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No tasks assigned" />
      )}
    </Card>
  );
}

