import NotificationBell from '../components/notifications/NotificationBell';
import { useProfile } from '../hooks/useStaffPortal';

const PageHeader = ({
  title,
  subtitle,
  actions,
  showNotifications = true,
  className = ''
}) => {
  const { profile } = useProfile();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className={`mb-8 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text">{title}</h1>
          {subtitle && (
            <p className="text-text-light mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {actions}
          {showNotifications && <NotificationBell />}
        </div>
      </div>
    </header>
  );
};

export function DashboardHeader({ name }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <PageHeader
      title={`${getGreeting()}, ${name?.split(' ')[0] || 'Team'}!`}
      subtitle={today}
    />
  );
}

export default PageHeader;
