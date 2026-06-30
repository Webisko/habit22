import { atom } from 'nanostores';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const toasts = atom<Toast[]>([]);

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const id = Math.random().toString(36).substring(2, 9);
  const current = toasts.get();
  
  toasts.set([...current, { id, message, type }]);
  
  setTimeout(() => {
    toasts.set(toasts.get().filter((t) => t.id !== id));
  }, 4000);
}
