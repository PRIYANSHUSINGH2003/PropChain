import React from 'react';

export default function Badge({ children, color = 'teal' }: { children: React.ReactNode; color?: string }) {
  const colorMap: Record<string, string> = {
    teal: 'bg-teal-100 text-teal-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorMap[color] || colorMap.teal}`}>{children}</span>
  );
}
