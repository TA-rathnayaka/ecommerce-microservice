export function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-ink/70">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-aqua/30 border-t-aqua" />
        <p className="font-body text-sm">{label}</p>
      </div>
    </div>
  );
}
