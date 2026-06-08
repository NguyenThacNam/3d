import { useEffect } from 'react';
import { XIcon } from '../../components/Icon';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-lg animate-fade-up flex-col rounded-2xl border border-primary-100 bg-white shadow-lift">
        <div className="flex flex-none items-center justify-between border-b border-primary-100 px-5 py-4 sm:px-6">
          <h2 className="font-display text-lg font-bold text-primary-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="grid h-9 w-9 flex-none place-items-center rounded-lg text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-900 cursor-pointer"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="flex flex-none flex-wrap justify-end gap-3 border-t border-primary-100 px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
