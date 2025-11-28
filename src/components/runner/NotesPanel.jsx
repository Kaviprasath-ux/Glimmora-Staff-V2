import { useState } from 'react';

export default function NotesPanel({ notes, taskId, onAddNote }) {
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(taskId, newNote.trim());
      setNewNote('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-[#4E5840] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Notes
          {notes.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-neutral-100 rounded-full">{notes.length}</span>
          )}
        </h3>
      </div>

      {/* Notes List */}
      <div className="max-h-64 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <svg className="w-8 h-8 text-neutral-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p className="text-sm text-[#6B6F63]">No notes yet</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="flex gap-3">
                {/* Author Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  note.author === 'Runner'
                    ? 'bg-[#A57865]/10 text-[#A57865]'
                    : note.author === 'System'
                    ? 'bg-[#5C9BA4]/10 text-[#5C9BA4]'
                    : 'bg-[#4E5840]/10 text-[#4E5840]'
                }`}>
                  {note.author.charAt(0)}
                </div>
                {/* Note Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-[#4E5840]">{note.author}</span>
                    <span className="text-xs text-[#6B6F63]">{formatTime(note.timestamp)}</span>
                  </div>
                  <p className="text-sm text-[#6B6F63] break-words">{note.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="border-t border-neutral-100 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30"
          />
          <button
            type="submit"
            disabled={!newNote.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
