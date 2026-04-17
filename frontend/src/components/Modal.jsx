import { X } from 'lucide-react';

export default function Modal({ children, open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950/95 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)]"
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end border-b border-slate-800 p-4">
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}
