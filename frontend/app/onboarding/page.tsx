"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import KYCForm from '../components/KYCForm';
import Card from '../../components/Card';

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const handleSuccess = (userData: any) => {
    setUser(userData);
    // Store user in localStorage/session (for demo)
    if (typeof window !== 'undefined') {
      localStorage.setItem('propchain_user', JSON.stringify(userData));
    }
    // Redirect to dashboard after KYC
    setTimeout(() => router.push('/dashboard'), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-white dark:from-gray-900 dark:to-gray-950">
      {!user ? (
        <KYCForm onSuccess={handleSuccess} />
      ) : (
        <Card glass className="max-w-md mx-auto mt-10 p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">KYC Complete!</h2>
          <p className="mb-2">Welcome, {user.name}.</p>
          <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
        </Card>
      )}
    </div>
  );
}
