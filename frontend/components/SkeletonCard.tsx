import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="animate-pulse rounded-2xl p-6 bg-glass dark:bg-darkglass border-2 border-primary/10 dark:border-primary-dark/20 shadow-card flex flex-col gap-4">
    <div className="h-6 w-1/3 bg-primary/20 rounded mb-2" />
    <div className="h-4 w-2/3 bg-primary/10 rounded mb-2" />
    <div className="h-4 w-1/2 bg-primary/10 rounded mb-2" />
    <div className="flex gap-2">
      <div className="h-4 w-16 bg-primary/10 rounded" />
      <div className="h-4 w-16 bg-primary/10 rounded" />
      <div className="h-4 w-16 bg-primary/10 rounded" />
    </div>
    <div className="h-8 w-full bg-primary/10 rounded mt-4" />
  </div>
);

export default SkeletonCard;
