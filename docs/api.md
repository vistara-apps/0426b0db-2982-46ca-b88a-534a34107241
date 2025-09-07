# HealthSync API Documentation

## Overview

HealthSync integrates with multiple APIs and services to provide a comprehensive health management experience. This document outlines all API integrations and their usage.

## Table of Contents

1. [Farcaster API](#farcaster-api)
2. [Base Protocol API](#base-protocol-api)
3. [IPFS Storage API](#ipfs-storage-api)
4. [Health Summary Generator](#health-summary-generator)
5. [Local Storage API](#local-storage-api)

---

## Farcaster API

### Overview
Integration with Farcaster for social authentication and health data sharing.

### Base URL
```
https://api.farcaster.xyz
```

### Authentication

#### `authenticateUser(walletAddress: string)`
Authenticates a user with their Base wallet address and creates a Farcaster identity.

**Parameters:**
- `walletAddress` (string): Base wallet address

**Returns:**
```typescript
Promise<User | null>
```

**Example:**
```typescript
const user = await farcasterAPI.authenticateUser('0x1234...5678');
```

### User Profile

#### `getUserProfile(farcasterId: string)`
Retrieves user profile information from Farcaster.

**Parameters:**
- `farcasterId` (string): Farcaster user ID

**Returns:**
```typescript
Promise<{
  fid: string;
  username: string;
  displayName: string;
  pfpUrl: string | null;
  bio: string;
}>
```

### Social Sharing

#### `shareHealthSummary(summary: HealthSummary, castText: string)`
Shares a health summary to Farcaster as a cast.

**Parameters:**
- `summary` (HealthSummary): Generated health summary
- `castText` (string): Text content for the cast

**Returns:**
```typescript
Promise<boolean>
```

**Example:**
```typescript
const success = await farcasterAPI.shareHealthSummary(summary, 
  "📊 My health summary for the last 30 days: 5 symptoms tracked, 3 medications managed!"
);
```

---

## Base Protocol API

### Overview
Integration with Base blockchain for wallet connectivity and on-chain features.

### Network Configuration
- **Chain ID**: 8453 (Base Mainnet)
- **RPC URL**: https://mainnet.base.org

### Wallet Connection

#### `connectWallet()`
Connects to user's Base wallet using MetaMask or Coinbase Wallet.

**Returns:**
```typescript
Promise<string | null>
```

**Example:**
```typescript
const walletAddress = await baseAPI.connectWallet();
```

### Wallet Information

#### `getWalletBalance(address: string)`
Retrieves ETH balance for a given wallet address.

**Parameters:**
- `address` (string): Wallet address

**Returns:**
```typescript
Promise<string>
```

### NFT Operations

#### `createHealthNFT(summary: HealthSummary)`
Mints a health summary as an NFT on Base network.

**Parameters:**
- `summary` (HealthSummary): Health summary to mint

**Returns:**
```typescript
Promise<string | null>
```

**Example:**
```typescript
const nftHash = await baseAPI.createHealthNFT(healthSummary);
```

---

## IPFS Storage API

### Overview
Decentralized file storage using IPFS for health records and summaries.

### Configuration
- **Gateway**: https://ipfs.io/ipfs/
- **Pinning Service**: Pinata (configurable)

### File Upload

#### `uploadFile(file: File)`
Uploads a file to IPFS and returns the hash.

**Parameters:**
- `file` (File): File object to upload

**Returns:**
```typescript
Promise<string | null>
```

**Example:**
```typescript
const ipfsHash = await ipfsStorage.uploadFile(selectedFile);
```

#### `uploadJSON(data: any)`
Uploads JSON data to IPFS.

**Parameters:**
- `data` (any): Data to upload as JSON

**Returns:**
```typescript
Promise<string | null>
```

### File Retrieval

#### `retrieveFile(hash: string)`
Retrieves file content from IPFS using hash.

**Parameters:**
- `hash` (string): IPFS hash

**Returns:**
```typescript
Promise<any>
```

#### `getFileUrl(hash: string)`
Returns the public URL for an IPFS file.

**Parameters:**
- `hash` (string): IPFS hash

**Returns:**
```typescript
string
```

---

## Health Summary Generator

### Overview
Generates comprehensive health summaries from user data.

### Summary Generation

#### `generateSummary(userId, symptoms, reminders, records, dateRange)`
Creates a comprehensive health summary.

**Parameters:**
- `userId` (string): User identifier
- `symptoms` (SymptomLog[]): Array of symptom logs
- `reminders` (Reminder[]): Array of reminders
- `records` (HealthRecord[]): Array of health records
- `dateRange` (object): Date range for summary

**Returns:**
```typescript
HealthSummary
```

**Example:**
```typescript
const summary = HealthSummaryGenerator.generateSummary(
  'user123',
  symptoms,
  reminders,
  records,
  { 
    start: new Date('2024-01-01'), 
    end: new Date('2024-01-31') 
  }
);
```

### Summary Structure

```typescript
interface HealthSummary {
  userId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  symptoms: SymptomSummary[];
  medications: string[];
  appointments: string[];
  keyInsights: string[];
  generatedAt: Date;
}
```

---

## Local Storage API

### Overview
Local browser storage for user health data with privacy-first approach.

### User Management

#### `getUser(userId: string)`
Retrieves user profile from local storage.

**Returns:**
```typescript
Promise<User | null>
```

#### `saveUser(user: User)`
Saves user profile to local storage.

**Parameters:**
- `user` (User): User object to save

### Symptom Logs

#### `getSymptomLogs(userId: string)`
Retrieves all symptom logs for a user.

**Returns:**
```typescript
Promise<SymptomLog[]>
```

#### `saveSymptomLog(log: SymptomLog)`
Saves a new symptom log.

**Parameters:**
- `log` (SymptomLog): Symptom log to save

#### `deleteSymptomLog(userId: string, logId: string)`
Deletes a specific symptom log.

### Reminders

#### `getReminders(userId: string)`
Retrieves all reminders for a user.

**Returns:**
```typescript
Promise<Reminder[]>
```

#### `saveReminder(reminder: Reminder)`
Saves or updates a reminder.

**Parameters:**
- `reminder` (Reminder): Reminder to save

#### `deleteReminder(userId: string, reminderId: string)`
Deletes a specific reminder.

### Health Records

#### `getHealthRecords(userId: string)`
Retrieves all health records for a user.

**Returns:**
```typescript
Promise<HealthRecord[]>
```

#### `saveHealthRecord(record: HealthRecord)`
Saves a new health record.

**Parameters:**
- `record` (HealthRecord): Health record to save

#### `deleteHealthRecord(userId: string, recordId: string)`
Deletes a specific health record.

---

## Error Handling

### Common Error Patterns

All API methods follow consistent error handling patterns:

```typescript
try {
  const result = await apiMethod();
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

### Error Types

1. **Network Errors**: Connection issues, timeouts
2. **Authentication Errors**: Invalid credentials, expired tokens
3. **Validation Errors**: Invalid input data
4. **Storage Errors**: IPFS upload failures, local storage issues
5. **Blockchain Errors**: Transaction failures, insufficient gas

### Error Response Format

```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
}
```

---

## Rate Limiting

### IPFS Storage
- **Upload Limit**: 100 files per hour
- **Size Limit**: 100MB per file
- **Total Storage**: 1GB per user (free tier)

### Farcaster API
- **Cast Limit**: 10 casts per hour
- **Profile Updates**: 5 per day

### Base Network
- **Transaction Limit**: Based on gas fees and network congestion
- **RPC Calls**: 1000 per minute

---

## Security Considerations

### Data Privacy
- All sensitive data encrypted before IPFS upload
- Private keys never transmitted or stored
- User data remains under user control

### Authentication
- Wallet-based authentication only
- No password storage required
- Session management through wallet connection

### Data Integrity
- IPFS content addressing ensures data integrity
- Blockchain transactions provide immutable audit trail
- Local storage encrypted where possible

---

## Development Examples

### Complete Integration Example

```typescript
import { 
  farcasterAPI, 
  baseAPI, 
  ipfsStorage, 
  HealthSummaryGenerator 
} from '@/lib/api';
import { healthStorage } from '@/lib/storage';

// Complete workflow example
async function completeHealthWorkflow() {
  try {
    // 1. Connect wallet
    const walletAddress = await baseAPI.connectWallet();
    
    // 2. Authenticate with Farcaster
    const user = await farcasterAPI.authenticateUser(walletAddress);
    await healthStorage.saveUser(user);
    
    // 3. Load user data
    const symptoms = await healthStorage.getSymptomLogs(user.userId);
    const reminders = await healthStorage.getReminders(user.userId);
    const records = await healthStorage.getHealthRecords(user.userId);
    
    // 4. Generate health summary
    const summary = HealthSummaryGenerator.generateSummary(
      user.userId,
      symptoms,
      reminders,
      records,
      { 
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date() 
      }
    );
    
    // 5. Upload to IPFS
    const ipfsHash = await ipfsStorage.uploadJSON(summary);
    
    // 6. Share to Farcaster
    await farcasterAPI.shareHealthSummary(summary, 
      `📊 My health summary: ${summary.symptoms.length} symptoms tracked!`
    );
    
    // 7. Create NFT (optional)
    const nftHash = await baseAPI.createHealthNFT(summary);
    
    console.log('Workflow completed successfully!');
    
  } catch (error) {
    console.error('Workflow failed:', error);
  }
}
```

---

## Testing

### Mock Data
All APIs include mock implementations for development and testing:

```typescript
// Enable mock mode
process.env.NODE_ENV = 'development';
process.env.NEXT_PUBLIC_USE_MOCKS = 'true';
```

### Test Utilities
```typescript
import { createMockUser, createMockSymptom } from '@/lib/test-utils';

const mockUser = createMockUser();
const mockSymptom = createMockSymptom();
```

---

## Support

For API-related issues:
- **Documentation**: https://docs.healthsync.app/api
- **GitHub Issues**: https://github.com/vistara-apps/healthsync/issues
- **Discord**: https://discord.gg/healthsync

---

*Last updated: January 2024*
