const tabs = [
  { id: 'all', label: 'All Tasks' },
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' }
];

export default function RunnerStatusTabs({ activeTab, onTabChange, counts }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {tabs.map(tab => {
        const count = tab.id === 'all'
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[tab.id] || 0;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#4E5840] text-white'
                : 'bg-neutral-100 text-[#6B6F63] hover:bg-neutral-200'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${
              activeTab === tab.id
                ? 'bg-white/20'
                : 'bg-neutral-200'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
