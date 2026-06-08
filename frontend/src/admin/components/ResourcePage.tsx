import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable, { type Column } from './DataTable';
import PageHeader from './PageHeader';
import Modal from './Modal';
import { ErrorState, Spinner } from '../../components/AsyncSection';
import { useAsync } from '../../hooks/useAsync';
import type { Page, PageParams } from '../../api/types';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
} from '../../components/Icon';

export interface Field {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'select' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

type Values = Record<string, string>;

interface ResourcePageProps<T extends { id: number }> {
  title: string;
  subtitle?: string;
  addLabel: string;
  modalTitle: string;
  columns: Column<T>[];
  fields: Field[];
  load: (p: PageParams) => Promise<Page<T>>;
  onCreate: (values: Values) => Promise<unknown>;
  onUpdate: (row: T, values: Values) => Promise<unknown>;
  onDelete: (row: T) => Promise<void>;
  toForm: (row: T) => Values;
  onImport?: (file: File) => Promise<{ created: number; skipped: number }>;
  onDownloadTemplate?: () => void;
  pageSize?: number;
}

export default function ResourcePage<T extends { id: number }>(props: ResourcePageProps<T>) {
  const {
    title, subtitle, addLabel, modalTitle, columns, fields,
    load, onCreate, onUpdate, onDelete, toForm, onImport, onDownloadTemplate, pageSize = 10,
  } = props;

  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');

  // Debounce ô tìm kiếm; mỗi lần đổi từ khóa thì về trang 1
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const state = useAsync<Page<T>>(() => load({ page, pageSize, q: debouncedQ }), [page, debouncedQ, pageSize]);
  const data = state.data;
  const rows = useMemo(() => data?.items ?? [], [data]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Values>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(Object.fromEntries(fields.map((f) => [f.name, f.type === 'select' ? f.options?.[0]?.value ?? '' : ''])));
    setNotice(null);
    setOpen(true);
  };
  const openEdit = (row: T) => {
    setEditing(row);
    setForm(toForm(row));
    setNotice(null);
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing) await onUpdate(editing, form);
      else await onCreate(form);
      setOpen(false);
      state.reload();
    } catch (err) {
      setNotice({ tone: 'err', text: err instanceof Error ? err.message : 'Lưu thất bại' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: T) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bản ghi này?')) return;
    try {
      await onDelete(row);
      // nếu xóa bản ghi cuối của trang > 1 thì lùi trang
      if (rows.length === 1 && page > 1) setPage((p) => p - 1);
      else state.reload();
    } catch (err) {
      setNotice({ tone: 'err', text: err instanceof Error ? err.message : 'Xóa thất bại' });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImport) return;
    try {
      const res = await onImport(file);
      setNotice({ tone: 'ok', text: `Đã nhập ${res.created} bản ghi (bỏ qua ${res.skipped}).` });
      setPage(1);
      state.reload();
    } catch (err) {
      setNotice({ tone: 'err', text: err instanceof Error ? err.message : 'Nhập file thất bại' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {onDownloadTemplate && (
              <button onClick={onDownloadTemplate} className="inline-flex items-center gap-1.5 rounded-xl border border-primary-200 bg-white px-3.5 py-2.5 text-sm font-bold text-primary-700 transition-colors duration-200 hover:bg-primary-50 cursor-pointer">
                <DownloadIcon className="h-4 w-4" /> Tải mẫu
              </button>
            )}
            {onImport && (
              <>
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="hidden" />
                <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl border border-primary-200 bg-white px-3.5 py-2.5 text-sm font-bold text-primary-700 transition-colors duration-200 hover:bg-primary-50 cursor-pointer">
                  <UploadIcon className="h-4 w-4" /> Nhập Excel
                </button>
              </>
            )}
            <button onClick={openAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition-colors duration-200 hover:bg-primary-700 cursor-pointer">
              <PlusIcon className="h-4 w-4" /> {addLabel}
            </button>
          </div>
        }
      />

      {notice && (
        <div className={`mb-4 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${notice.tone === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} className="text-xs font-bold underline cursor-pointer">Đóng</button>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary-100 bg-white px-3.5 py-2.5 shadow-soft focus-within:ring-2 focus-within:ring-primary-200">
        <SearchIcon className="h-4 w-4 flex-none text-primary-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm…" className="w-full bg-transparent text-sm text-primary-900 placeholder:text-primary-400 focus:outline-none" />
      </div>

      {state.error ? (
        <ErrorState message={state.error} onRetry={state.reload} />
      ) : state.loading && !data ? (
        <Spinner />
      ) : (
        <>
          <DataTable<T>
            columns={columns}
            rows={rows}
            rowKey={(r) => String(r.id)}
            empty={debouncedQ ? 'Không tìm thấy bản ghi phù hợp.' : 'Chưa có dữ liệu.'}
            actions={(row) => (
              <div className="flex justify-end gap-1.5">
                <button onClick={() => openEdit(row)} aria-label="Sửa" className="grid h-8 w-8 place-items-center rounded-lg text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-700 cursor-pointer">
                  <EditIcon className="h-4 w-4" />
                </button>
                <button onClick={() => remove(row)} aria-label="Xóa" className="grid h-8 w-8 place-items-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          />

          {/* Thanh phân trang */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-primary-600">
              Tổng <span className="text-primary-900">{total}</span> bản ghi · Trang {data?.page ?? 1}/{pages}
              {state.loading && <span className="ml-2 text-primary-400">đang tải…</span>}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={(data?.page ?? 1) <= 1 || state.loading}
                className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-white px-3 py-2 font-bold text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Trước
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={(data?.page ?? 1) >= pages || state.loading}
                className="inline-flex items-center gap-1 rounded-lg border border-primary-200 bg-white px-3 py-2 font-bold text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                Sau <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      <Modal
        open={open}
        title={editing ? `Sửa: ${modalTitle}` : `Thêm ${modalTitle}`}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-primary-200 px-4 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 cursor-pointer">Hủy</button>
            <button type="submit" form="resource-form" disabled={busy} className="rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-accent-600 disabled:opacity-60 cursor-pointer">
              {busy ? 'Đang lưu…' : editing ? 'Lưu thay đổi' : 'Tạo mới'}
            </button>
          </>
        }
      >
        <form id="resource-form" onSubmit={submit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="mb-1.5 block text-sm font-bold text-primary-800">{f.label}</label>
              {f.type === 'select' ? (
                <select id={f.name} required={f.required} value={form[f.name] ?? ''} onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))} className="w-full rounded-xl border border-primary-200 bg-white px-3.5 py-2.5 text-sm text-primary-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 cursor-pointer">
                  {f.options?.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea id={f.name} rows={3} required={f.required} placeholder={f.placeholder} value={form[f.name] ?? ''} onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))} className="w-full rounded-xl border border-primary-200 bg-white px-3.5 py-2.5 text-sm text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200" />
              ) : (
                <input id={f.name} type={f.type ?? 'text'} required={f.required} placeholder={f.placeholder} value={form[f.name] ?? ''} onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))} className="w-full rounded-xl border border-primary-200 bg-white px-3.5 py-2.5 text-sm text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200" />
              )}
            </div>
          ))}
        </form>
      </Modal>
    </div>
  );
}
