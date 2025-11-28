const tabs = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'paused', label: 'Paused' },
  { id: 'completed', label: 'Completed' },
];

export default function WorkOrderStatusTabs({ activeTab, onTabChange, counts = {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = tab.id === 'all' ? counts.total : counts[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-[#A57865] text-white'
                : 'bg-white border border-neutral-200 text-[#6B6F63] hover:bg-neutral-50'
            }`}
          >
            {tab.label}
            {count !== undefined && (
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-neutral-100 text-[#6B6F63]'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
