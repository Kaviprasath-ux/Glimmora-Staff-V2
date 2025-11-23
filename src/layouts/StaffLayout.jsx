import TopNavBar from '../components/layout/TopNavBar';

const StaffLayout = ({ children }) => {
  const navigation = [
    { name: 'My Tasks', href: '/staff/tasks' },
    { name: 'My Schedule', href: '/staff/schedule' },
    { name: 'My Rooms', href: '/staff/rooms' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40">
        <TopNavBar tabs={navigation} />
      </div>

      {/* Page content */}
      <main className="py-6">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;
