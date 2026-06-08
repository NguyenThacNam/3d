import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Nạp dữ liệu bất đồng bộ với trạng thái loading/error và hàm reload. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    run()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e) => setState({ data: null, loading: false, error: e?.message ?? 'Đã có lỗi xảy ra' }));
  }, [run]);

  useEffect(() => {
    reload();
  }, [reload]);

  const setData = useCallback((data: T) => setState((s) => ({ ...s, data })), []);

  return { ...state, reload, setData };
}
