import React from 'react';

type PropertyCardProps = {
  name: string;
  description: string;
  value: number;
  tokenId: number;
  owner?: string;
  children?: React.ReactNode;
};

import Badge from './Badge';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

export default function PropertyCard({ name, description, value, tokenId, owner, children }: PropertyCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BuildingOffice2Icon className="h-6 w-6 text-teal-500" />
          <h3 className="text-lg font-bold text-teal-600">{name}</h3>
        </div>
        <Badge color="gray">Token #{tokenId}</Badge>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-teal-700 dark:text-teal-400 font-semibold text-lg">${value}</span>
        {owner && <span className="text-xs text-gray-500">Owner: {owner}</span>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
