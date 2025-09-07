# HealthSync Deployment Guide

## Overview

This guide covers deploying HealthSync to various platforms, with a focus on production-ready deployments for Base MiniApps.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Vercel Deployment](#vercel-deployment)
4. [Base MiniApp Integration](#base-miniapp-integration)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Monitoring & Analytics](#monitoring--analytics)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [Vercel](https://vercel.com) account for hosting
- [Pinata](https://pinata.cloud) account for IPFS storage
- [Farcaster](https://farcaster.xyz) developer account
- Base wallet with ETH for testing

### Development Environment
- Node.js 18+
- Git
- Base wallet browser extension

---

## Environment Configuration

### 1. Create Environment Files

Create `.env.local` for local development:

```bash
cp .env.example .env.local
```

### 2. Configure Required Variables

#### IPFS Storage (Pinata)
```env
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
```

**Setup Steps:**
1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Go to API Keys section
3. Create new API key with admin permissions
4. Copy API key and secret

#### Farcaster Integration
```env
NEXT_PUBLIC_FARCASTER_API_KEY=your_farcaster_api_key
NEXT_PUBLIC_FARCASTER_HUB_URL=https://api.farcaster.xyz
```

**Setup Steps:**
1. Register at [Farcaster Developer Portal](https://developers.farcaster.xyz)
2. Create new application
3. Generate API key
4. Configure webhook endpoints (optional)

#### Base Network
```env
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_CHAIN_ID=8453
```

#### Application Settings
```env
NEXT_PUBLIC_APP_NAME=HealthSync
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## Vercel Deployment

### 1. Connect Repository

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub
4. Select your HealthSync repository
5. Configure build settings

### 2. Build Configuration

Vercel should auto-detect Next.js settings, but verify:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 3. Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add all variables from `.env.example`
4. Set appropriate values for production

**Required Variables:**
- `NEXT_PUBLIC_PINATA_API_KEY`
- `NEXT_PUBLIC_PINATA_SECRET_KEY`
- `NEXT_PUBLIC_FARCASTER_API_KEY`
- `NEXT_PUBLIC_BASE_RPC_URL`
- `NEXT_PUBLIC_APP_URL`

### 4. Deploy

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

---

## Base MiniApp Integration

### 1. Register MiniApp

#### Base MiniApp Directory
1. Visit [Base MiniApp Directory](https://base.org/miniapps)
2. Click "Submit MiniApp"
3. Fill out application form:
   - **Name**: HealthSync
   - **Description**: Your All-in-One Health Assistant
   - **URL**: https://your-domain.com
   - **Category**: Health & Wellness
   - **Tags**: health, tracking, web3, base

#### Required Metadata
Create `public/miniapp-manifest.json`:

```json
{
  "name": "HealthSync",
  "short_name": "HealthSync",
  "description": "Your All-in-One Health Assistant, Powered by You",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#3b82f6",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["health", "productivity"],
  "base_miniapp": {
    "version": "1.0.0",
    "chain_id": 8453,
    "required_permissions": ["wallet_connect", "transaction_signing"]
  }
}
```

### 2. Wallet Integration Testing

#### Test Checklist
- [ ] Coinbase Wallet connection
- [ ] MetaMask connection
- [ ] Base network switching
- [ ] Transaction signing
- [ ] Error handling

#### Test Script
```typescript
// Test wallet connectivity
async function testWalletIntegration() {
  try {
    // Test connection
    const address = await baseAPI.connectWallet();
    console.log('✅ Wallet connected:', address);
    
    // Test network
    const chainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });
    console.log('✅ Chain ID:', chainId);
    
    // Test balance
    const balance = await baseAPI.getWalletBalance(address);
    console.log('✅ Balance:', balance);
    
  } catch (error) {
    console.error('❌ Wallet test failed:', error);
  }
}
```

### 3. Deep Linking

Configure deep links for Base wallet integration:

```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/miniapp/:path*',
        destination: '/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## Custom Domain Setup

### 1. Domain Configuration

#### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

#### SSL Certificate
Vercel automatically provisions SSL certificates for custom domains.

### 2. Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` to your custom domain:

```env
NEXT_PUBLIC_APP_URL=https://healthsync.app
```

### 3. Redirect Configuration

```typescript
// next.config.mjs
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/health',
        destination: '/',
        permanent: true,
      },
    ];
  },
};
```

---

## Monitoring & Analytics

### 1. Vercel Analytics

Enable in `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Monitoring (Sentry)

Install Sentry:

```bash
npm install @sentry/nextjs
```

Configure `sentry.client.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 3. Performance Monitoring

Add Web Vitals tracking:

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## Security Configuration

### 1. Content Security Policy

Add to `next.config.mjs`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              connect-src 'self' https://mainnet.base.org https://api.farcaster.xyz https://ipfs.io;
              frame-src 'self';
            `.replace(/\s{2,}/g, ' ').trim()
          },
        ],
      },
    ];
  },
};
```

### 2. Environment Security

#### Production Environment Variables
- Never commit `.env.local` to git
- Use Vercel's environment variable encryption
- Rotate API keys regularly
- Use different keys for staging/production

#### API Key Security
```typescript
// Validate environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_PINATA_API_KEY',
  'NEXT_PUBLIC_FARCASTER_API_KEY',
  'NEXT_PUBLIC_BASE_RPC_URL',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

---

## Performance Optimization

### 1. Build Optimization

```typescript
// next.config.mjs
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['ipfs.io', 'gateway.pinata.cloud'],
  },
  compress: true,
};
```

### 2. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

### 3. Caching Strategy

```typescript
// app/layout.tsx
export const metadata = {
  title: 'HealthSync',
  description: 'Your All-in-One Health Assistant',
  manifest: '/miniapp-manifest.json',
  other: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
};
```

---

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Error**: `Module not found`
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Error**: `Environment variable not found`
- Check Vercel environment variables
- Ensure all required variables are set
- Verify variable names match exactly

#### 2. Wallet Connection Issues

**Error**: `No provider found`
- Ensure user has Base-compatible wallet
- Check network configuration
- Verify RPC URL is correct

**Error**: `Wrong network`
```typescript
// Add network switching
async function switchToBase() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }], // Base mainnet
    });
  } catch (error) {
    // Handle error
  }
}
```

#### 3. IPFS Upload Failures

**Error**: `Upload failed`
- Check Pinata API key permissions
- Verify file size limits
- Check network connectivity

**Error**: `Rate limit exceeded`
- Implement retry logic
- Add upload queuing
- Consider upgrading Pinata plan

#### 4. Deployment Issues

**Error**: `Build timeout`
- Optimize build process
- Remove unused dependencies
- Consider upgrading Vercel plan

**Error**: `Function timeout`
- Optimize API calls
- Add proper error handling
- Consider serverless function limits

### Debug Mode

Enable debug logging:

```env
NEXT_PUBLIC_DEBUG=true
NODE_ENV=development
```

### Health Checks

Create health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    environment: process.env.NODE_ENV,
  };
  
  return Response.json(health);
}
```

---

## Maintenance

### 1. Regular Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

### 2. Monitoring Checklist

- [ ] Application uptime
- [ ] API response times
- [ ] Error rates
- [ ] User engagement metrics
- [ ] Wallet connection success rates
- [ ] IPFS upload success rates

### 3. Backup Strategy

- [ ] Environment variables backed up securely
- [ ] Database exports (if applicable)
- [ ] IPFS content pinning
- [ ] Code repository backups

---

## Support

For deployment issues:
- **Documentation**: https://docs.healthsync.app/deployment
- **GitHub Issues**: https://github.com/vistara-apps/healthsync/issues
- **Discord**: https://discord.gg/healthsync
- **Email**: support@healthsync.app

---

*Last updated: January 2024*
