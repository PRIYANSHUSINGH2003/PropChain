'use client'
import React, { useState } from 'react';
import TokenizationForm from '../components/TokenizationForm';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function TokenizePage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: { name: string; description: string; value: number; owner: string }) => {
    setLoading(true);
    setResult(null);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), // Use the actual form data including owner
    });
    const resp = await res.json();
    setResult(resp.message || 'Property tokenized!');
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-2 md:p-6">
      <Card glass className="p-6 md:p-10">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Tokenize Property</h2>
        <TokenizationForm onSubmit={handleSubmit} loading={loading} />
        {result && (
          <Alert type={result.toLowerCase().includes('success') ? 'success' : 'info'} className="mt-6 text-center">{result}</Alert>
        )}
      </Card>
    </div>
  );
}
