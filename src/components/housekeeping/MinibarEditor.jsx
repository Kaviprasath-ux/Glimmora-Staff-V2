export default function MinibarEditor({ items, onUpdate, roomId, disabled = false }) {
  const consumedItems = items.filter(item => item.consumed);
  const totalRevenue = consumedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-[#4E5840]">Minibar</h4>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B6F63]">
            {consumedItems.length} consumed
          </span>
          {totalRevenue > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-600 rounded-full">
              ${totalRevenue}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className={`flex items-center justify-between p-2 rounded-lg border ${
              item.consumed
                ? 'bg-[#CDB261]/10 border-[#CDB261]/30'
                : 'bg-white border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => !disabled && onUpdate(roomId, item.name, !item.consumed)}
                disabled={disabled}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.consumed
                    ? 'bg-[#CDB261] border-[#CDB261]'
                    : 'border-neutral-300 hover:border-[#CDB261]'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {item.consumed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className={`text-sm ${item.consumed ? 'text-[#CDB261]' : 'text-[#4E5840]'}`}>
                {item.name}
              </span>
            </div>
            <span className={`text-sm font-medium ${item.consumed ? 'text-[#CDB261]' : 'text-[#6B6F63]'}`}>
              ${item.price}
            </span>
          </div>
        ))}
      </div>

      {totalRevenue > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
          <span className="text-sm font-medium text-[#4E5840]">Total Charges</span>
          <span className="text-lg font-bold text-green-600">${totalRevenue}</span>
        </div>
      )}
    </div>
  );
}
