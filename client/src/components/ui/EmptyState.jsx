export default function EmptyState({ title = "Nothing here yet", message = "", action = null }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 border border-dashed border-ink/15 rounded-sm bg-white/40">
      <h3 className="font-display text-xl font-bold text-ink mb-2">{title}</h3>
      {message && <p className="text-ink/60 max-w-md mb-4">{message}</p>}
      {action}
    </div>
  );
}
