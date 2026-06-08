export function Spinner({ label = 'Đang tải…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-primary-500">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 py-12 text-center">
      <p className="px-6 text-sm font-semibold text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 cursor-pointer"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}

/** Bao bọc nội dung phụ thuộc dữ liệu async: hiện spinner/lỗi/empty hợp lý. */
export function AsyncSection<T>({
  state,
  children,
  loadingLabel,
}: {
  state: { data: T | null; loading: boolean; error: string | null; reload: () => void };
  children: (data: T) => React.ReactNode;
  loadingLabel?: string;
}) {
  if (state.loading) return <Spinner label={loadingLabel} />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
  if (state.data == null) return null;
  return <>{children(state.data)}</>;
}
