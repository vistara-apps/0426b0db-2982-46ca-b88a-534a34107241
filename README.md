# HealthSync - Base MiniApp

![HealthSync Logo](https://via.placeholder.com/800x200/3b82f6/ffffff?text=HealthSync+-+Your+All-in-One+Health+Assistant)

## 🏥 Overview

HealthSync is a comprehensive health management application built as a Base MiniApp. It empowers users to track symptoms, manage medications, store health records, and generate shareable health summaries, all powered by blockchain technology and decentralized storage.

## ✨ Features

### 🔍 Core Features

1. **Symptom Tracker & Trend Analysis**
   - Log symptoms with severity, duration, and triggers
   - Visualize symptom patterns over time
   - Identify correlations and trends
   - Advanced analytics and insights

2. **Medication & Appointment Reminders**
   - Customizable medication reminders
   - Appointment scheduling and notifications
   - Recurring reminder support
   - Snooze functionality

3. **Centralized Health Record Hub**
   - Secure document storage on IPFS
   - Support for various file types (PDF, images, documents)
   - Organized categorization system
   - Easy retrieval and sharing

4. **Shareable Health Summary**
   - Generate comprehensive health reports
   - Export to PDF format
   - Create shareable IPFS links
   - Mint health data as NFTs on Base

### 🌐 Web3 Integration

- **Base Protocol**: Native integration with Base blockchain
- **Farcaster**: Social authentication and sharing capabilities
- **IPFS**: Decentralized storage for health documents
- **Wallet Connect**: Seamless Base wallet integration

## 🛠 Technical Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization

### Blockchain & Web3
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **OnchainKit** - Coinbase's Web3 toolkit

### Storage & APIs
- **IPFS** - Decentralized file storage
- **Farcaster API** - Social features
- **Base RPC** - Blockchain interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Base wallet (Coinbase Wallet, MetaMask, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/0426b0db-2982-46ca-b88a-534a34107241.git
   cd 0426b0db-2982-46ca-b88a-534a34107241
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
   NEXT_PUBLIC_FARCASTER_API_KEY=your_farcaster_api_key
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Getting Started

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the Summary tab
   - Approve the connection to Base network
   - Authenticate with Farcaster for social features

2. **Log Your First Symptom**
   - Navigate to the Symptoms tab
   - Click "Log Symptom"
   - Fill in symptom details, severity, and triggers
   - Save to start tracking patterns

3. **Set Up Reminders**
   - Go to the Reminders tab
   - Add medication or appointment reminders
   - Configure frequency and timing
   - Enable notifications

4. **Upload Health Records**
   - Visit the Records tab
   - Upload documents (PDF, images, etc.)
   - Files are stored securely on IPFS
   - Organize with tags and categories

5. **Generate Health Summary**
   - Navigate to the Summary tab
   - Click "Generate Summary"
   - Share via link, PDF, or mint as NFT
   - Perfect for doctor visits

## 🏗 Architecture

### Data Model

```typescript
// User Entity
interface User {
  userId: string;
  farcasterId?: string;
  walletAddress?: string;
  preferences: UserPreferences;
}

// Symptom Log Entity
interface SymptomLog {
  logId: string;
  userId: string;
  symptom: string;
  severity: 'low' | 'medium' | 'high';
  duration: string;
  notes?: string;
  timestamp: Date;
  triggers?: string[];
}

// Reminder Entity
interface Reminder {
  reminderId: string;
  userId: string;
  type: 'medication' | 'appointment' | 'checkup';
  title: string;
  details: string;
  time: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  isEnabled: boolean;
}

// Health Record Entity
interface HealthRecord {
  recordId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  documentType: 'lab-result' | 'prescription' | 'vaccination' | 'note' | 'image';
  uploadTimestamp: Date;
}
```

### Design System

The application follows a comprehensive design system with:

- **Color Tokens**: Primary (Blue), Accent (Green), Surface (White)
- **Typography**: Consistent font scales and weights
- **Spacing**: 8px base unit system
- **Components**: Reusable UI components
- **Motion**: Smooth transitions and animations

### API Integration

```typescript
// Farcaster Integration
const farcasterAPI = new FarcasterAPI();
await farcasterAPI.authenticateUser(walletAddress);
await farcasterAPI.shareHealthSummary(summary, castText);

// Base Protocol Integration
const baseAPI = new BaseAPI();
await baseAPI.connectWallet();
await baseAPI.createHealthNFT(summary);

// IPFS Storage
const ipfsStorage = new IPFSStorage();
const hash = await ipfsStorage.uploadFile(file);
const url = ipfsStorage.getFileUrl(hash);
```

## 🔒 Security & Privacy

### Data Protection
- **Local Storage**: Sensitive data stored locally by default
- **IPFS Encryption**: Files encrypted before IPFS upload
- **Wallet Security**: Private keys never leave user's device
- **Decentralized**: No central server storing personal data

### Privacy Features
- **User Control**: Complete ownership of health data
- **Selective Sharing**: Choose what to share and with whom
- **Temporary Links**: Shareable links with expiration
- **Anonymous Mode**: Option to use without wallet connection

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Environment Variables**
   Configure in Vercel dashboard:
   - `NEXT_PUBLIC_PINATA_API_KEY`
   - `NEXT_PUBLIC_FARCASTER_API_KEY`
   - `NEXT_PUBLIC_BASE_RPC_URL`

3. **Domain Configuration**
   - Set up custom domain
   - Configure SSL certificates
   - Enable Base MiniApp integration

### Base MiniApp Integration

1. **Register MiniApp**
   - Submit to Base MiniApp directory
   - Configure app metadata
   - Set up deep linking

2. **Wallet Integration**
   - Test with Coinbase Wallet
   - Verify Base network compatibility
   - Configure transaction flows

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📈 Business Model

### Freemium Model
- **Free Tier**: Basic symptom tracking and reminders
- **Pro Tier ($3/month)**: 
  - Extended history (unlimited)
  - Advanced analytics and insights
  - Priority support
  - NFT minting capabilities
  - Enhanced sharing features

### Revenue Streams
1. **Subscription Revenue**: Monthly Pro subscriptions
2. **Transaction Fees**: Small fees on NFT minting
3. **Premium Features**: Advanced analytics and reports
4. **API Access**: Healthcare provider integrations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests**
5. **Submit a pull request**

### Code Standards

- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [Discord Server](https://discord.gg/healthsync)
- [GitHub Discussions](https://github.com/vistara-apps/healthsync/discussions)
- [Twitter](https://twitter.com/healthsync_app)

### Contact
- **Email**: support@healthsync.app
- **Website**: https://healthsync.app
- **Documentation**: https://docs.healthsync.app

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core symptom tracking
- ✅ Medication reminders
- ✅ Health record storage
- ✅ Basic analytics

### Phase 2 (Q1 2024)
- 🔄 Advanced AI insights
- 🔄 Healthcare provider integration
- 🔄 Wearable device sync
- 🔄 Social features expansion

### Phase 3 (Q2 2024)
- 📋 Telemedicine integration
- 📋 Insurance claim assistance
- 📋 Multi-language support
- 📋 Mobile app release

---

**Built with ❤️ for the Base ecosystem**

*HealthSync - Your All-in-One Health Assistant, Powered by You.*
