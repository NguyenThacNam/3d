import { useState } from 'react';
import PageHeader from './PageHeader';
import Badge from './Badge';
import { CheckIcon, LayersIcon } from '../../components/Icon';
import type { AssignmentsMap } from '../../api/types';

export interface AssignEntity {
  id: string;
  name: string;
  meta?: string;
}

export interface AssignCourse {
  id: number;
  title: string;
  subject: string;
}

interface AssignBoardProps {
  title: string;
  subtitle?: string;
  entityLabel: string;
  entities: AssignEntity[];
  courses: AssignCourse[];
  initial: AssignmentsMap;
  /** Lưu danh sách khóa học của một thực thể (gọi API) */
  onSave: (entityId: string, courseIds: number[]) => Promise<unknown>;
  emptyAvailable?: string;
}

export default function AssignBoard({
  title, subtitle, entityLabel, entities, courses, initial, onSave, emptyAvailable,
}: AssignBoardProps) {
  const [activeId, setActiveId] = useState(entities[0]?.id ?? '');
  const [assigned, setAssigned] = useState<AssignmentsMap>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async (courseId: number) => {
    const list = assigned[activeId] ?? [];
    const next = list.includes(courseId) ? list.filter((c) => c !== courseId) : [...list, courseId];
    const prev = assigned;
    setAssigned({ ...assigned, [activeId]: next }); // optimistic
    setSaving(true);
    setError(null);
    try {
      await onSave(activeId, next);
    } catch (e) {
      setAssigned(prev); // rollback
      setError(e instanceof Error ? e.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const activeAssigned = assigned[activeId] ?? [];

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-primary-100 bg-white p-3 shadow-soft">
          <p className="px-2 py-2 text-xs font-bold uppercase tracking-wide text-primary-400">{entityLabel}</p>
          <div className="space-y-1">
            {entities.map((e) => {
              const count = (assigned[e.id] ?? []).length;
              const active = e.id === activeId;
              return (
                <button key={e.id} onClick={() => setActiveId(e.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left transition-colors duration-200 cursor-pointer ${active ? 'bg-primary-600 text-white shadow-soft' : 'text-primary-800 hover:bg-primary-50'}`}>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{e.name}</span>
                    {e.meta && <span className={`block truncate text-xs ${active ? 'text-primary-100' : 'text-primary-500'}`}>{e.meta}</span>}
                  </span>
                  <span className={`flex-none rounded-full px-2 py-0.5 text-xs font-bold ${active ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-600'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold text-primary-800">
              Khóa học cho <span className="text-primary-600">{entities.find((e) => e.id === activeId)?.name}</span>
            </p>
            <span className="flex items-center gap-2">
              {saving && <span className="text-xs font-semibold text-primary-400">Đang lưu…</span>}
              <Badge tone="green">{activeAssigned.length} đã gán</Badge>
            </span>
          </div>

          {courses.length === 0 ? (
            <p className="rounded-xl bg-primary-50 px-4 py-8 text-center text-sm text-primary-500">
              {emptyAvailable ?? 'Chưa có khóa học khả dụng.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {courses.map((c) => {
                const on = activeAssigned.includes(c.id);
                return (
                  <button key={c.id} onClick={() => toggle(c.id)} aria-pressed={on} disabled={saving}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors duration-200 cursor-pointer disabled:opacity-70 ${on ? 'border-accent-500 bg-emerald-50' : 'border-primary-100 hover:border-primary-300 hover:bg-primary-50/50'}`}>
                    <span className={`grid h-10 w-10 flex-none place-items-center rounded-lg ${on ? 'bg-accent-500 text-white' : 'bg-primary-50 text-primary-500'}`}>
                      {on ? <CheckIcon className="h-5 w-5" /> : <LayersIcon className="h-5 w-5" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-primary-900">{c.title}</span>
                      <span className="block text-xs font-semibold text-primary-500">{c.subject}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
