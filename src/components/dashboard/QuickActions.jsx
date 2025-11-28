import Card from '../common/Card';
import Button from '../common/Button';

const actionsByRole = {
  housekeeping: ['Log task update', 'Report room status', 'Request supplies'],
  maintenance: ['Create work order', 'Log repair update', 'Request parts'],
  runner: ['Confirm delivery', 'Confirm pickup', 'Report delay'],
};

export default function QuickActions({ role }) {
  const actions = actionsByRole[role] || [];

  return (
    <Card title="Quick Actions">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button key={action} variant="secondary" className="text-xs px-3 py-1.5">
            {action}
          </Button>
        ))}
        {!actions.length ? <p className="text-sm text-[#6B6F63]">Actions will appear here.</p> : null}
      </div>
    </Card>
  );
}

