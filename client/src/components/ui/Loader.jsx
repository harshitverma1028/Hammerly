export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-10 h-10 border-2 border-ink/15 border-t-brass rounded-full animate-spin" />
      <p className="text-sm text-ink/50 tracking-wide">{label}</p>
    </div>
  );
}
