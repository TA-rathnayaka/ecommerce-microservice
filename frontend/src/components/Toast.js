const styleMap = {
  success: "border-moss bg-moss/10",
  error: "border-red-500 bg-red-500/10",
  info: "border-aqua bg-aqua/10",
};

export function Toast({ toast, onDismiss }) {
  return (
    <div className={`animate-floatIn rounded-2xl border-l-4 p-4 backdrop-blur ${styleMap[toast.type] || styleMap.info}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-body text-sm text-ink">{toast.message}</p>
        <button
          onClick={onDismiss}
          className="rounded px-1 text-ink/70 hover:bg-white/40 hover:text-ink"
          aria-label="Dismiss notification"
        >
          x
        </button>
      </div>
    </div>
  );
}
