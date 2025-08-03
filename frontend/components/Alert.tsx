import React from 'react';

interface AlertProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  children: React.ReactNode;
  className?: string;
}

const typeStyles = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const Alert: React.FC<AlertProps> = ({ type = 'info', children, className = '' }) => (
  <div
    className={[
      'w-full px-4 py-3 rounded-lg border text-sm flex items-center gap-2',
      typeStyles[type],
      className,
    ].join(' ')}
    role="alert"
  >
    {children}
  </div>
);

export default Alert;
