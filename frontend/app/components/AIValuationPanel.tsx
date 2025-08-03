import React from 'react';
import { SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Card from '../../components/Card';

interface AIValuationPanelProps {
  valuation?: number;
  riskScore?: number;
  complianceStatus?: string;
  loading?: boolean;
}

const AIValuationPanel: React.FC<AIValuationPanelProps> = ({ valuation, riskScore, complianceStatus, loading }) => {
  return (
    <Card glass className="p-8 max-w-lg mx-auto mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="h-6 w-6 text-primary animate-pulse" />
        <h2 className="text-xl font-extrabold text-primary dark:text-primary-light tracking-tight">AI Valuation & Compliance</h2>
      </div>
      {loading ? (
        <div className="text-primary font-semibold flex items-center gap-2 animate-pulse">
          <SparklesIcon className="h-5 w-5" /> Analyzing property...
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-300 text-sm font-medium">Valuation:</span>
            <span className="text-primary-dark dark:text-primary-light font-bold text-lg">{valuation ? `${valuation.toLocaleString()}` : '-'}</span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-300 text-sm font-medium">Risk Score:</span>
            <span className="text-accent font-semibold">{riskScore !== undefined ? riskScore : '-'}</span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-300 text-sm font-medium">Compliance:</span>
            <span className={`font-semibold flex items-center gap-1 ${complianceStatus === 'Pass' ? 'text-green-600' : complianceStatus === 'Fail' ? 'text-red-600' : 'text-gray-600'}`}>
              <ShieldCheckIcon className="h-5 w-5" /> {complianceStatus || '-'}
            </span>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIValuationPanel;
