// User Types
export interface User {
  userId: string;
  farcasterId?: string;
  walletAddress?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  reminderSound: boolean;
  theme: 'light' | 'dark';
  timezone: string;
}

// Symptom Log Types
export interface SymptomLog {
  logId: string;
  userId: string;
  symptom: string;
  severity: 'low' | 'medium' | 'high';
  duration: string;
  notes?: string;
  timestamp: Date;
  triggers?: string[];
}

export interface SymptomTrend {
  symptom: string;
  averageSeverity: number;
  frequency: number;
  lastOccurrence: Date;
}

// Reminder Types
export interface Reminder {
  reminderId: string;
  userId: string;
  type: 'medication' | 'appointment' | 'checkup';
  title: string;
  details: string;
  time: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  isEnabled: boolean;
  nextReminder?: Date;
}

// Health Record Types
export interface HealthRecord {
  recordId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  documentType: 'lab-result' | 'prescription' | 'vaccination' | 'note' | 'image';
  uploadTimestamp: Date;
  tags?: string[];
}

// Health Summary Types
export interface HealthSummary {
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

export interface SymptomSummary {
  symptom: string;
  occurrences: number;
  averageSeverity: number;
  trends: 'improving' | 'worsening' | 'stable';
}

// Form Types
export interface SymptomFormData {
  symptom: string;
  severity: 'low' | 'medium' | 'high';
  duration: string;
  notes: string;
  triggers: string[];
}

export interface ReminderFormData {
  type: 'medication' | 'appointment' | 'checkup';
  title: string;
  details: string;
  time: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TrendData {
  symptom: string;
  data: ChartDataPoint[];
  color: string;
}
