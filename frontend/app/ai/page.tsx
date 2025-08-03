'use client'
import React, { useState } from 'react';
import AIValuationPanel from '../components/AIValuationPanel';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

export default function AIPage() {
  const [form, setForm] = useState({ name: '', description: '', value: '' });
  const [valuation, setValuation] = useState<number | undefined>(undefined);
  const [riskScore, setRiskScore] = useState<number | undefined>(undefined);
  const [complianceStatus, setComplianceStatus] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/valuation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyDetails: form }),
      });
      const data = await res.json();
      setValuation(data.valuation);
      setRiskScore(data.riskScore);
    } catch (err) {
      setError('Failed to get valuation.');
    }
    setLoading(false);
  };

  const handleCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/compliance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyDetails: form }),
      });
      const data = await res.json();
      setComplianceStatus(data.compliance === 'Pass' ? 'Pass' : 'Fail');
    } catch (err) {
      setError('Failed to check compliance.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-2 md:p-6">
      <Card glass className="p-6 md:p-10">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">AI Tools</h2>
        <form className="flex flex-col gap-4" autoComplete="off">
          <Input
            label="Property Name"
            name="name"
            placeholder="Property Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Description"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            as="textarea"
            className="h-24"
          />
          <Input
            label="Value (USD)"
            name="value"
            placeholder="Value (USD)"
            value={form.value}
            onChange={handleChange}
            type="number"
          />
          <div className="flex gap-4 mt-2">
            <Button onClick={handleValuation} type="submit" variant="primary" loading={loading}>
              Get Valuation
            </Button>
            <Button onClick={handleCompliance} type="button" variant="secondary" loading={loading}>
              Check Compliance
            </Button>
          </div>
        </form>
        {error && <Alert type="error" className="mt-4 text-center">{error}</Alert>}
        {complianceStatus && (
          <Alert type={complianceStatus === 'Pass' ? 'success' : 'warning'} className="mt-4 text-center">
            Compliance: {complianceStatus}
          </Alert>
        )}
        <AIValuationPanel
          valuation={valuation}
          riskScore={riskScore}
          complianceStatus={complianceStatus}
          loading={loading}
        />
      </Card>
    </div>
  );
}
