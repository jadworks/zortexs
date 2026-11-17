import { Bell, X } from 'lucide-react';
import { NotificationToast } from '../types';

interface ToastStackProps {
  toasts: readonly NotificationToast[];
  onDismiss: (id: string) => void;
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-xs w-[calc(100vw-2rem)]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="bg-stone-900 text-white border border-stone-700 rounded-xl p-4 shadow-xl flex items-start gap-3"
        >
          <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white">{toast.title}</p>
            <p className="text-xs text-stone-300 mt-0.5 leading-snug">{toast.body}</p>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Fermer la notification"
            className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
