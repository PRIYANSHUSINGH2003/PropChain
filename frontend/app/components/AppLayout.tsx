'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/tokenize', label: 'Tokenize' },
  { href: '/ai', label: 'AI Tools' },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/10 via-secondary/10 to-white dark:from-gray-900 dark:via-primary-dark/20 dark:to-gray-950 overflow-x-hidden">
      {/* Animated Gradient Background Accent */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[100vw] h-[50vw] bg-gradient-to-tr from-primary/40 via-secondary/30 to-accent/20 rounded-full blur-3xl opacity-60 animate-fade-in" />
      </div>
      {/* Glassy Sticky Navbar */}
      <nav className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 sticky top-0 z-30 shadow-xl border-b border-primary/10 dark:border-primary-dark/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated SVG Logo */}
            <svg className="h-10 w-10 text-primary animate-spin-slow drop-shadow-lg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" opacity="0.2" />
              <path d="M16 2 A14 14 0 0 1 30 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <Link
              href="/"
              aria-label="Go to homepage"
              className="text-3xl font-extrabold font-display text-primary dark:text-primary-light tracking-tight drop-shadow cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              PropChain
            </Link>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-2 md:gap-6 items-center">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl font-semibold transition-all text-base shadow-sm hover:bg-primary/10 dark:hover:bg-primary-dark/20 hover:text-primary dark:hover:text-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  pathname === link.href
                    ? 'bg-primary text-white dark:bg-primary-dark dark:text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute left-1/2 -bottom-1 w-2/3 h-1 bg-gradient-to-r from-primary to-secondary rounded-full -translate-x-1/2 animate-fade-in" />
                )}
              </Link>
            ))}
            {/* Dark mode toggle */}
            <button
              aria-label="Toggle dark mode"
              className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-colors shadow"
              onClick={() => setDark(d => !d)}
            >
              {dark ? (
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71-.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M6.34 6.34l-.71-.71" /></svg>
              ) : (
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
              )}
            </button>
          </div>
          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-colors shadow"
              onClick={() => setMenuOpen(m => !m)}
            >
              {menuOpen ? (
                <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-gray-900/95 shadow-lg border-b border-primary/10 dark:border-primary-dark/20 animate-fade-in z-40">
          <div className="flex flex-col gap-2 py-4 px-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl font-semibold transition-all text-lg shadow-sm hover:bg-primary/10 dark:hover:bg-primary-dark/20 hover:text-primary dark:hover:text-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  pathname === link.href
                    ? 'bg-primary text-white dark:bg-primary-dark dark:text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              aria-label="Toggle dark mode"
              className="mt-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-colors shadow self-start"
              onClick={() => setDark(d => !d)}
            >
              {dark ? (
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71-.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M6.34 6.34l-.71-.71" /></svg>
              ) : (
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
              )}
            </button>
          </div>
        </div>
      )}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-10 md:py-14">
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 border-t border-primary/10 dark:border-primary-dark/20 py-8 shadow-inner mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">© {new Date().getFullYear()} PropChain. All rights reserved.</div>
          <div className="flex gap-4 text-sm">
            <Link href="/dashboard" className="hover:text-primary dark:hover:text-primary-light transition-colors">Dashboard</Link>
            <Link href="/marketplace" className="hover:text-primary dark:hover:text-primary-light transition-colors">Marketplace</Link>
            <Link href="/tokenize" className="hover:text-primary dark:hover:text-primary-light transition-colors">Tokenize</Link>
            <Link href="/ai" className="hover:text-primary dark:hover:text-primary-light transition-colors">AI Tools</Link>
          </div>
          <div className="flex gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter" className="hover:text-primary transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0016.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 01-2.237-.616c-.054 1.997 1.397 3.872 3.448 4.29a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0024 4.557z" /></svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub" className="hover:text-primary transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C21.138 20.2 24 16.448 24 12.021 24 6.484 19.523 2 12 2z" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
