import React from 'react';

export default function LoadingSpinner({ size = 6, color = 'teal' }: { size?: number; color?: string }) {
  const colorMap: Record<string, string> = {
    teal: 'border-teal-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    gray: 'border-gray-500',
    white: 'border-white',
  };
  return (
    <div className={`animate-spin rounded-full h-${size} w-${size} border-2 border-t-transparent ${colorMap[color] || colorMap.teal}`}></div>
  );
}
