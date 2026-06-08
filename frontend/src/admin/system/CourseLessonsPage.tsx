import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { AsyncSection } from '../../components/AsyncSection';
import { useAsync } from '../../hooks/useAsync';
import { courseApi, lessonApi } from '../../api/endpoints';
import { assetUrl } from '../../api/client';
import type { ApiLesson } from '../../api/types';
import {
  ArrowLeftIcon, ClockIcon, EditIcon, ExpandIcon, PlayIcon, PlusIcon, TrashIcon, UploadIcon,
} from '../../components/Icon';

interface LessonForm {
  title: string;
  description: string;
  durationMin: string;
}

export default function CourseLessonsPage() {
  const { courseId = '' } = useParams();
  const state = useAsync(
    () => Promise.all([courseApi.listAll(), lessonApi.listByCourse(courseId)]),
    [courseId],
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ApiLesson | null>(null);
  const [form, setForm] = useState<LessonForm>({ title: '', description: '', durationMin: '10' });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  const uploadTarget = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const onCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNotice(null);
    try {
      await courseApi.uploadCover(Number(courseId), file);
      setNotice({ tone: 'ok', text: 'Đã cập nhật ảnh nền khóa học.' });
      state.reload();
    } catch (err) {
      setNotice({ tone: 'err', text: err instanceof Error ? err.message : 'Tải ảnh thất bại' });
    } finally {
      if (coverRef.current) coverRef.current.value = '';
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', description: '', durationMin: '10' });
    setOpen(true);
  };
  const openEdit = (l: ApiLesson) => {
    setEditing(l);
    setForm({ title: l.title, description: l.description, durationMin: String(l.durationMin) });
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { title: form.title, description: form.description, durationMin: Number(form.durationMin) || 0 };
      if (editing) await lessonApi.update(editing.id, payload);
      else await lessonApi.create(courseId, payload);
      setOpen(false);
      state.reload();
    } catch (err) {
      setNotice({ tone: 'err', text: err instanceof Error ? err.message : 'Lưu thất bại' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (l: ApiLesson) => {
    if (!window.confirm(`Xóa bài học "${l.title}"?`)) return;
    try {
      await lessonApi.remove(l.id);
      state.reload();
    } catch (err) {
      setNotice({ tone: 'err', text: err instanceof Error ? err.message : 'Xóa thất bại' });
    }
  };

  const pickFile = (lessonId: number) => {
    uploadTarget.current = lessonId;
    fileRef.current?.click();
  };
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = uploadTarget.current;
    if (!file || id == null) return;
    setNotice(null);
    try {
      await lessonApi.uploadExperiment(id, file);
      setNotice({ tone: 'ok', text: `Đã tải lên "${file.name}" cho bài học.` });
      state.reload();
    } catch (err) {
      setNotice({ tone: 'err', text: err instanceof Error ? err.message : 'Tải lên thất bại' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
      uploadTarget.current = null;
    }
  };

  const field =
    'w-full rounded-xl border border-primary-200 bg-white px-3.5 py-2.5 text-sm text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200';

  return (
    <div>
      <Link to="/admin/system/courses" className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-800 cursor-pointer">
        <ArrowLeftIcon className="h-4 w-4" /> Quay lại danh sách khóa học
      </Link>

      <AsyncSection state={state} loadingLabel="Đang tải bài học…">
        {([courses, lessons]) => {
          const course = courses.find((c) => String(c.id) === courseId);
          return (
            <>
              {/* Ảnh nền khóa học */}
              <input ref={coverRef} type="file" accept="image/*" onChange={onCoverFile} className="hidden" />
              <div className="relative mb-6 h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-soft sm:h-48">
                {course?.coverUrl ? (
                  <img src={assetUrl(course.coverUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                  <span className="min-w-0 truncate font-display text-lg font-bold text-white drop-shadow sm:text-xl">{course?.title}</span>
                  <button onClick={() => coverRef.current?.click()} className="inline-flex flex-none items-center gap-1.5 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-primary-800 shadow-soft transition-colors hover:bg-white cursor-pointer">
                    <UploadIcon className="h-4 w-4" /> {course?.coverUrl ? 'Đổi ảnh nền' : 'Tải ảnh nền'}
                  </button>
                </div>
              </div>

              <PageHeader
                title="Bài học"
                subtitle="Thêm bài học và tải lên file HTML thí nghiệm 3D cho từng bài."
                action={
                  <button onClick={openAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition-colors duration-200 hover:bg-primary-700 cursor-pointer">
                    <PlusIcon className="h-4 w-4" /> Thêm bài học
                  </button>
                }
              />

              {notice && (
                <div className={`mb-4 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${notice.tone === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                  <span>{notice.text}</span>
                  <button onClick={() => setNotice(null)} className="text-xs font-bold underline cursor-pointer">Đóng</button>
                </div>
              )}

              {/* input file dùng chung cho mọi nút upload */}
              <input ref={fileRef} type="file" accept=".htm,.html" onChange={onFile} className="hidden" />

              {lessons.length === 0 ? (
                <div className="rounded-2xl border border-primary-100 bg-white px-6 py-16 text-center text-primary-500">
                  Chưa có bài học. Bấm “Thêm bài học” để bắt đầu.
                </div>
              ) : (
                <ol className="space-y-3">
                  {lessons.map((l) => (
                    <li key={l.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-primary-100 bg-white p-4 shadow-soft sm:p-5">
                      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-primary-50 font-display text-lg font-bold text-primary-600">
                        {l.order}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-base font-bold text-primary-900">{l.title}</h3>
                        <p className="mt-0.5 line-clamp-1 text-sm text-primary-700/90">{l.description || '—'}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
                          <span className="inline-flex items-center gap-1 text-primary-500"><ClockIcon className="h-3.5 w-3.5" /> {l.durationMin} phút</span>
                          {l.experiment ? (
                            <>
                              <Badge tone="green">Đã có thí nghiệm</Badge>
                              <a href={assetUrl(l.experiment.htmlPath)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 cursor-pointer">
                                <ExpandIcon className="h-3.5 w-3.5" /> Mở thử
                              </a>
                            </>
                          ) : (
                            <Badge tone="amber">Chưa có thí nghiệm</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button onClick={() => pickFile(l.id)} title="Tải lên file HTML thí nghiệm" className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-white px-3 py-2 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-50 cursor-pointer">
                          <UploadIcon className="h-4 w-4" /> {l.experiment ? 'Thay file' : 'Tải HTML'}
                        </button>
                        <button onClick={() => openEdit(l)} aria-label="Sửa" className="grid h-9 w-9 place-items-center rounded-lg text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-700 cursor-pointer">
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(l)} aria-label="Xóa" className="grid h-9 w-9 place-items-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </>
          );
        }}
      </AsyncSection>

      <Modal
        open={open}
        title={editing ? 'Sửa bài học' : 'Thêm bài học'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-primary-200 px-4 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 cursor-pointer">Hủy</button>
            <button type="submit" form="lesson-form" disabled={busy} className="rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-accent-600 disabled:opacity-60 cursor-pointer">
              {busy ? 'Đang lưu…' : editing ? 'Lưu thay đổi' : 'Tạo mới'}
            </button>
          </>
        }
      >
        <form id="lesson-form" onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="l-title" className="mb-1.5 block text-sm font-bold text-primary-800">Tiêu đề bài học</label>
            <input id="l-title" required value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className={field} placeholder="VD: Bài 1: Hệ Mặt Trời" />
          </div>
          <div>
            <label htmlFor="l-desc" className="mb-1.5 block text-sm font-bold text-primary-800">Mô tả</label>
            <textarea id="l-desc" rows={3} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} className={field} placeholder="Mô tả ngắn nội dung bài học" />
          </div>
          <div>
            <label htmlFor="l-dur" className="mb-1.5 block text-sm font-bold text-primary-800">Thời lượng (phút)</label>
            <input id="l-dur" type="number" min={1} value={form.durationMin} onChange={(e) => setForm((s) => ({ ...s, durationMin: e.target.value }))} className={field} />
          </div>
          <p className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-600">
            <PlayIcon className="h-3.5 w-3.5" /> Sau khi tạo bài học, dùng nút “Tải HTML” để gắn file thí nghiệm 3D.
          </p>
        </form>
      </Modal>
    </div>
  );
}
