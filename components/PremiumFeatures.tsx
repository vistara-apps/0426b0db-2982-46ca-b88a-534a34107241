'use client';

import { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Video, 
  Cloud, 
  Star, 
  Lock,
  Zap,
  Crown
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { PREMIUM_FEATURES } from '@/lib/payment';
import { PremiumFeature } from '@/lib/types';

interface PremiumFeaturesProps {
  enabledFeatures: string[];
  onFeatureEnabled: (featureId: string, transactionHash: string) => void;
}

export function PremiumFeatures({ enabledFeatures, onFeatureEnabled }: PremiumFeaturesProps) {
  const [selectedFeature, setSelectedFeature] = useState<PremiumFeature | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getFeatureIcon = (featureId: string) => {
    switch (featureId) {
      case 'ai_insights':
        return <Brain className="w-6 h-6" />;
      case 'advanced_analytics':
        return <TrendingUp className="w-6 h-6" />;
      case 'telemedicine':
        return <Video className="w-6 h-6" />;
      case 'premium_storage':
        return <Cloud className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const handleUpgrade = (feature: PremiumFeature) => {
    setSelectedFeature(feature);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (transactionHash: string) => {
    if (selectedFeature) {
      onFeatureEnabled(selectedFeature.id, transactionHash);
      setShowPaymentModal(false);
      setSelectedFeature(null);
    }
  };

  const features = Object.values(PREMIUM_FEATURES);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Premium Features</h2>
        <p className="text-textSecondary">Unlock advanced health tracking capabilities with USDC payments on Base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const isEnabled = enabledFeatures.includes(feature.id);
          
          return (
            <div
              key={feature.id}
              className={`glass-card p-6 rounded-lg border-2 transition-all duration-200 ${
                isEnabled 
                  ? 'border-green-200 bg-green-50/50' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isEnabled 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                }`}>
                  {isEnabled ? <Star className="w-6 h-6" /> : getFeatureIcon(feature.id)}
                </div>
                
                {isEnabled && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-textPrimary mb-2">{feature.name}</h3>
              <p className="text-textSecondary text-sm mb-4">{feature.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-600">${feature.price}</span>
                  <span className="text-sm text-textSecondary">USDC</span>
                </div>

                {isEnabled ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(feature)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Upgrade</span>
                  </button>
                )}
              </div>

              {/* Feature Preview */}
              {!isEnabled && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Preview available after purchase</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="glass-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Why Choose Premium?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-textPrimary mb-1">Instant Access</h4>
            <p className="text-sm text-textSecondary">Features unlock immediately after payment</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-textPrimary mb-1">One-Time Payment</h4>
            <p className="text-sm text-textSecondary">No subscriptions, pay once and own forever</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-textPrimary mb-1">Secure Payments</h4>
            <p className="text-sm text-textSecondary">USDC payments on Base network</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedFeature && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedFeature(null);
          }}
          feature={selectedFeature}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
