'use client';

import { useState, useEffect } from 'react';
import { Activity, Bell, FileText, Share2, Menu, X, Crown } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name } from '@coinbase/onchainkit/identity';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'symptoms', label: 'Symptoms', icon: Activity },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'records', label: 'Records', icon: FileText },
  { id: 'summary', label: 'Summary', icon: Share2 },
  { id: 'premium', label: 'Premium', icon: Crown },
];

export function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="glass-card border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center animate-glow">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-textPrimary">HealthSync</h1>
                <p className="text-xs text-textSecondary">Your Health Assistant</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-textSecondary hover:text-textPrimary hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              <Wallet>
                <ConnectWallet className="btn-primary">
                  <Name />
                </ConnectWallet>
              </Wallet>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-textPrimary" />
                ) : (
                  <Menu className="w-6 h-6 text-textPrimary" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-white/90 backdrop-blur-sm">
            <div className="px-4 py-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-textSecondary hover:text-textPrimary hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-textSecondary">
            <p className="text-sm">
              HealthSync - Powered by Base • Your health data stays private and secure
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
