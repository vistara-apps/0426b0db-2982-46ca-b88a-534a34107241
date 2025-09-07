'use client';

import { useState, useEffect } from 'react';
import { useWalletClient } from 'wagmi';
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { createPaymentService, PREMIUM_FEATURES } from '@/lib/payment';
import { PaymentRequest, PaymentResult, PremiumFeature } from '@/lib/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: PremiumFeature;
  onPaymentSuccess: (transactionHash: string) => void;
}

export function PaymentModal({ isOpen, onClose, feature, onPaymentSuccess }: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [confirmations, setConfirmations] = useState<number>(0);
  
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (isOpen && walletClient?.account) {
      loadUSDCBalance();
    }
  }, [isOpen, walletClient]);

  const loadUSDCBalance = async () => {
    if (!walletClient?.account) return;
    
    try {
      const paymentService = createPaymentService(walletClient);
      const balance = await paymentService.getUSDCBalance(walletClient.account.address);
      setUsdcBalance(balance);
    } catch (error) {
      console.error('Failed to load USDC balance:', error);
    }
  };

  const handlePayment = async () => {
    if (!walletClient?.account) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const paymentService = createPaymentService(walletClient);
      
      // Create payment request
      const paymentRequest: PaymentRequest = {
        amount: feature.price,
        recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Replace with actual recipient
        description: `HealthSync Premium: ${feature.name}`,
        metadata: {
          featureId: feature.id,
          userId: 'demo-user', // In production, get from auth
          timestamp: Date.now(),
        },
      };

      // Process payment through x402
      const result: PaymentResult = await paymentService.initializePayment(paymentRequest);

      if (result.success && result.transactionHash) {
        setTransactionHash(result.transactionHash);
        setPaymentStatus('success');
        
        // Monitor transaction confirmations
        monitorTransactionConfirmations(paymentService, result.transactionHash);
        
        // Notify parent component
        onPaymentSuccess(result.transactionHash);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'Payment processing failed');
      setPaymentStatus('error');
    }
  };

  const monitorTransactionConfirmations = async (paymentService: any, hash: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Monitor for up to 1 minute
    
    const checkStatus = async () => {
      try {
        const status = await paymentService.checkPaymentStatus(hash);
        setConfirmations(status.confirmations);
        
        if (status.confirmed && status.confirmations >= 1) {
          return; // Transaction confirmed
        }
        
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 2000); // Check every 2 seconds
        }
      } catch (error) {
        console.error('Error monitoring transaction:', error);
      }
    };
    
    checkStatus();
  };

  const resetModal = () => {
    setPaymentStatus('idle');
    setTransactionHash('');
    setErrorMessage('');
    setConfirmations(0);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
          <p className="text-gray-600">Unlock {feature.name} with USDC on Base</p>
        </div>

        {/* Feature Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{feature.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">${feature.price} USDC</span>
            <span className="text-sm text-gray-500">One-time payment</span>
          </div>
        </div>

        {/* Wallet Info */}
        {walletClient?.account && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Your USDC Balance:</span>
              <span className="font-semibold text-gray-900">{usdcBalance} USDC</span>
            </div>
            <div className="text-xs text-gray-500">
              Connected: {walletClient.account.address.slice(0, 6)}...{walletClient.account.address.slice(-4)}
            </div>
          </div>
        )}

        {/* Payment Status */}
        {paymentStatus === 'processing' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 text-yellow-600 animate-spin mr-3" />
              <div>
                <p className="font-medium text-yellow-800">Processing Payment</p>
                <p className="text-sm text-yellow-600">Please confirm the transaction in your wallet</p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium text-green-800">Payment Successful!</p>
                <p className="text-sm text-green-600">
                  Transaction confirmed ({confirmations} confirmations)
                </p>
                {transactionHash && (
                  <a
                    href={`https://basescan.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View on BaseScan
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <p className="font-medium text-red-800">Payment Failed</p>
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          {paymentStatus === 'idle' || paymentStatus === 'error' ? (
            <button
              onClick={handlePayment}
              disabled={!walletClient?.account || parseFloat(usdcBalance) < parseFloat(feature.price)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {!walletClient?.account ? 'Connect Wallet' : 'Pay with USDC'}
            </button>
          ) : paymentStatus === 'success' ? (
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Processing...
            </button>
          )}
        </div>

        {/* Payment Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Payments are processed securely on Base network using USDC
          </p>
        </div>
      </div>
    </div>
  );
}
