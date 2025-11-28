const statusVariants = {
  'in-progress': 'bg-[#5C9BA4]/15 text-[#5C9BA4]',
  pending: 'bg-[#C8B29D]/20 text-[#7A5D3D]',
  completed: 'bg-[#4E5840]/15 text-[#4E5840]',
  scheduled: 'bg-[#CDB261]/20 text-[#8C742A]',
};

export default function WorkOrderStatusBadge({ status }) {
  const variant = statusVariants[status] || statusVariants.pending;
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${variant}`}>{status}</span>;
}

