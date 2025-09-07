// API integrations for HealthSync
// This file contains integrations with Farcaster, Base, and IPFS as specified in the PRD

import { User, SymptomLog, Reminder, HealthRecord, HealthSummary } from './types';

// Farcaster Integration
export class FarcasterAPI {
  private baseUrl = 'https://api.farcaster.xyz'; // Example endpoint
  
  async authenticateUser(walletAddress: string): Promise<User | null> {
    try {
      // In production, this would authenticate with Farcaster Hub
      // For now, return a mock user
      return {
        userId: `fc_${walletAddress.slice(-8)}`,
        farcasterId: `fid_${Math.random().toString(36).substring(7)}`,
        walletAddress,
        preferences: {
          notifications: true,
          reminderSound: true,
          theme: 'light',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      };
    } catch (error) {
      console.error('Farcaster authentication failed:', error);
      return null;
    }
  }

  async getUserProfile(farcasterId: string): Promise<any> {
    try {
      // Mock implementation - in production would call Farcaster API
      return {
        fid: farcasterId,
        username: `user_${farcasterId.slice(-4)}`,
        displayName: 'HealthSync User',
        pfpUrl: null,
        bio: 'Managing my health with HealthSync',
      };
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  async shareHealthSummary(summary: HealthSummary, castText: string): Promise<boolean> {
    try {
      // In production, this would create a Farcaster cast with the health summary
      console.log('Sharing health summary to Farcaster:', { summary, castText });
      return true;
    } catch (error) {
      console.error('Failed to share to Farcaster:', error);
      return false;
    }
  }
}

// Base Protocol Integration
export class BaseAPI {
  private rpcUrl = 'https://mainnet.base.org'; // Base mainnet RPC
  
  async connectWallet(): Promise<string | null> {
    try {
      // In production, this would use wagmi/viem to connect to Base wallet
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        return accounts[0] || null;
      }
      return null;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return null;
    }
  }

  async getWalletBalance(address: string): Promise<string> {
    try {
      // Mock implementation - in production would query Base network
      return '0.1234';
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return '0';
    }
  }

  async createHealthNFT(summary: HealthSummary): Promise<string | null> {
    try {
      // In production, this would mint an NFT on Base with health summary metadata
      console.log('Creating health NFT on Base:', summary);
      return `0x${Math.random().toString(16).substring(2, 42)}`;
    } catch (error) {
      console.error('Failed to create health NFT:', error);
      return null;
    }
  }
}

// IPFS Integration for decentralized storage
export class IPFSStorage {
  private gateway = 'https://ipfs.io/ipfs/';
  private pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  
  async uploadFile(file: File): Promise<string | null> {
    try {
      // In production, this would upload to IPFS via Pinata or similar service
      const formData = new FormData();
      formData.append('file', file);
      
      // Mock implementation - return a fake IPFS hash
      const mockHash = `Qm${Math.random().toString(36).substring(2, 48)}`;
      console.log('File uploaded to IPFS:', mockHash);
      return mockHash;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      return null;
    }
  }

  async uploadJSON(data: any): Promise<string | null> {
    try {
      // Convert data to JSON and upload to IPFS
      const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const file = new File([jsonBlob], 'data.json', { type: 'application/json' });
      return await this.uploadFile(file);
    } catch (error) {
      console.error('JSON upload to IPFS failed:', error);
      return null;
    }
  }

  async retrieveFile(hash: string): Promise<any> {
    try {
      const response = await fetch(`${this.gateway}${hash}`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to retrieve from IPFS');
    } catch (error) {
      console.error('IPFS retrieval failed:', error);
      return null;
    }
  }

  getFileUrl(hash: string): string {
    return `${this.gateway}${hash}`;
  }
}

// Health Summary Generator
export class HealthSummaryGenerator {
  static generateSummary(
    userId: string,
    symptoms: SymptomLog[],
    reminders: Reminder[],
    records: HealthRecord[],
    dateRange: { start: Date; end: Date }
  ): HealthSummary {
    // Filter data by date range
    const filteredSymptoms = symptoms.filter(
      s => s.timestamp >= dateRange.start && s.timestamp <= dateRange.end
    );

    // Generate symptom summaries
    const symptomSummaries = this.generateSymptomSummaries(filteredSymptoms);
    
    // Extract medications and appointments
    const medications = reminders
      .filter(r => r.type === 'medication')
      .map(r => r.title);
    
    const appointments = reminders
      .filter(r => r.type === 'appointment')
      .map(r => `${r.title} - ${r.time}`);

    // Generate key insights
    const keyInsights = this.generateInsights(filteredSymptoms, reminders);

    return {
      userId,
      dateRange,
      symptoms: symptomSummaries,
      medications,
      appointments,
      keyInsights,
      generatedAt: new Date(),
    };
  }

  private static generateSymptomSummaries(symptoms: SymptomLog[]) {
    const symptomGroups = symptoms.reduce((acc, symptom) => {
      if (!acc[symptom.symptom]) {
        acc[symptom.symptom] = [];
      }
      acc[symptom.symptom].push(symptom);
      return acc;
    }, {} as Record<string, SymptomLog[]>);

    return Object.entries(symptomGroups).map(([symptom, logs]) => {
      const severityValues = logs.map(log => {
        switch (log.severity) {
          case 'low': return 1;
          case 'medium': return 2;
          case 'high': return 3;
          default: return 0;
        }
      });

      const averageSeverity = severityValues.reduce((a, b) => a + b, 0) / severityValues.length;
      
      // Simple trend calculation
      const recentLogs = logs.slice(-3);
      const earlierLogs = logs.slice(0, -3);
      let trends: 'improving' | 'worsening' | 'stable' = 'stable';
      
      if (recentLogs.length > 0 && earlierLogs.length > 0) {
        const recentAvg = recentLogs.reduce((sum, log) => {
          return sum + (log.severity === 'low' ? 1 : log.severity === 'medium' ? 2 : 3);
        }, 0) / recentLogs.length;
        
        const earlierAvg = earlierLogs.reduce((sum, log) => {
          return sum + (log.severity === 'low' ? 1 : log.severity === 'medium' ? 2 : 3);
        }, 0) / earlierLogs.length;
        
        if (recentAvg < earlierAvg - 0.3) trends = 'improving';
        else if (recentAvg > earlierAvg + 0.3) trends = 'worsening';
      }

      return {
        symptom,
        occurrences: logs.length,
        averageSeverity,
        trends,
      };
    });
  }

  private static generateInsights(symptoms: SymptomLog[], reminders: Reminder[]): string[] {
    const insights: string[] = [];

    if (symptoms.length === 0) {
      insights.push('No symptoms recorded in this period');
      return insights;
    }

    // Most common symptom
    const symptomCounts = symptoms.reduce((acc, symptom) => {
      acc[symptom.symptom] = (acc[symptom.symptom] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommon = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostCommon) {
      insights.push(`Most frequent symptom: ${mostCommon[0]} (${mostCommon[1]} occurrences)`);
    }

    // High severity symptoms
    const highSeverityCount = symptoms.filter(s => s.severity === 'high').length;
    if (highSeverityCount > 0) {
      insights.push(`${highSeverityCount} high-severity symptoms recorded`);
    }

    // Medication adherence
    const medicationCount = reminders.filter(r => r.type === 'medication' && r.isEnabled).length;
    if (medicationCount > 0) {
      insights.push(`${medicationCount} active medication reminders`);
    }

    // Trigger analysis
    const allTriggers = symptoms.flatMap(s => s.triggers || []);
    if (allTriggers.length > 0) {
      const triggerCounts = allTriggers.reduce((acc, trigger) => {
        acc[trigger] = (acc[trigger] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const commonTrigger = Object.entries(triggerCounts)
        .sort(([,a], [,b]) => b - a)[0];

      if (commonTrigger && commonTrigger[1] > 1) {
        insights.push(`Common trigger identified: ${commonTrigger[0]}`);
      }
    }

    return insights;
  }
}

// Export singleton instances
export const farcasterAPI = new FarcasterAPI();
export const baseAPI = new BaseAPI();
export const ipfsStorage = new IPFSStorage();
