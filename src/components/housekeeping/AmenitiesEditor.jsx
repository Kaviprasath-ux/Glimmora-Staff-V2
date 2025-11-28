const amenityLabels = {
  towels: 'Towels',
  toiletries: 'Toiletries',
  water: 'Water',
  coffee: 'Coffee/Tea',
  toiletRoll: 'Toilet Roll',
  slippers: 'Slippers',
};

const amenityIcons = {
  towels: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  toiletries: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  water: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  coffee: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  toiletRoll: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  slippers: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

export default function AmenitiesEditor({ amenities, onUpdate, roomId, disabled = false }) {
  const completedCount = Object.values(amenities).filter(Boolean).length;
  const totalCount = Object.keys(amenities).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-[#4E5840]">Amenities</h4>
        <span className="text-xs text-[#6B6F63]">
          {completedCount}/{totalCount} restocked
        </span>
      </div>

      <div className="w-full bg-neutral-200 rounded-full h-1.5">
        <div
          className="bg-[#A57865] h-1.5 rounded-full transition-all"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(amenities).map(([key, value]) => (
          <button
            key={key}
            onClick={() => !disabled && onUpdate(roomId, key, !value)}
            disabled={disabled}
            className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
              value
                ? 'bg-[#5C9BA4]/10 border-[#5C9BA4] text-[#5C9BA4]'
                : 'bg-white border-neutral-200 text-[#6B6F63] hover:border-[#A57865]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center ${
              value ? 'bg-[#5C9BA4] text-white' : 'bg-neutral-100'
            }`}>
              {value ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                amenityIcons[key]
              )}
            </div>
            <span className="text-xs font-medium">{amenityLabels[key]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
