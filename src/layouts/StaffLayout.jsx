import Sidebar from '../components/nav/Sidebar';
import NotificationDrawer from '../components/notifications/NotificationDrawer';
import { useUI } from '../hooks/useStaffPortal';

const StaffLayout = ({ children }) => {
  const { sidebarOpen } = useUI();

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />

      <main
        className={`
          transition-all duration-300 ease-in-out
          lg:ml-[260px] min-h-screen
        `}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>

      <NotificationDrawer />
    </div>
  );
};

export default StaffLayout;
