import { X } from 'lucide-react';

export default function Modal({ children, open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#4C566A]/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-default transition hover:bg-background-light-sand hover:text-accent-warm-grey"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
