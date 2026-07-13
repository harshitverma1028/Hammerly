const styles = {
  live: "bg-forest text-parchment",
  upcoming: "bg-brass text-ink",
  ended: "bg-ink/70 text-parchment",
  cancelled: "bg-wine text-parchment",
};

const labels = {
  live: "Live Now",
  upcoming: "Upcoming",
  ended: "Ended",
  cancelled: "Cancelled",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${styles[status] || "bg-ink/10 text-ink"}`}>
      {status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-parchment animate-pulse" />}
      {labels[status] || status}
    </span>
  );
}
