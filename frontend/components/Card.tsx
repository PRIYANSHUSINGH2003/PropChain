import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  shadow = true,
  glass = false,
  ...props
}) => (
  <div
    className={[
      'rounded-2xl p-6 bg-white dark:bg-gray-900',
      shadow ? 'shadow-card' : '',
      glass ? 'backdrop-blur-xs dark:bg-darkglass' : '',
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </div>
);

export default Card;
