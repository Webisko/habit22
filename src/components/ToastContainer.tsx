import React from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { toasts } from '../stores/toast';

interface ToastContainerProps {
  lang: string;
}

export default function ToastContainer({ lang }: ToastContainerProps) {
  const $toasts = useStore(toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {$toasts.map((toast) => {
          const Icon = {
            success: CheckCircle,
            error: AlertCircle,
            info: Info
          }[toast.type];

          const colorClass = {
            success: 'border-[#2C2119] bg-[#FAF7F2] text-[#2C2119]',
            error: 'border-red-800 bg-red-50 text-red-900',
            info: 'border-[#8C7C6D] bg-[#F3EDE3] text-[#2C2119]'
          }[toast.type];

          const iconColorClass = {
            success: 'text-[#8C7C6D]',
            error: 'text-red-700',
            info: 'text-[#8C7C6D]'
          }[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto flex items-start p-4 border shadow-md font-sans text-sm tracking-wide gap-3 relative overflow-hidden ${colorClass}`}
            >
              <Icon size={18} className={`shrink-0 mt-0.5 ${iconColorClass}`} />
              <div className="flex-1 pr-6 font-serif">
                {toast.message}
              </div>
              <button
                onClick={() => toasts.set(toasts.get().filter((t) => t.id !== toast.id))}
                className="absolute top-4 right-4 text-[#8C7C6D] hover:text-[#2C2119] transition-colors"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
              {/* Animated Progress Bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-[2px] ${
                  toast.type === 'error' ? 'bg-red-700' : 'bg-[#2C2119]'
                }`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
