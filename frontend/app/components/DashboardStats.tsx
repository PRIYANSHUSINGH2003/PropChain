import React from 'react';
import Card from '../../components/Card';

interface Stat {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface DashboardStatsProps {
  stats: Stat[];
  portfolioChange?: { change: number, percent: number, up: boolean } | null;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, portfolioChange }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 ${stats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4 mb-6`}>
    {stats.map((stat, idx) => (
      <Card
        key={idx}
        glass
        className="p-6 flex items-center hover:shadow-2xl transition-all duration-300 group border border-primary/20 dark:border-primary-dark/30 animate-fade-in min-h-[100px]"
      >
        {stat.icon && <div className="mr-3 text-primary text-3xl group-hover:scale-110 transition-transform">{stat.icon}</div>}
        <div className="flex flex-col justify-center w-full">
          <div className="text-3xl font-extrabold text-primary-dark dark:text-primary-light drop-shadow flex items-center gap-2 overflow-hidden whitespace-nowrap max-w-full">
            <span className="truncate block max-w-[18ch]">{stat.value}</span>
            {stat.label === 'Total Portfolio Value' && portfolioChange && (
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ml-2 ${portfolioChange.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                title={`Change: ${portfolioChange.change >= 0 ? '+' : ''}${portfolioChange.change.toLocaleString()} (${portfolioChange.percent >= 0 ? '+' : ''}${portfolioChange.percent.toFixed(2)}%)`}
              >
                {portfolioChange.up ? '▲' : '▼'} {Math.abs(portfolioChange.percent).toFixed(2)}%
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300 font-bold uppercase tracking-wide mt-1 truncate max-w-[32ch]">{stat.label}</div>
        </div>
      </Card>
    ))}
  </div>
);

export default DashboardStats;
