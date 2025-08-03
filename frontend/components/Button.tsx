import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const base =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60 disabled:pointer-events-none';

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-card',
  secondary:
    'bg-secondary text-white hover:bg-secondary-dark',
  accent:
    'bg-accent text-white hover:bg-accent-dark',
  outline:
    'border border-primary text-primary bg-transparent hover:bg-primary/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => (
  <button
    className={[
      base,
      variants[variant],
      sizes[size],
      className,
    ].join(' ')}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4 mr-2 text-inherit" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    )}
    {children}
  </button>
);

export default Button;
