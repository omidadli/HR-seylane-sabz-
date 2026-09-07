import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const showToast = (message: string, type: ToastMessage['type'] = 'success', title?: string, duration: number = 3500) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('seilaneh-toast', {
      detail: {
        id: Math.random().toString(36).substring(2, 9),
        title,
        message,
        type,
        duration,
      },
    });
    window.dispatchEvent(event);
  }
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      if (customEvent.detail) {
        const newToast = customEvent.detail;
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration || 3500);
      }
    };

    window.addEventListener('seilaneh-toast', handleToast);
    return () => window.removeEventListener('seilaneh-toast', handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-5 left-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
                isSuccess
                  ? 'bg-emerald-900/90 border-emerald-700 text-white'
                  : isError
                  ? 'bg-rose-900/90 border-rose-700 text-white'
                  : isWarning
                  ? 'bg-amber-900/90 border-amber-700 text-white'
                  : 'bg-slate-900/90 border-slate-700 text-white'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-sky-400" />}
              </div>

              <div className="flex-1 min-w-0">
                {toast.title && (
                  <div className="text-xs font-bold mb-0.5 text-white/90">
                    {toast.title}
                  </div>
                )}
                <div className="text-xs font-medium text-slate-100 leading-relaxed">
                  {toast.message}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-white/60 hover:text-white transition-colors p-1"
                aria-label="بستن پیام"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
