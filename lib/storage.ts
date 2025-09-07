import { SymptomLog, Reminder, HealthRecord, User } from './types';

// Mock storage using localStorage for demo purposes
// In production, this would integrate with Farcaster Hubs or IPFS

class HealthStorage {
  private getStorageKey(userId: string, type: string): string {
    return `healthsync_${userId}_${type}`;
  }

  // User Management
  async getUser(userId: string): Promise<User | null> {
    try {
      const data = localStorage.getItem(this.getStorageKey(userId, 'profile'));
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async saveUser(user: User): Promise<void> {
    localStorage.setItem(
      this.getStorageKey(user.userId, 'profile'),
      JSON.stringify(user)
    );
  }

  // Symptom Logs
  async getSymptomLogs(userId: string): Promise<SymptomLog[]> {
    try {
      const data = localStorage.getItem(this.getStorageKey(userId, 'symptoms'));
      const logs = data ? JSON.parse(data) : [];
      return logs.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
    } catch {
      return [];
    }
  }

  async saveSymptomLog(log: SymptomLog): Promise<void> {
    const logs = await this.getSymptomLogs(log.userId);
    logs.push(log);
    localStorage.setItem(
      this.getStorageKey(log.userId, 'symptoms'),
      JSON.stringify(logs)
    );
  }

  async deleteSymptomLog(userId: string, logId: string): Promise<void> {
    const logs = await this.getSymptomLogs(userId);
    const filtered = logs.filter(log => log.logId !== logId);
    localStorage.setItem(
      this.getStorageKey(userId, 'symptoms'),
      JSON.stringify(filtered)
    );
  }

  // Reminders
  async getReminders(userId: string): Promise<Reminder[]> {
    try {
      const data = localStorage.getItem(this.getStorageKey(userId, 'reminders'));
      const reminders = data ? JSON.parse(data) : [];
      return reminders.map((reminder: any) => ({
        ...reminder,
        nextReminder: reminder.nextReminder ? new Date(reminder.nextReminder) : undefined
      }));
    } catch {
      return [];
    }
  }

  async saveReminder(reminder: Reminder): Promise<void> {
    const reminders = await this.getReminders(reminder.userId);
    const existingIndex = reminders.findIndex(r => r.reminderId === reminder.reminderId);
    
    if (existingIndex >= 0) {
      reminders[existingIndex] = reminder;
    } else {
      reminders.push(reminder);
    }
    
    localStorage.setItem(
      this.getStorageKey(reminder.userId, 'reminders'),
      JSON.stringify(reminders)
    );
  }

  async deleteReminder(userId: string, reminderId: string): Promise<void> {
    const reminders = await this.getReminders(userId);
    const filtered = reminders.filter(r => r.reminderId !== reminderId);
    localStorage.setItem(
      this.getStorageKey(userId, 'reminders'),
      JSON.stringify(filtered)
    );
  }

  // Health Records
  async getHealthRecords(userId: string): Promise<HealthRecord[]> {
    try {
      const data = localStorage.getItem(this.getStorageKey(userId, 'records'));
      const records = data ? JSON.parse(data) : [];
      return records.map((record: any) => ({
        ...record,
        uploadTimestamp: new Date(record.uploadTimestamp)
      }));
    } catch {
      return [];
    }
  }

  async saveHealthRecord(record: HealthRecord): Promise<void> {
    const records = await this.getHealthRecords(record.userId);
    records.push(record);
    localStorage.setItem(
      this.getStorageKey(record.userId, 'records'),
      JSON.stringify(records)
    );
  }

  async deleteHealthRecord(userId: string, recordId: string): Promise<void> {
    const records = await this.getHealthRecords(userId);
    const filtered = records.filter(r => r.recordId !== recordId);
    localStorage.setItem(
      this.getStorageKey(userId, 'records'),
      JSON.stringify(filtered)
    );
  }

  // Clear all data for user
  async clearUserData(userId: string): Promise<void> {
    const keys = ['profile', 'symptoms', 'reminders', 'records'];
    keys.forEach(key => {
      localStorage.removeItem(this.getStorageKey(userId, key));
    });
  }
}

export const healthStorage = new HealthStorage();
