import React from 'react';
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  StarIcon,
  UserCircleIcon,
  CheckCircleIcon,
  BoltIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Button from '../components/Button';
import Card from '../components/Card';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-primary/10 via-secondary/10 to-white dark:from-gray-900 dark:via-primary-dark/20 dark:to-gray-950 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-3 pb-20 px-4 md:px-0">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[100vw] h-[50vw] bg-gradient-to-tr from-primary/40 via-secondary/30 to-accent/20 rounded-full blur-3xl opacity-70 animate-fade-in" />
        </div>
        <Card glass className="max-w-3xl w-full mx-auto p-8 md:p-14 border border-primary/20 dark:border-primary-dark/30 shadow-2xl text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary-dark/20 rounded-full text-primary-dark dark:text-primary-light font-semibold text-base shadow animate-fade-in">
              <SparklesIcon className="h-7 w-7 animate-pulse" />
              AI-Driven Real Estate Marketplace
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display text-primary dark:text-primary-light mb-8 drop-shadow-lg tracking-tight animate-fade-in leading-tight">
            Invest in Real Estate, <br className="hidden md:inline" />Powered by AI & Blockchain
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12 animate-fade-in max-w-2xl mx-auto">
            PropChain lets you tokenize, trade, and earn from real-world properties with transparency, liquidity, and AI-driven insights. Join the future of real estate investment.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-4 animate-fade-in">
            <Link href="/tokenize">
              <Button size="lg" variant="primary" className="text-xl font-bold px-10 py-5 group shadow-xl hover:scale-105 transition-transform">
                Tokenize Property <ArrowRightIcon className="h-7 w-7 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="text-xl font-bold px-10 py-5 group shadow-xl hover:scale-105 transition-transform">
                Explore Marketplace <BuildingOffice2Icon className="h-7 w-7 ml-2 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* How It Works Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-10 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card glass className="flex flex-col items-center p-8 group hover:shadow-2xl transition-all">
            <CheckCircleIcon className="h-12 w-12 text-primary mb-3 animate-fade-in" />
            <span className="font-bold text-primary-dark dark:text-primary-light text-xl mb-1">Tokenize</span>
            <span className="text-sm text-gray-500">List your property as a digital asset</span>
          </Card>
          <Card glass className="flex flex-col items-center p-8 group hover:shadow-2xl transition-all">
            <BoltIcon className="h-12 w-12 text-accent mb-3 animate-fade-in" />
            <span className="font-bold text-primary-dark dark:text-primary-light text-xl mb-1">Trade</span>
            <span className="text-sm text-gray-500">Buy, sell, or trade property tokens instantly</span>
          </Card>
          <Card glass className="flex flex-col items-center p-8 group hover:shadow-2xl transition-all">
            <SparklesIcon className="h-12 w-12 text-secondary mb-3 animate-fade-in" />
            <span className="font-bold text-primary-dark dark:text-primary-light text-xl mb-1">Earn</span>
            <span className="text-sm text-gray-500">Receive rental income and AI-powered insights</span>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-10 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card glass className="flex flex-col items-center p-8 group hover:shadow-2xl transition-all">
            <CurrencyDollarIcon className="h-10 w-10 text-accent mb-2 animate-fade-in" />
            <span className="font-bold text-primary-dark dark:text-primary-light text-lg">Fractional Ownership</span>
            <span className="text-xs text-gray-500">Invest with any amount</span>
          </Card>
          <Card glass className="flex flex-col items-center p-8 group hover:shadow-2xl transition-all">
            <SparklesIcon className="h-10 w-10 text-primary mb-2 animate-fade-in" />
            <span className="font-bold text-primary-dark dark:text-primary-light text-lg">AI Valuation</span>
            <span className="text-xs text-gray-500">Smart, data-driven pricing</span>
          </Card>
          <Card glass className="flex flex-col items-center p-8 group hover:shadow-2xl transition-all">
            <ArrowRightIcon className="h-10 w-10 text-secondary mb-2 animate-fade-in" />
            <span className="font-bold text-primary-dark dark:text-primary-light text-lg">Instant Liquidity</span>
            <span className="text-xs text-gray-500">Trade anytime, anywhere</span>
          </Card>
          <Card glass className="flex flex-col items-center p-8 group hover:shadow-2xl transition-all">
            <ScaleIcon className="h-10 w-10 text-primary mb-2 animate-fade-in" />
            <span className="font-bold text-primary-dark dark:text-primary-light text-lg">On-Chain Compliance</span>
            <span className="text-xs text-gray-500">Transparent, auditable, and secure</span>
          </Card>
        </div>
      </section>

      {/* Trust & Social Proof Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-10 md:py-6">
        <div className="flex flex-col md:flex-row gap-8 justify-center animate-fade-in">
          <Card glass className="flex items-center gap-2 px-8 py-4 rounded-xl shadow-lg">
            <ShieldCheckIcon className="h-6 w-6 text-primary" />
            <span className="text-base text-primary-dark dark:text-primary-light font-medium">Audited Smart Contracts</span>
          </Card>
          <Card glass className="flex items-center gap-2 px-8 py-4 rounded-xl shadow-lg">
            <StarIcon className="h-6 w-6 text-accent" />
            <span className="text-base text-primary-dark dark:text-primary-light font-medium">Trusted by 1,000+ users</span>
          </Card>
          <Card glass className="flex items-center gap-2 px-8 py-4 rounded-xl shadow-lg">
            <UserCircleIcon className="h-6 w-6 text-secondary" />
            <span className="text-base text-primary-dark dark:text-primary-light font-medium">24/7 Support</span>
          </Card>
        </div>
      </section>    
    </div>
  );
}
