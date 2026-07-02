export function InLaunchBanner({
  currentMonth,
  totalMonths = 6,
}: {
  currentMonth: number;
  totalMonths?: number;
}) {
  return (
    <span className="text-micro inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-3 py-1.5 text-[#92400e]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-warning" />
      </span>
      In launch. Month {currentMonth} of {totalMonths}.
    </span>
  );
}
