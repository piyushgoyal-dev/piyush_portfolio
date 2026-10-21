/** Glass pill: pulsing green dot + "Available for work". */
export function AvailabilityBadge({ className = '' }: { className?: string }) {
  return (
    <p data-no-about className={`glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-bone ${className}`}>
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-[#7ee08a] [animation:pulse-ring_2s_ease-out_infinite]" />
        <span className="relative h-2 w-2 rounded-full bg-[#7ee08a]" />
      </span>
      Available for work
    </p>
  );
}
