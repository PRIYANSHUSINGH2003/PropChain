import React, { useState } from 'react';
import { SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Card from '../../components/Card';

interface TokenizationFormProps {
  onSubmit: (data: { name: string; description: string; value: number; owner: string }) => void;
  loading?: boolean;
}

const DEMO_OWNER = "";

const generateRandomAddress = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * 16)];
  }
  return address;
};

const TokenizationForm: React.FC<TokenizationFormProps> = ({ onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [owner, setOwner] = useState(DEMO_OWNER);
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [valuation, setValuation] = useState<number | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [compliance, setCompliance] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAIAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError(null);
    setValuation(null);
    setRiskScore(null);
    setCompliance(null);
    try {
      // AI Valuation
      const valRes = await fetch('http://localhost:4000/api/ai/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyDetails: { name, description, value } }),
      });
      const valData = await valRes.json();
      setValuation(valData.valuation);
      setRiskScore(valData.riskScore);
      // Compliance
      const compRes = await fetch('http://localhost:4000/api/ai/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, value }),
      });
      const compData = await compRes.json();
      setCompliance(compData.compliant ? 'Pass' : 'Fail');
    } catch (err) {
      setAiError('AI analysis failed.');
    }
    setAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !value || !owner) return;
    if (compliance !== 'Pass') return;
    onSubmit({ name, description, value: parseFloat(value), owner });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto animate-fade-in bg-glass dark:bg-darkglass shadow-glass rounded-2xl p-8 backdrop-blur-xs border border-softgray dark:border-gray-800"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
          <SparklesIcon className="h-7 w-7 text-primary animate-pulse" />
        </span>
        <h2 className="text-2xl font-extrabold text-primary dark:text-primary-light tracking-tight font-display">
          Tokenize a Property
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5">
        <Input
          label="Property Name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="mb-0"
        />
        <Input
          label="Description"
          as="textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="h-28 resize-none"
        />
        <Input
          label="Valuation (USD)"
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          min="0"
          required
        />
        <div className="relative">
          <Input
            label="Owner Address"
            type="text"
            value={owner}
            onChange={e => setOwner(e.target.value)}
            required
            className="pr-52"
            placeholder="Enter your wallet address (not property name)"
          />
          <button
            type="button"
            onClick={() => setOwner(generateRandomAddress())}
            className="absolute right-[4rem] top-7 text-xs bg-primary text-white px-3 py-1 rounded shadow-card hover:bg-primary-dark transition-colors font-semibold"
            tabIndex={-1}
          >
            Generate
          </button>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(owner);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className="absolute right-2 top-7 text-xs bg-secondary text-white px-3 py-1 rounded shadow-card hover:bg-secondary-dark transition-colors font-semibold"
            tabIndex={-1}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <div className="text-xs text-primary font-semibold mt-2">
            Wallet Address
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-3 mb-6">
        Enter your wallet address. This will be used to view and manage your property in the dashboard.
      </div>
      <Button
        type="button"
        variant="secondary"
        size="md"
        loading={aiLoading}
        className="w-full shadow-card font-bold text-base mb-4"
        onClick={handleAIAnalyze}
        disabled={aiLoading || !name || !description || !value}
      >
        Run AI Valuation & Compliance
      </Button>
      {(valuation !== null || riskScore !== null || compliance !== null) && (
        <Card glass className="p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="h-5 w-5 text-primary animate-pulse" />
            <span className="font-bold text-primary-dark dark:text-primary-light">AI Valuation & Compliance Results</span>
          </div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-gray-500 text-sm">Valuation:</span>
            <span className="text-primary-dark font-bold">{typeof valuation === 'number' && !isNaN(valuation) ? `${valuation.toLocaleString()}` : '-'}</span>
          </div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-gray-500 text-sm">Risk Score:</span>
            <span className="text-accent font-semibold">{riskScore !== null ? riskScore : '-'}</span>
          </div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-gray-500 text-sm">Compliance:</span>
            <span className={`font-semibold flex items-center gap-1 ${compliance === 'Pass' ? 'text-green-600' : compliance === 'Fail' ? 'text-red-600' : 'text-gray-600'}`}>
              <ShieldCheckIcon className="h-4 w-4" /> {compliance || '-'}
            </span>
          </div>
        </Card>
      )}
      {aiError && <Alert type="error" className="mb-4">{aiError}</Alert>}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full shadow-card font-bold text-lg"
        disabled={compliance !== 'Pass' || aiLoading}
      >
        Tokenize Property
      </Button>
      {compliance !== 'Pass' && compliance && (
        <Alert type="warning" className="mt-4">Property must pass compliance to be tokenized.</Alert>
      )}
    </form>
  );
};

export default TokenizationForm;
