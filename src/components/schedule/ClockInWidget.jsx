import Button from '../common/Button';

export default function ClockInWidget() {
  return (
    <div className="rounded-xl border border-[#E7E1D9] bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-[#4E5840]">Shift Controls</p>
      <p className="text-xs text-[#6B6F63] mt-1">Clock in/out will be available in Phase 2.</p>
      <div className="mt-3 flex gap-2">
        <Button disabled className="cursor-not-allowed opacity-60">
          Clock In
        </Button>
        <Button variant="secondary" disabled className="cursor-not-allowed opacity-60">
          Clock Out
        </Button>
      </div>
    </div>
  );
}

