import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  as?: 'input' | 'textarea';
}

const Input: React.FC<InputProps> = ({ label, error, className = '', as = 'input', ...props }) => (
  <div className="w-full mb-4">
    {label && <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>}
    {as === 'textarea' ? (
      <textarea
        className={[
          'w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition',
          error ? 'border-red-500 focus:ring-red-400' : '',
          className,
        ].join(' ')}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    ) : (
      <input
        className={[
          'w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition',
          error ? 'border-red-500 focus:ring-red-400' : '',
          className,
        ].join(' ')}
        {...props}
      />
    )}
    {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
  </div>
);

export default Input;
