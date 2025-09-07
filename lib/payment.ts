'use client';

import { X402Client } from 'x402-axios';
import { parseUnits, formatUnits } from 'viem';
import { base } from 'wagmi/chains';
import { PaymentRequest, PaymentResult } from './types';

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// X402 configuration
const X402_CONFIG = {
  baseURL: 'https://api.x402.com', // Replace with actual X402 API endpoint
  timeout: 30000,
  retries: 3,
};

export class PaymentService {
  private x402Client: X402Client;
  private walletClient: any;

  constructor(walletClient: any) {
    this.walletClient = walletClient;
    this.x402Client = new X402Client(X402_CONFIG);
  }

  /**
   * Initialize payment flow using x402-axios
   */
  async initializePayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected');
      }

      // Validate payment request
      this.validatePaymentRequest(request);

      // Convert amount to wei (USDC has 6 decimals)
      const amountInWei = parseUnits(request.amount, 6);

      // Create x402 payment request
      const x402Request = {
        method: 'POST',
        url: '/payments/usdc',
        data: {
          amount: amountInWei.toString(),
          recipient: request.recipient,
          token: USDC_CONTRACT_ADDRESS,
          chain: base.id,
          description: request.description,
          metadata: request.metadata,
        },
        headers: {
          'Content-Type': 'application/json',
          'X-Chain-ID': base.id.toString(),
        },
      };

      // Execute payment through x402
      const response = await this.x402Client.request(x402Request);

      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          transactionHash: response.data.transactionHash,
          receipt: response.data.receipt,
        };
      } else {
        throw new Error(response.data.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed',
      };
    }
  }

  /**
   * Process USDC payment on Base network
   */
  async processUSDCPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected');
      }

      const account = this.walletClient.account;
      if (!account) {
        throw new Error('No account connected');
      }

      // Convert amount to proper units (USDC has 6 decimals)
      const amountInWei = parseUnits(request.amount, 6);

      // Prepare transaction data for USDC transfer
      const transactionData = {
        to: USDC_CONTRACT_ADDRESS as `0x${string}`,
        data: this.encodeUSDCTransfer(request.recipient, amountInWei),
        account: account.address,
        chain: base,
      };

      // Send transaction through wallet
      const hash = await this.walletClient.sendTransaction(transactionData);

      // Wait for transaction confirmation
      const receipt = await this.waitForTransactionConfirmation(hash);

      return {
        success: true,
        transactionHash: hash,
        receipt,
      };
    } catch (error: any) {
      console.error('USDC payment failed:', error);
      return {
        success: false,
        error: error.message || 'USDC payment failed',
      };
    }
  }

  /**
   * Check payment status and confirmations
   */
  async checkPaymentStatus(transactionHash: string): Promise<{
    confirmed: boolean;
    confirmations: number;
    receipt?: any;
  }> {
    try {
      // Use x402 to check transaction status
      const response = await this.x402Client.request({
        method: 'GET',
        url: `/payments/status/${transactionHash}`,
        headers: {
          'X-Chain-ID': base.id.toString(),
        },
      });

      return {
        confirmed: response.data.confirmed || false,
        confirmations: response.data.confirmations || 0,
        receipt: response.data.receipt,
      };
    } catch (error) {
      console.error('Failed to check payment status:', error);
      return {
        confirmed: false,
        confirmations: 0,
      };
    }
  }

  /**
   * Get user's USDC balance
   */
  async getUSDCBalance(address: string): Promise<string> {
    try {
      const response = await this.x402Client.request({
        method: 'GET',
        url: `/balances/usdc/${address}`,
        headers: {
          'X-Chain-ID': base.id.toString(),
        },
      });

      // Convert from wei to USDC (6 decimals)
      const balance = formatUnits(BigInt(response.data.balance || '0'), 6);
      return balance;
    } catch (error) {
      console.error('Failed to get USDC balance:', error);
      return '0';
    }
  }

  /**
   * Handle payment errors with retry logic
   */
  async handlePaymentError(error: any, request: PaymentRequest, retryCount = 0): Promise<PaymentResult> {
    const maxRetries = 3;
    
    if (retryCount < maxRetries) {
      console.log(`Retrying payment (attempt ${retryCount + 1}/${maxRetries})`);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      
      return this.initializePayment(request);
    }

    return {
      success: false,
      error: `Payment failed after ${maxRetries} attempts: ${error.message}`,
    };
  }

  /**
   * Validate payment request
   */
  private validatePaymentRequest(request: PaymentRequest): void {
    if (!request.amount || parseFloat(request.amount) <= 0) {
      throw new Error('Invalid payment amount');
    }

    if (!request.recipient || !request.recipient.startsWith('0x')) {
      throw new Error('Invalid recipient address');
    }

    if (!request.description) {
      throw new Error('Payment description is required');
    }
  }

  /**
   * Encode USDC transfer function call
   */
  private encodeUSDCTransfer(to: string, amount: bigint): `0x${string}` {
    // ERC20 transfer function signature: transfer(address,uint256)
    const functionSignature = '0xa9059cbb';
    const paddedTo = to.slice(2).padStart(64, '0');
    const paddedAmount = amount.toString(16).padStart(64, '0');
    
    return `${functionSignature}${paddedTo}${paddedAmount}` as `0x${string}`;
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForTransactionConfirmation(hash: string, maxWait = 60000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      try {
        const status = await this.checkPaymentStatus(hash);
        if (status.confirmed && status.confirmations >= 1) {
          return status.receipt;
        }
        
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error checking transaction status:', error);
      }
    }
    
    throw new Error('Transaction confirmation timeout');
  }
}

/**
 * Create payment service instance with wallet client
 */
export function createPaymentService(walletClient: any): PaymentService {
  return new PaymentService(walletClient);
}

/**
 * Premium features configuration
 */
export const PREMIUM_FEATURES = {
  AI_INSIGHTS: {
    id: 'ai_insights',
    name: 'AI Health Insights',
    description: 'Get personalized health insights powered by AI',
    price: '2.99',
    enabled: false,
  },
  ADVANCED_ANALYTICS: {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Detailed health trends and predictive analytics',
    price: '4.99',
    enabled: false,
  },
  TELEMEDICINE: {
    id: 'telemedicine',
    name: 'Telemedicine Integration',
    description: 'Connect with healthcare providers directly',
    price: '9.99',
    enabled: false,
  },
  PREMIUM_STORAGE: {
    id: 'premium_storage',
    name: 'Premium Storage',
    description: 'Unlimited health record storage',
    price: '1.99',
    enabled: false,
  },
} as const;
