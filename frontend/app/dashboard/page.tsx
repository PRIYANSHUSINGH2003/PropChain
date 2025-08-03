'use client'
import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import DashboardStats from '../components/DashboardStats';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Toast, { ToastType } from '../../components/Toast';
import { BellIcon } from '@heroicons/react/24/outline';
  // UI Enhancement: Animated Skeleton Loader
import SkeletonCard from '../../components/SkeletonCard';

export default function DashboardPage() {
  const [address, setAddress] = useState('');
  const [properties, setProperties] = useState<any[]>([]);

  // Listen for property refresh events
  React.useEffect(() => {
    const handler = (e: any) => {
      setProperties(e.detail);
    };
    window.addEventListener('refresh-properties', handler);
    return () => window.removeEventListener('refresh-properties', handler);
  }, []);
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [toast, setToast] = useState<{ message: React.ReactNode; type?: ToastType } | null>(null);
  const [notifications, setNotifications] = useState<{ message: React.ReactNode; type?: ToastType; time: string }[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const n = localStorage.getItem('propchain_notifications');
        if (n) return JSON.parse(n);
      } catch {}
    }
    return [];
  });
  const [showNotif, setShowNotif] = useState(false);

  // Listen for "view-property-details" event to open details modal
  React.useEffect(() => {
    const handler = (e: any) => {
      setSelectedProperty(e.detail);
    };
    window.addEventListener('view-property-details', handler);
    return () => window.removeEventListener('view-property-details', handler);
  }, []);
  const [price, setPrice] = useState('');
  const [share, setShare] = useState('');
  const [listResult, setListResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [revenue, setRevenue] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data));
    // Load transaction history from localStorage (simulate)
    if (typeof window !== 'undefined') {
      const txs = localStorage.getItem('propchain_transactions');
      if (txs) setTransactions(JSON.parse(txs));
    }
    // Listen for revenue events in localStorage
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && address) {
        const txs = localStorage.getItem('propchain_transactions');
        if (txs) {
          const txArr = JSON.parse(txs);
          // Only notify for new revenue events
          const notifiedIds = JSON.parse(localStorage.getItem('propchain_revenue_notified') || '[]');
          txArr.forEach((tx: any, idx: number) => {
            if (tx.type === 'revenue' && tx.owner === address && !notifiedIds.includes(tx.date)) {
              setToast({ message: `You received ${tx.amount.toFixed(2)} revenue from ${tx.property || 'a property'}`, type: 'success' });
              notifiedIds.push(tx.date);
            }
          });
          localStorage.setItem('propchain_revenue_notified', JSON.stringify(notifiedIds));
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [address]);

  // Portfolio value change indicator
  const [portfolioChange, setPortfolioChange] = useState<{ change: number, percent: number, up: boolean } | null>(null);

  useEffect(() => {
    if (address) {
      // Find all properties where user owns a share
      const filtered = properties.filter((p: any) =>
        p.owners && Array.isArray(p.owners) && p.owners.some((o: any) => o.owner === address)
      );
      setUserProperties(filtered);
      // Calculate stats
      let totalValue = 0;
      let totalShare = 0;
      filtered.forEach((p: any) => {
        const userShare = p.owners.find((o: any) => o.owner === address)?.share || 0;
        totalValue += p.value * userShare;
        totalShare += userShare;
      });
      // Portfolio value change logic
      let lastValue = 0;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('propchain_last_portfolio_value_' + address);
        if (stored) lastValue = parseFloat(stored);
        localStorage.setItem('propchain_last_portfolio_value_' + address, totalValue.toString());
      }
      let change = totalValue - lastValue;
      let percent = lastValue ? (change / lastValue) * 100 : 0;
      setPortfolioChange(lastValue ? { change, percent, up: change >= 0 } : null);
      setStats([
        { label: 'Properties Owned', value: filtered.length },
        { label: 'Total Portfolio Value', value: `${totalValue.toLocaleString()}` },
        { label: 'Total Shares', value: (totalShare * 100).toFixed(2) + '%' },
      ]);
      // Calculate revenue (simulate from transactions)
      if (transactions.length > 0) {
        const userRevenue = transactions
          .filter((tx: any) => tx.type === 'revenue' && tx.owner === address)
          .reduce((sum: number, tx: any) => sum + tx.amount, 0);
        setRevenue(userRevenue);
      }
    } else {
      setUserProperties([]);
      setStats([]);
      setRevenue(0);
      setPortfolioChange(null);
    }
  }, [address, properties, transactions]);

  const openListModal = (property: any) => {
    setSelectedProperty(property);
    setShowModal(true);
    setPrice('');
    setShare('');
    setListResult(null);
  };

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !price || !share || !address) return;
    setLoading(true);
    setListResult(null);
    const res = await fetch('http://localhost:4000/api/marketplace/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenId: selectedProperty.tokenId,
        price: parseFloat(price),
        seller: address,
        share: parseFloat(share),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.listing) {
      setListResult('Property listed for sale!');
      setShowModal(false);
      // Refresh properties to reflect new listing
      fetch('http://localhost:4000/api/properties')
        .then(res => res.json())
        .then(data => setProperties(data));
      // Add to transaction history (simulate)
      const tx = { type: 'list', property: selectedProperty.name, price: parseFloat(price), share: parseFloat(share), date: new Date().toISOString(), owner: address };
      const txs = [...transactions, tx];
      setTransactions(txs);
      if (typeof window !== 'undefined') localStorage.setItem('propchain_transactions', JSON.stringify(txs));
    } else {
      setListResult(data.message || 'Failed to list property.');
    }
  };

  // Compliance failure notification logic
  const complianceNotified = React.useRef<{ [tokenId: string]: boolean }>({});

  // Patch PortfolioWithAnalytics to notify on compliance fail
  function PortfolioWithAnalyticsWithComplianceToast(props: any) {
    const [analytics, setAnalytics] = React.useState<any>({});
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
      if (!props.userProperties.length) return;
      setLoading(true);
      setError(null);
      const fetchAll = async () => {
        const result: any = {};
        try {
          await Promise.all(props.userProperties.map(async (property: any) => {
            const valRes = await fetch('http://localhost:4000/api/ai/valuation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ propertyDetails: property }),
            });
            const valData = await valRes.json();
            const compRes = await fetch('http://localhost:4000/api/ai/compliance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ propertyDetails: property }),
            });
            const compData = await compRes.json();
            result[property.tokenId] = {
              valuation: valData.valuation,
              risk: valData.riskScore,
              compliance: compData.compliance,
            };
            // Notify on compliance fail (once per session)
            if (
              compData.compliance === 'Fail' &&
              !complianceNotified.current[property.tokenId]
            ) {
              const notif = {
                message: (
                  <span>
                    Compliance check failed for <b>{property.name}</b>.&nbsp;
                    <button
                      className="underline text-primary hover:text-primary-dark"
                      onClick={() => window.dispatchEvent(new CustomEvent('view-property-details', { detail: property }))}
                    >
                      Review Property
                    </button>
                    &nbsp;|&nbsp;
                    <a
                      href={`mailto:support@propchain.com?subject=Compliance%20Support%20for%20${encodeURIComponent(property.name)}`}
                      className="underline text-primary hover:text-primary-dark"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contact Support
                    </a>
                  </span>
                ),
                type: 'error' as ToastType,
                time: new Date().toLocaleString(),
              };
              setToast({ message: notif.message, type: notif.type });
              setNotifications((prev: typeof notifications) => {
                const updated = [...prev, notif];
                if (typeof window !== 'undefined') {
                  localStorage.setItem('propchain_notifications', JSON.stringify(updated));
                }
                return updated;
              });
              complianceNotified.current[property.tokenId] = true;
              complianceNotified.current[property.tokenId] = true;
            }
          }));
          setAnalytics(result);
        } catch (e) {
          setError('Failed to fetch AI analytics.');
        }
        setLoading(false);
      };
      fetchAll();
    }, [props.userProperties]);

    if (loading) return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {Array.from({ length: Math.max(1, props.userProperties.length) }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
        <div className="col-span-2 flex justify-center mt-6">
          <span className="text-primary text-lg animate-pulse">Loading your portfolio analytics...</span>
        </div>
      </div>
    );
    if (error) return <div className="text-red-600 text-center my-8">{error}</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {props.userProperties.map((property: any) => {
          const userShare = property.owners.find((o: any) => o.owner === props.address)?.share || 0;
          const ai = analytics[property.tokenId] || {};
          return (
            <Card glass key={property.tokenId} className="relative p-6 flex flex-col gap-2 border-2 border-primary/20 dark:border-primary-dark/30 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-primary-dark dark:text-primary-light">{property.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">Token #{property.tokenId}</span>
              </div>
              <div className="text-gray-500 text-sm mb-2">{property.description}</div>
              <div className="flex flex-wrap gap-4 mb-2">
                <div className="text-sm"><span className="font-bold text-primary">Your Share:</span> {(userShare * 100).toFixed(2)}%</div>
                <div className="text-sm"><span className="font-bold text-primary">Est. Value:</span> ${(property.value * userShare).toLocaleString()}</div>
                <div className="text-sm"><span className="font-bold text-primary">Total Value:</span> ${property.value.toLocaleString()}</div>
              </div>
              {/* Dynamic AI analytics */}
              <div className="flex flex-wrap gap-4 mb-2">
                {ai.valuation === undefined ? (
                  <span className="text-xs text-primary animate-pulse">Loading AI analytics...</span>
                ) : (
                  <>
                    <div className="text-xs text-gray-600">AI Valuation: <span className="text-primary font-bold">${ai.valuation?.toLocaleString() || '-'}</span></div>
                    <div className="text-xs text-gray-600">Risk: <span className="text-accent font-bold">{ai.risk !== undefined ? ai.risk : '-'}</span></div>
                    <div className="text-xs text-gray-600">Compliance: <span className={`font-bold ${ai.compliance === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>{ai.compliance || '-'}</span></div>
                  </>
                )}
              </div>
              <div className="flex gap-2 absolute top-4 right-4 z-10">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => props.openListModal(property)}
                >
                  List for Sale
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.dispatchEvent(new CustomEvent('view-property-details', { detail: property }))}
                >
                  View Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Notification Center Button */}
      <div className="fixed top-6 right-6 z-[101]">
        <button
          className="relative bg-white dark:bg-gray-900 rounded-full p-2 shadow hover:bg-primary/10"
          onClick={() => setShowNotif(v => !v)}
          aria-label="Show notifications"
        >
          <BellIcon className="h-6 w-6 text-primary" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{notifications.length}</span>
          )}
        </button>
      </div>
      {/* Notification Center Modal */}
      {showNotif && (
        <div className="fixed inset-0 z-[102] flex items-center justify-center bg-black/30" onClick={() => setShowNotif(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-primary text-xl" onClick={() => setShowNotif(false)}>&times;</button>
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center justify-between">
              <span>Notifications</span>
              {notifications.length > 0 && (
                <button
                  className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-dark ml-2"
                  onClick={() => {
                    setNotifications([]);
                    if (typeof window !== 'undefined') localStorage.removeItem('propchain_notifications');
                  }}
                >
                  Clear All
                </button>
              )}
            </h3>
            {notifications.length === 0 ? (
              <div className="text-gray-500 text-center">No notifications yet.</div>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {notifications.slice().reverse().map((n, i) => (
                  <li key={i} className="border-b border-primary/10 pb-2">
                    <div className={`font-semibold ${n.type === 'error' ? 'text-red-600' : n.type === 'success' ? 'text-green-600' : 'text-primary'}`}>{n.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto mt-10 p-2 md:p-6">
        <Card glass className="p-6 md:p-10">
          {/* Modern Welcome Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {address ? address.slice(2, 4).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="text-xl font-bold text-primary-dark dark:text-primary-light">Welcome{address ? `, ${address.slice(0, 6)}...${address.slice(-4)}` : ''}!</div>
                <div className="text-xs text-gray-500 mt-1">Track your real estate portfolio, revenue, and analytics below.</div>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-1">
              <div className="text-xs text-gray-400 uppercase font-bold">Portfolio Value</div>
              <div className="text-2xl font-extrabold text-primary-dark dark:text-primary-light">${stats[1]?.value || '0'}</div>
              {portfolioChange && (
                <span className={`text-xs font-bold ${portfolioChange.up ? 'text-green-600' : 'text-red-600'}`}>{portfolioChange.up ? '▲' : '▼'} {Math.abs(portfolioChange.percent).toFixed(2)}%</span>
              )}
            </div>
          </div>
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap gap-4 mb-8">
            <a href="/tokenize" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow-card hover:bg-primary-dark transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Tokenize Property
            </a>
            <a href="/marketplace" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white font-semibold shadow-card hover:bg-secondary-dark transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18" /></svg>
              Go to Marketplace
            </a>
            <a href="/ai" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white font-semibold shadow-card hover:bg-accent-dark transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v-4h-1m-4 0h-1v-4h-1" /></svg>
              AI Valuation
            </a>
          </div>
          <Input
            label="Your Address"
            placeholder="Enter your wallet address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="mb-6"
          />
          {address && stats.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-6 py-12 animate-fade-in">
              <svg className="h-24 w-24 text-primary/30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                <rect x="8" y="16" width="32" height="24" rx="4" className="fill-primary/10" />
                <path d="M8 32l8-8 8 8 8-8 8 8" className="stroke-primary" />
                <circle cx="24" cy="24" r="4" className="fill-accent/30" />
              </svg>
              <div className="text-xl font-bold text-primary-dark dark:text-primary-light">No properties found</div>
              <div className="text-gray-500 text-center max-w-xs">You don’t own any properties yet. Start by tokenizing your first property and building your real estate portfolio.</div>
              <a href="/tokenize" className="px-6 py-2 rounded-xl bg-primary text-white font-semibold shadow-card hover:bg-primary-dark transition-colors">Tokenize Your First Property</a>
            </div>
          )}
          {stats.length > 0 && <DashboardStats stats={stats} portfolioChange={portfolioChange} />}
          {/* Portfolio breakdown with AI analytics */}
          {/* Optimized AI analytics fetching for all properties */}
          <div className="flex justify-end mb-4">
            <DownloadPortfolioReportButton userProperties={userProperties} address={address} />
          </div>
          <PortfolioWithAnalyticsWithComplianceToast userProperties={userProperties} address={address} openListModal={openListModal} />
          <PropertyDetailsModal 
            property={selectedProperty} 
            address={address} 
            open={!!selectedProperty && showModal === false} 
            onClose={() => setSelectedProperty(null)} 
          />
        </Card>
        <Modal open={showModal} onClose={() => setShowModal(false)} title="List Property for Sale">
          <form onSubmit={handleList} className="flex flex-col gap-4">
            <div>
              <div className="font-semibold mb-1">Property: <span className="text-primary">{selectedProperty?.name}</span></div>
              <div className="text-xs text-gray-500 mb-2">Token ID: {selectedProperty?.tokenId}</div>
            </div>
            <Input
              label="Price (USD)"
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
            <Input
              label="Share to Sell (0-1, e.g. 0.5 for 50%)"
              type="number"
              value={share}
              onChange={e => setShare(e.target.value)}
              min="0.01"
              max="1"
              step="0.01"
              required
            />
            <Button type="submit" variant="primary" loading={loading}>
              List Property
            </Button>
            {listResult && <Alert type="info">{listResult}</Alert>}
          </form>
        </Modal>
      {/* Revenue summary */}
        {address && (
          <Card glass className="p-4 mt-6 mb-4">
            <div className="text-lg font-bold text-primary-dark dark:text-primary-light">Total Revenue Received</div>
            <div className="text-2xl font-extrabold text-accent mt-1">${revenue.toLocaleString()}</div>
          </Card>
        )}
      {/* Recent Activity Section */}
        {address && transactions.length > 0 && (
          <Card glass className="p-4 mt-4">
            <div className="text-lg font-bold text-primary-dark dark:text-primary-light mb-2 flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
              Recent Activity
            </div>
            <ul className="divide-y divide-primary/10 dark:divide-primary-dark/20 animate-fade-in">
              {transactions.filter(tx => tx.owner === address).slice(-5).reverse().map((tx, idx) => (
                <li key={idx} className="py-2 text-sm flex items-center gap-3">
                  <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full ${tx.type === 'revenue' ? 'bg-accent/20 text-accent' : tx.type === 'list' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                    {tx.type === 'revenue' ? <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg> : tx.type === 'list' ? <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> : <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>}
                  </span>
                  <span className="font-semibold">
                    {tx.type === 'revenue' ? 'Revenue' : tx.type === 'list' ? 'Listed' : 'Other'}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    {tx.property || ''} {tx.price ? `(${tx.price})` : ''} {tx.share ? `Share: ${(tx.share * 100).toFixed(2)}%` : ''}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(tx.date).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      {/* Transaction history (full) can be added as a separate page or modal if needed */}
      </div>
    </>
  );
}

// Toast notification rendering in DashboardPage
// (Place at the end of the DashboardPage component's return)
// ...
// {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

// Download Portfolio Report Button
function DownloadPortfolioReportButton({ userProperties, address }: { userProperties: any[], address: string }) {
  const [downloading, setDownloading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    setSuccess(null);
    try {
      // Fetch analytics for all properties
      const analytics: any = {};
      await Promise.all(userProperties.map(async (property) => {
        const valRes = await fetch('http://localhost:4000/api/ai/valuation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyDetails: property }),
        });
        const valData = await valRes.json();
        const compRes = await fetch('http://localhost:4000/api/ai/compliance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyDetails: property }),
        });
        const compData = await compRes.json();
        analytics[property.tokenId] = {
          valuation: valData.valuation,
          risk: valData.riskScore,
          compliance: compData.compliance,
        };
      }));
      // Build CSV
      let csv = 'Property,Token ID,Your Share,Est. Value,Total Value,AI Valuation,Risk,Compliance\n';
      userProperties.forEach(property => {
        const userShare = property.owners.find((o: any) => o.owner === address)?.share || 0;
        const ai = analytics[property.tokenId] || {};
        csv += `"${property.name}",${property.tokenId},${(userShare*100).toFixed(2)}%,${(property.value*userShare).toLocaleString()},${property.value.toLocaleString()},${ai.valuation || ''},${ai.risk || ''},${ai.compliance || ''}\n`;
      });
      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'propchain_portfolio.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess('Portfolio report downloaded!');
    } catch (e) {
      setError('Failed to generate report.');
    }
    setDownloading(false);
  };

  return (
    <div>
      <button
        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow-card hover:bg-primary-dark transition-colors disabled:opacity-60"
        onClick={handleDownload}
        disabled={downloading || !userProperties.length}
      >
        {downloading ? 'Generating...' : 'Download Portfolio Report'}
      </button>
      {error && <span className="text-red-600 ml-4">{error}</span>}
      {success && <span className="text-green-600 ml-4">{success}</span>}
    </div>
  );
}

// Property Details Modal
function PropertyDetailsModal({ property, address, open, onClose }: { property: any, address: string, open: boolean, onClose: () => void }) {
  const [ai, setAi] = React.useState<any>({ loading: true });
  React.useEffect(() => {
    if (!property) return;
    let mounted = true;
    async function fetchAI() {
      setAi({ loading: true });
      try {
        const valRes = await fetch('http://localhost:4000/api/ai/valuation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyDetails: property }),
        });
        const valData = await valRes.json();
        const compRes = await fetch('http://localhost:4000/api/ai/compliance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyDetails: property }),
        });
        const compData = await compRes.json();
        if (mounted) setAi({
          valuation: valData.valuation,
          risk: valData.riskScore,
          compliance: compData.compliance,
          loading: false
        });
      } catch {
        if (mounted) setAi({ error: 'AI fetch failed', loading: false });
      }
    }
    fetchAI();
    return () => { mounted = false; };
  }, [property]);
  if (!property || !open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-primary text-xl" onClick={onClose}>&times;</button>
        <div className="mb-4">
          <div className="text-2xl font-bold text-primary-dark dark:text-primary-light mb-1">{property.name}</div>
          <div className="text-xs text-gray-500 mb-2">Token ID: {property.tokenId}</div>
          <div className="text-gray-600 dark:text-gray-300 mb-2">{property.description}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-primary mb-1">AI Analytics</div>
          {ai.loading ? (
            <div className="text-primary animate-pulse">Loading AI analytics...</div>
          ) : ai.error ? (
            <div className="text-red-600">{ai.error}</div>
          ) : (
            <ul className="text-sm space-y-1">
              <li>AI Valuation: <span className="font-bold text-primary">${ai.valuation?.toLocaleString() || '-'}</span></li>
              <li>Risk: <span className="font-bold text-accent">{ai.risk !== undefined ? ai.risk : '-'}</span></li>
              <li>Compliance: <span className={`font-bold ${ai.compliance === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>{ai.compliance || '-'}</span></li>
            </ul>
          )}
        </div>
        <div className="mb-4">
          <div className="font-semibold text-primary mb-1">Ownership Breakdown</div>
          <ul className="text-sm space-y-1">
            {property.owners.map((o: any, i: number) => (
              <li key={i} className={o.owner === address ? 'font-bold text-primary' : ''}>
                {o.owner.slice(0, 6)}...{o.owner.slice(-4)} — {(o.share * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-primary mb-1">List More Shares for Sale</div>
          <ListSharesForm property={property} address={address} onListed={(result, type) => {
            // Refresh properties after listing
            fetch('http://localhost:4000/api/properties')
              .then(res => res.json())
              .then(data => {
                // Update properties and userProperties in parent
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('refresh-properties', { detail: data }));
                  // Also trigger marketplace refresh
                  window.dispatchEvent(new CustomEvent('refresh-marketplace-listings'));
                }
              });
            // setToast({ message: result, type }); // Removed stray setToast call
            onClose();
          }} />
        </div>
        <div className="flex gap-4 justify-end">
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow-card hover:bg-primary-dark transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// List Shares Form
function ListSharesForm({ property, address, onListed }: { property: any, address: string, onListed: (result: string, type: ToastType) => void }) {
  const [share, setShare] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  if (!property) return null;
  const userShare = property.owners.find((o: any) => o.owner === address)?.share || 0;
  const maxShare = userShare;
  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!share || !price || parseFloat(share) > maxShare) {
      setResult('Invalid share or price.');
      onListed('Invalid share or price.', 'error');
      return;
    }
    setLoading(true);
    setResult(null);
    const res = await fetch('http://localhost:4000/api/marketplace/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenId: property.tokenId,
        price: parseFloat(price),
        seller: address,
        share: parseFloat(share),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.listing) {
      setResult('Shares listed for sale!');
      setShare('');
      setPrice('');
      onListed('Shares listed for sale!', 'success');
    } else {
      setResult(data.message || 'Failed to list shares.');
      onListed(data.message || 'Failed to list shares.', 'error');
    }
  };
  return (
    <form onSubmit={handleList} className="flex flex-col gap-2 mt-2">
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min="0.01"
          max={maxShare}
          step="0.01"
          value={share}
          onChange={e => setShare(e.target.value)}
          placeholder="Share (0-1)"
          className="border rounded px-2 py-1 w-24"
          required
        />
        <span className="text-xs text-gray-500">(Max: {maxShare.toFixed(2)})</span>
        <input
          type="number"
          min="1"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Price (USD)"
          className="border rounded px-2 py-1 w-32"
          required
        />
        <button
          type="submit"
          className="bg-secondary text-white px-3 py-1 rounded shadow-card hover:bg-secondary-dark transition-colors font-semibold"
          disabled={loading}
        >
          {loading ? 'Listing...' : 'List'}
        </button>
      </div>
      {result && <div className="text-xs text-primary mt-1">{result}</div>}
    </form>
  );
}

// New component for optimized analytics fetching and rendering
function PortfolioWithAnalytics({ userProperties, address, openListModal }: { userProperties: any[], address: string, openListModal: (property: any) => void }) {
  const [analytics, setAnalytics] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userProperties.length) return;
    setLoading(true);
    setError(null);
    const fetchAll = async () => {
      const result: any = {};
      try {
        await Promise.all(userProperties.map(async (property) => {
          const valRes = await fetch('http://localhost:4000/api/ai/valuation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyDetails: property }),
          });
          const valData = await valRes.json();
          const compRes = await fetch('http://localhost:4000/api/ai/compliance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyDetails: property }),
          });
          const compData = await compRes.json();
          result[property.tokenId] = {
            valuation: valData.valuation,
            risk: valData.riskScore,
            compliance: compData.compliance,
          };
        }));
        setAnalytics(result);
      } catch (e) {
        setError('Failed to fetch AI analytics.');
      }
      setLoading(false);
    };
    fetchAll();
  }, [userProperties]);

  if (loading) return <div className="text-primary text-center my-8 animate-pulse">Loading AI analytics for your portfolio...</div>;
  if (error) return <div className="text-red-600 text-center my-8">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {userProperties.map(property => {
        const userShare = property.owners.find((o: any) => o.owner === address)?.share || 0;
        const ai = analytics[property.tokenId] || {};
        return (
          <Card glass key={property.tokenId} className="relative p-6 flex flex-col gap-2 border-2 border-primary/20 dark:border-primary-dark/30 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-primary-dark dark:text-primary-light">{property.name}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">Token #{property.tokenId}</span>
            </div>
            <div className="text-gray-500 text-sm mb-2">{property.description}</div>
            <div className="flex flex-wrap gap-4 mb-2">
              <div className="text-sm"><span className="font-bold text-primary">Your Share:</span> {(userShare * 100).toFixed(2)}%</div>
              <div className="text-sm"><span className="font-bold text-primary">Est. Value:</span> ${(property.value * userShare).toLocaleString()}</div>
              <div className="text-sm"><span className="font-bold text-primary">Total Value:</span> ${property.value.toLocaleString()}</div>
            </div>
            {/* Dynamic AI analytics */}
            <div className="flex flex-wrap gap-4 mb-2">
              {ai.valuation === undefined ? (
                <span className="text-xs text-primary animate-pulse">Loading AI analytics...</span>
              ) : (
                <>
                  <div className="text-xs text-gray-600">AI Valuation: <span className="text-primary font-bold">${ai.valuation?.toLocaleString() || '-'}</span></div>
                  <div className="text-xs text-gray-600">Risk: <span className="text-accent font-bold">{ai.risk !== undefined ? ai.risk : '-'}</span></div>
                  <div className="text-xs text-gray-600">Compliance: <span className={`font-bold ${ai.compliance === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>{ai.compliance || '-'}</span></div>
                </>
              )}
            </div>
            <div className="flex gap-2 absolute top-4 right-4 z-10">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => openListModal(property)}
              >
                List for Sale
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent('view-property-details', { detail: property }))}
              >
                View Details
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
