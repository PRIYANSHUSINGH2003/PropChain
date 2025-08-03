import React, { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: ReactNode;
  type?: ToastType;
  onClose: () => void;
}

const colors: Record<ToastType, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-primary',
  warning: 'bg-yellow-500',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => (
  <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-lg shadow-xl text-white font-semibold flex items-center gap-3 animate-fade-in ${colors[type]}`}>
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 text-white/80 hover:text-white text-lg font-bold">&times;</button>
  </div>
);

export default Toast;
