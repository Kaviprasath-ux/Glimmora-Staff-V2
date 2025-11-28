export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white border border-[#E7E1D9] rounded-xl shadow-sm ${className}`}>
      {title ? (
        <div className="border-b border-[#E7E1D9] px-4 py-3">
          <h3 className="text-sm font-semibold text-[#4E5840]">{title}</h3>
        </div>
      ) : null}
      <div className="p-4 text-sm text-[#4E5840]">{children}</div>
    </div>
  );
}

