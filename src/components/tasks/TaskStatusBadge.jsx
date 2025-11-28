const statusStyles = {
  'in-progress': 'bg-[#5C9BA4]/15 text-[#5C9BA4]',
  pending: 'bg-[#CDB261]/20 text-[#8C742A]',
  completed: 'bg-[#4E5840]/15 text-[#4E5840]',
  blocked: 'bg-[#C8B29D]/20 text-[#7A5D3D]',
};

export default function TaskStatusBadge({ status }) {
  const normalized = status || 'pending';
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[normalized] || statusStyles.pending}`}>
      {normalized.replace('-', ' ')}
    </span>
  );
}

