export default function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      <span className="text-emerald-400 text-sm font-semibold tracking-widest">
        LIVE
      </span>
    </div>
  );
}