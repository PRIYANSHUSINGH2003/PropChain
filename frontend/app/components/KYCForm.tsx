import React, { useState } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Toast, { ToastType } from '../../components/Toast';

interface KYCFormProps {
  onSuccess: (user: any) => void;
}

const KYCForm: React.FC<KYCFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'owner' | 'investor' | ''>('');
  const [doc, setDoc] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: ToastType } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Simulate KYC API call
    setTimeout(() => {
      setLoading(false);
      if (name && email && address && role && doc) {
        setToast({ message: 'KYC submitted successfully!', type: 'success' });
        onSuccess({ name, email, address, role });
      } else {
        setError('All fields are required, including document upload.');
        setToast({ message: 'All fields are required, including document upload.', type: 'error' });
      }
    }, 1200);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Card glass className="max-w-md mx-auto mt-10 p-8">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">KYC & Registration</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Wallet Address" value={address} onChange={e => setAddress(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full rounded-lg border border-primary/30 p-2 bg-white dark:bg-gray-900"
              value={role}
              onChange={e => setRole(e.target.value as 'owner' | 'investor' | '')}
              required
            >
              <option value="">Select Role</option>
              <option value="owner">Property Owner</option>
              <option value="investor">Investor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload ID/Document</label>
            <input
              type="file"
              accept="image/*,.pdf"
              className="w-full rounded-lg border border-primary/30 p-2 bg-white dark:bg-gray-900"
              onChange={e => setDoc(e.target.files?.[0] || null)}
              required
            />
          </div>
          <Button type="submit" variant="primary" loading={loading}>Submit KYC</Button>
          {error && <Alert type="error">{error}</Alert>}
        </form>
      </Card>
    </>
  );
};

export default KYCForm;
