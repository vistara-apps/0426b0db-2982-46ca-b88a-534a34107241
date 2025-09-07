/**
 * Test file for x402 payment integration
 * This file contains test functions to verify the payment flow
 */

import { createPaymentService } from './payment';
import { PaymentRequest } from './types';

// Mock wallet client for testing
const mockWalletClient = {
  account: {
    address: '0x1234567890123456789012345678901234567890',
  },
  sendTransaction: async (data: any) => {
    console.log('Mock transaction sent:', data);
    return '0xmocktransactionhash123456789';
  },
};

/**
 * Test the payment service initialization
 */
export async function testPaymentServiceInit() {
  console.log('🧪 Testing Payment Service Initialization...');
  
  try {
    const paymentService = createPaymentService(mockWalletClient);
    console.log('✅ Payment service created successfully');
    return true;
  } catch (error) {
    console.error('❌ Payment service initialization failed:', error);
    return false;
  }
}

/**
 * Test USDC balance retrieval
 */
export async function testUSDCBalance() {
  console.log('🧪 Testing USDC Balance Retrieval...');
  
  try {
    const paymentService = createPaymentService(mockWalletClient);
    const balance = await paymentService.getUSDCBalance(mockWalletClient.account.address);
    console.log('✅ USDC balance retrieved:', balance);
    return true;
  } catch (error) {
    console.error('❌ USDC balance retrieval failed:', error);
    return false;
  }
}

/**
 * Test payment request validation
 */
export async function testPaymentValidation() {
  console.log('🧪 Testing Payment Validation...');
  
  const paymentService = createPaymentService(mockWalletClient);
  
  // Test valid payment request
  const validRequest: PaymentRequest = {
    amount: '2.99',
    recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    description: 'Test payment for AI Insights',
    metadata: { featureId: 'ai_insights' },
  };
  
  try {
    const result = await paymentService.initializePayment(validRequest);
    console.log('✅ Valid payment request processed:', result);
  } catch (error) {
    console.log('⚠️ Payment processing failed (expected in test):', error);
  }
  
  // Test invalid payment request
  const invalidRequest: PaymentRequest = {
    amount: '0',
    recipient: 'invalid-address',
    description: '',
  };
  
  try {
    const result = await paymentService.initializePayment(invalidRequest);
    console.log('❌ Invalid payment should have failed');
    return false;
  } catch (error) {
    console.log('✅ Invalid payment correctly rejected:', error);
    return true;
  }
}

/**
 * Test transaction status checking
 */
export async function testTransactionStatus() {
  console.log('🧪 Testing Transaction Status Check...');
  
  try {
    const paymentService = createPaymentService(mockWalletClient);
    const status = await paymentService.checkPaymentStatus('0xmocktransactionhash');
    console.log('✅ Transaction status checked:', status);
    return true;
  } catch (error) {
    console.error('❌ Transaction status check failed:', error);
    return false;
  }
}

/**
 * Test error handling and retry logic
 */
export async function testErrorHandling() {
  console.log('🧪 Testing Error Handling...');
  
  const paymentService = createPaymentService(mockWalletClient);
  
  const errorRequest: PaymentRequest = {
    amount: '999999999', // Unrealistic amount to trigger error
    recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    description: 'Error test payment',
  };
  
  try {
    const result = await paymentService.handlePaymentError(
      new Error('Insufficient funds'),
      errorRequest,
      0
    );
    console.log('✅ Error handling completed:', result);
    return true;
  } catch (error) {
    console.error('❌ Error handling failed:', error);
    return false;
  }
}

/**
 * Run all payment tests
 */
export async function runAllPaymentTests() {
  console.log('🚀 Starting Payment Integration Tests...\n');
  
  const tests = [
    { name: 'Payment Service Init', test: testPaymentServiceInit },
    { name: 'USDC Balance', test: testUSDCBalance },
    { name: 'Payment Validation', test: testPaymentValidation },
    { name: 'Transaction Status', test: testTransactionStatus },
    { name: 'Error Handling', test: testErrorHandling },
  ];
  
  const results = [];
  
  for (const { name, test } of tests) {
    console.log(`\n--- ${name} ---`);
    const result = await test();
    results.push({ name, passed: result });
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });
  
  const passedCount = results.filter(r => r.passed).length;
  console.log(`\n${passedCount}/${results.length} tests passed`);
  
  return results;
}

// Export test configuration
export const TEST_CONFIG = {
  MOCK_RECIPIENT: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  MOCK_TRANSACTION_HASH: '0xmocktransactionhash123456789',
  TEST_AMOUNTS: ['1.00', '2.99', '4.99', '9.99'],
  USDC_CONTRACT: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};
