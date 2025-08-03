import React, { useState } from 'react';

type TokenizeFormProps = {
  onSuccess: (result: string) => void;
};

export default function TokenizeForm({ onSuccess }: TokenizeFormProps) {
  const [form, setForm] = useState({ name: '', description: '', owner: '', value: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:4000/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    onSuccess(data.message + (data.tokenId ? ` (Token ID: ${data.tokenId})` : ''));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
      <input name="name" placeholder="Property Name" value={form.name} onChange={handleChange} required className="input input-bordered" />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="input input-bordered h-24" />
      <input name="owner" placeholder="Owner Address" value={form.owner} onChange={handleChange} required className="input input-bordered" />
      <input name="value" placeholder="Value (USD)" value={form.value} onChange={handleChange} required type="number" className="input input-bordered" />
      <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all" disabled={loading}>
        {loading ? 'Tokenizing...' : 'Tokenize'}
      </button>
    </form>
  );
}
