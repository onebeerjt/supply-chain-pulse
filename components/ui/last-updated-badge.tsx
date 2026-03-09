export function LastUpdatedBadge({ iso }: { iso: string }) {
  const dt = new Date(iso);
  const utc = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(dt);
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-200">
      Updated {utc} UTC
    </span>
  );
}
