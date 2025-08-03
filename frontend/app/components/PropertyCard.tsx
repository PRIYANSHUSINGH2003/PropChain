import React from 'react';
import Card from '../../components/Card';

interface Owner {
  owner: string;
  share: number;
}

interface PropertyCardProps {
  name: string;
  description: string;
  value: number;
  owners: Owner[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({ name, description, value, owners }) => {
  return (
    <Card
      glass
      tabIndex={0}
      aria-label={`Property: ${name}, Value: ${value.toLocaleString()}`}
      className="p-6 flex flex-col gap-4 border border-primary/20 dark:border-primary-dark/30 shadow-card focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all group hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 group-active:scale-95 transition-transform">
          {name[0]}
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary group-hover:text-primary-dark dark:text-primary-light transition-colors">
            {name}
          </h3>
          <span className="text-xs text-gray-400">Estimated Value</span>
        </div>
        <div className="ml-auto text-lg font-semibold text-secondary dark:text-secondary-dark">
          ${value.toLocaleString()}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
        {description}
      </p>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 font-semibold">Owners</span>
        <div className="flex flex-wrap gap-2">
          {owners.map((o, i) => (
            <span
              key={i}
              className="bg-primary/10 dark:bg-primary-dark/30 text-primary-dark dark:text-primary-light px-2 py-1 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
              tabIndex={0}
              aria-label={`Owner: ${o.owner}, Share: ${(o.share * 100).toFixed(2)}%`}
            >
              {o.owner.slice(0, 6)}...{o.owner.slice(-4)} ({(o.share * 100).toFixed(2)}%)
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
