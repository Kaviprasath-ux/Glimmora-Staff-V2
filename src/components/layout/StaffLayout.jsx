import StaffSidebar from './StaffSidebar';
import StaffTopbar from './StaffTopbar';

export default function StaffLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#4E5840] flex">
      <StaffSidebar />
      <div className="flex-1 flex flex-col">
        <StaffTopbar title={title} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

