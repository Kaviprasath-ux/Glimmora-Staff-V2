import { useState } from 'react';

export default function Checklist({
  items = [],
  onToggle,
  onAdd,
  onRemove,
  editable = true,
  orderId,
}) {
  const [newItemLabel, setNewItemLabel] = useState('');

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  // FIX MT-C02: Check if all items are completed (ready to complete)
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  const handleAdd = () => {
    if (newItemLabel.trim() && onAdd) {
      onAdd(orderId, newItemLabel.trim());
      setNewItemLabel('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      {totalCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#4E5840]">
            Checklist
          </span>
          <div className="flex items-center gap-2">
            {/* FIX MT-C02: Ready to complete indicator */}
            {allCompleted && editable && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ready to Complete
              </span>
            )}
            <span className="text-xs font-semibold text-[#6B6F63]">
              {completedCount}/{totalCount} completed
            </span>
          </div>
        </div>
      )}

      {totalCount > 0 && (
        <div className="w-full bg-neutral-200 rounded-full h-1.5">
          <div
            className="bg-[#5C9BA4] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 group"
          >
            <button
              type="button"
              onClick={() => onToggle && onToggle(orderId, item.id)}
              disabled={!editable}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                item.completed
                  ? 'bg-[#5C9BA4] border-[#5C9BA4]'
                  : 'border-neutral-300 hover:border-[#5C9BA4]'
              } ${!editable ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {item.completed && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <span
              className={`flex-1 text-sm ${
                item.completed
                  ? 'text-neutral-400 line-through'
                  : 'text-[#4E5840]'
              }`}
            >
              {item.label}
            </span>
            {editable && onRemove && (
              <button
                type="button"
                onClick={() => onRemove(orderId, item.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </li>
        ))}
      </ul>

      {editable && onAdd && (
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add checklist item..."
            className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newItemLabel.trim()}
            className="px-3 py-2 text-sm font-medium text-[#A57865] border border-[#A57865] rounded-lg hover:bg-[#A57865]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {totalCount === 0 && !editable && (
        <p className="text-sm text-[#6B6F63] italic">No checklist items</p>
      )}
    </div>
  );
}
