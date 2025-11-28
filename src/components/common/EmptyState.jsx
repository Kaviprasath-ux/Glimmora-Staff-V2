export default function EmptyState({ title = 'No data yet', description }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-[#D6CBBE] rounded-xl p-6 bg-white text-center">
      <p className="text-base font-semibold text-[#4E5840]">{title}</p>
      {description ? <p className="text-sm text-[#6B6F63] mt-2">{description}</p> : null}
    </div>
  );
}

