import { useState } from 'react';

function formatTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Comments({
  comments = [],
  onAddComment,
  orderId,
  currentUser,
}) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(orderId, newComment.trim(), currentUser?.name || 'Unknown User');
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[#4E5840]">
        Comments ({comments.length})
      </h3>

      {/* Comment List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-[#6B6F63] italic">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#A57865]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-[#A57865]">
                  {getInitials(comment.author)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[#4E5840]">
                    {comment.author}
                  </span>
                  <span className="text-xs text-[#6B6F63]">
                    {formatTimeAgo(comment.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-[#6B6F63] break-words">
                  {comment.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      {onAddComment && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A57865]/30 focus:border-[#A57865]"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-[#A57865] rounded-lg hover:bg-[#8E6554] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
