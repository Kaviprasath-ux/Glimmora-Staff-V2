export default function ScheduleTable({ entries = [] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E7E1D9] bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-[#F2EBE3] text-left text-xs uppercase tracking-wide text-[#4E5840]">
          <tr>
            <th className="px-4 py-3">Day</th>
            <th className="px-4 py-3">Shift</th>
            <th className="px-4 py-3">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E7E1D9] text-[#4E5840]">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-4 py-3">{entry.day}</td>
              <td className="px-4 py-3">{entry.shift}</td>
              <td className="px-4 py-3">{entry.location}</td>
            </tr>
          ))}
          {!entries.length ? (
            <tr>
              <td className="px-4 py-6 text-center text-[#6B6F63]" colSpan={3}>
                No schedule available.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

