export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg font-semibold text-[#4E5840]">{title}</h2>
        {subtitle ? <p className="text-sm text-[#6B6F63]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

