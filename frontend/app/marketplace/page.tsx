'use client'
import React, { useEffect, useState } from 'react';
import MarketplaceTable from '../components/MarketplaceTable';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import Toast, { ToastType } from '../../components/Toast';

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [buyer, setBuyer] = useState('');
  const [buyResult, setBuyResult] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: ToastType } | null>(null);

  // Fetch listings and properties, and refresh on event
  useEffect(() => {
    const fetchAll = () => {
      fetch('http://localhost:4000/api/marketplace/listings')
        .then(res => res.json())
        .then(setListings);
      fetch('http://localhost:4000/api/properties')
        .then(res => res.json())
        .then(setProperties);
    };
    fetchAll();
    const handler = () => fetchAll();
    window.addEventListener('refresh-marketplace-listings', handler);
    return () => window.removeEventListener('refresh-marketplace-listings', handler);
  }, []);

  const getPropertyName = (tokenId: number) => {
    const prop = properties.find((p: any) => p.tokenId === tokenId);
    return prop ? prop.name : `Property #${tokenId}`;
  };

  const handleBuy = async (listingId: number, share: number) => {
    if (!buyer) {
      setBuyResult('Please enter your address to buy.');
      setToast({ message: 'Please enter your address to buy.', type: 'error' });
      return;
    }
    setBuyingId(listingId);
    const res = await fetch('http://localhost:4000/api/marketplace/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, buyer }),
    });
    const data = await res.json();
    let resultMsg = data.message;
    let toastType: ToastType = 'success';
    if (data.revenueDistribution && data.revenueDistribution.distributed) {
      resultMsg += ` | Revenue distributed: ` + data.revenueDistribution.distributions.map((d: any) => `${d.owner.slice(0,6)}...: ${d.amount.toFixed(2)}`).join(', ');
      // Store revenue events in localStorage for each owner
      if (typeof window !== 'undefined') {
        let txs = [];
        try {
          txs = JSON.parse(localStorage.getItem('propchain_transactions') || '[]');
        } catch {}
        const now = new Date().toISOString();
        data.revenueDistribution.distributions.forEach((d: any) => {
          txs.push({ type: 'revenue', owner: d.owner, amount: d.amount, date: now, property: data.result?.property?.name || '' });
        });
        localStorage.setItem('propchain_transactions', JSON.stringify(txs));
      }
    }
    if (!data.result) toastType = 'error';
    setBuyResult(resultMsg);
    setToast({ message: resultMsg, type: toastType });
    setBuyingId(null);
  };

  const tableListings = listings.map((l: any) => ({
    ...l,
    propertyName: getPropertyName(l.tokenId),
  }));

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-4xl mx-auto mt-10 p-2 md:p-6">
        <Card glass className="p-6 md:p-10">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">Marketplace</h2>
          <Input
            label="Your Address"
            placeholder="Enter your wallet address"
            value={buyer}
            onChange={e => setBuyer(e.target.value)}
            className="mb-6"
          />
          <MarketplaceTable listings={tableListings} onBuy={handleBuy} buyingId={buyingId || undefined} />
          {buyResult && (
            <Alert type={buyResult.includes('success') ? 'success' : 'info'} className="mt-6 text-center">{buyResult}</Alert>
          )}
        </Card>
      </div>
    </>
  );
}
