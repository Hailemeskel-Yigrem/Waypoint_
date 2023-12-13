import React, { createContext, useCallback, useContext, useState } from 'react';
import styles from './Toast.module.css';
import { cn } from '../../utils/cn.js';

export type ToastVariant = 'default' | 'success' | 'error';
export interface ToastMessage {
  id: string;
  message: string;
  variant?: ToastVariant;
}
interface ToastContextValue {
  push: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const push = useCallback((message: string, variant: ToastVariant = 'default') => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className={styles.container}>
        {toasts.map((t) => (
          <div key={t.id} className={cn(styles.toast, t.variant && styles[t.variant])}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
