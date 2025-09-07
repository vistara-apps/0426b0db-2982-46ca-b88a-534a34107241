'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { HealthInputForm } from '@/components/HealthInputForm';
import { HealthRecordCard } from '@/components/HealthRecordCard';
import { TimelineChart } from '@/components/TimelineChart';
import { NotificationBanner } from '@/components/NotificationBanner';
import { 
  Activity, 
  Plus, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Bell,
  Upload,
  Share2,
  Clock,
  Target,
  Zap,
  Heart,
  X
} from 'lucide-react';
import { 
  SymptomLog, 
  Reminder, 
  HealthRecord, 
  SymptomFormData, 
  ReminderFormData,
  TrendData 
} from '@/lib/types';
import { healthStorage } from '@/lib/storage';
import { generateId, formatDate, formatTime, getSeverityColor, getSeverityValue, calculateTrend } from '@/lib/utils';

export default function HealthSyncApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderType, setReminderType] = useState<'medication' | 'appointment'>('medication');
  const [notification, setNotification] = useState<{
    variant: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const userId = 'demo-user'; // In production, this would come from wallet/Farcaster auth

  // Load data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [symptomsData, remindersData, recordsData] = await Promise.all([
        healthStorage.getSymptomLogs(userId),
        healthStorage.getReminders(userId),
        healthStorage.getHealthRecords(userId)
      ]);
      
      setSymptoms(symptomsData);
      setReminders(remindersData);
      setRecords(recordsData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      showNotification('error', 'Error', 'Failed to load your health data');
    }
  };

  const showNotification = (variant: 'info' | 'warning' | 'success' | 'error', title: string, message: string) => {
    setNotification({ variant, title, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSymptomSubmit = async (data: SymptomFormData) => {
    try {
      const symptomLog: SymptomLog = {
        logId: generateId(),
        userId,
        symptom: data.symptom,
        severity: data.severity,
        duration: data.duration,
        notes: data.notes,
        triggers: data.triggers,
        timestamp: new Date(),
      };

      await healthStorage.saveSymptomLog(symptomLog);
      setSymptoms(prev => [symptomLog, ...prev]);
      setShowSymptomForm(false);
      showNotification('success', 'Symptom Logged', 'Your symptom has been recorded successfully');
    } catch (error) {
      console.error('Failed to save symptom:', error);
      showNotification('error', 'Error', 'Failed to save symptom log');
    }
  };

  const handleReminderSubmit = async (data: ReminderFormData) => {
    try {
      const reminder: Reminder = {
        reminderId: generateId(),
        userId,
        type: data.type,
        title: data.title,
        details: data.details,
        time: data.time,
        frequency: data.frequency,
        isEnabled: true,
      };

      await healthStorage.saveReminder(reminder);
      setReminders(prev => [reminder, ...prev]);
      setShowReminderForm(false);
      showNotification('success', 'Reminder Set', 'Your reminder has been created successfully');
    } catch (error) {
      console.error('Failed to save reminder:', error);
      showNotification('error', 'Error', 'Failed to create reminder');
    }
  };

  const handleDeleteSymptom = async (logId: string) => {
    try {
      await healthStorage.deleteSymptomLog(userId, logId);
      setSymptoms(prev => prev.filter(s => s.logId !== logId));
      showNotification('success', 'Deleted', 'Symptom log has been deleted');
    } catch (error) {
      console.error('Failed to delete symptom:', error);
      showNotification('error', 'Error', 'Failed to delete symptom log');
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await healthStorage.deleteReminder(userId, reminderId);
      setReminders(prev => prev.filter(r => r.reminderId !== reminderId));
      showNotification('success', 'Deleted', 'Reminder has been deleted');
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      showNotification('error', 'Error', 'Failed to delete reminder');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // In production, this would upload to IPFS or similar
      const fileUrl = URL.createObjectURL(file);
      
      const record: HealthRecord = {
        recordId: generateId(),
        userId,
        fileName: file.name,
        fileUrl,
        documentType: file.type.startsWith('image/') ? 'image' : 'note',
        uploadTimestamp: new Date(),
      };

      await healthStorage.saveHealthRecord(record);
      setRecords(prev => [record, ...prev]);
      showNotification('success', 'File Uploaded', 'Your health record has been saved');
    } catch (error) {
      console.error('Failed to upload file:', error);
      showNotification('error', 'Error', 'Failed to upload file');
    }
  };

  const generateTrendData = (): TrendData[] => {
    const symptomGroups = symptoms.reduce((acc, log) => {
      if (!acc[log.symptom]) {
        acc[log.symptom] = [];
      }
      acc[log.symptom].push(log);
      return acc;
    }, {} as Record<string, SymptomLog[]>);

    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
    
    return Object.entries(symptomGroups).slice(0, 5).map(([symptom, logs], index) => ({
      symptom,
      color: colors[index],
      data: logs
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .map(log => ({
          date: log.timestamp.toISOString().split('T')[0],
          value: getSeverityValue(log.severity),
          label: log.symptom,
        }))
    }));
  };

  const getHealthInsights = () => {
    if (symptoms.length === 0) return [];

    const insights = [];
    const recentSymptoms = symptoms.slice(0, 10);
    const symptomCounts = recentSymptoms.reduce((acc, log) => {
      acc[log.symptom] = (acc[log.symptom] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommon = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostCommon) {
      insights.push(`Your most frequent symptom is ${mostCommon[0]} (${mostCommon[1]} times recently)`);
    }

    const highSeverityCount = recentSymptoms.filter(s => s.severity === 'high').length;
    if (highSeverityCount > 0) {
      insights.push(`You've logged ${highSeverityCount} high-severity symptoms recently`);
    }

    return insights;
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card p-8 rounded-lg text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Welcome to HealthSync</h2>
        <p className="text-textSecondary mb-6">Your personal health assistant powered by Base</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{symptoms.length}</div>
            <div className="text-sm text-textSecondary">Symptoms Logged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{reminders.length}</div>
            <div className="text-sm text-textSecondary">Active Reminders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{records.length}</div>
            <div className="text-sm text-textSecondary">Health Records</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{getHealthInsights().length}</div>
            <div className="text-sm text-textSecondary">Insights</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setShowSymptomForm(true)}
          className="glass-card p-6 rounded-lg hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-textPrimary">Log Symptom</h3>
              <p className="text-sm text-textSecondary">Track how you're feeling</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setReminderType('medication');
            setShowReminderForm(true);
          }}
          className="glass-card p-6 rounded-lg hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-textPrimary">Set Reminder</h3>
              <p className="text-sm text-textSecondary">Never miss medications</p>
            </div>
          </div>
        </button>

        <label className="glass-card p-6 rounded-lg hover:shadow-lg transition-all duration-200 text-left group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-textPrimary">Upload Record</h3>
              <p className="text-sm text-textSecondary">Store health documents</p>
            </div>
          </div>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </label>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Symptoms */}
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-textPrimary">Recent Symptoms</h3>
            <button
              onClick={() => setActiveTab('symptoms')}
              className="text-sm text-primary hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {symptoms.slice(0, 3).map((symptom) => (
              <div key={symptom.logId} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <div className="font-medium text-textPrimary">{symptom.symptom}</div>
                  <div className="text-sm text-textSecondary">{formatDate(symptom.timestamp)}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                  {symptom.severity}
                </span>
              </div>
            ))}
            {symptoms.length === 0 && (
              <div className="text-center py-8 text-textSecondary">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No symptoms logged yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-textPrimary">Upcoming Reminders</h3>
            <button
              onClick={() => setActiveTab('reminders')}
              className="text-sm text-primary hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {reminders.slice(0, 3).map((reminder) => (
              <div key={reminder.reminderId} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <div className="font-medium text-textPrimary">{reminder.title}</div>
                  <div className="text-sm text-textSecondary">
                    {formatTime(reminder.time)} • {reminder.frequency}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${reminder.isEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            ))}
            {reminders.length === 0 && (
              <div className="text-center py-8 text-textSecondary">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No reminders set</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health Insights */}
      {getHealthInsights().length > 0 && (
        <div className="glass-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-textPrimary mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Health Insights
          </h3>
          <div className="space-y-2">
            {getHealthInsights().map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSymptoms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary">Symptom Tracker</h2>
          <p className="text-textSecondary">Monitor your symptoms and identify patterns</p>
        </div>
        <button
          onClick={() => setShowSymptomForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log Symptom</span>
        </button>
      </div>

      {showSymptomForm && (
        <HealthInputForm
          variant="symptom"
          onSubmit={handleSymptomSubmit}
          onCancel={() => setShowSymptomForm(false)}
        />
      )}

      {symptoms.length > 0 && (
        <TimelineChart
          data={generateTrendData()}
          variant="symptom-severity"
        />
      )}

      <div className="glass-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Recent Symptoms</h3>
        <div className="space-y-4">
          {symptoms.map((symptom) => (
            <div key={symptom.logId} className="flex items-start justify-between p-4 bg-white/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-textPrimary">{symptom.symptom}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                    {symptom.severity}
                  </span>
                </div>
                <div className="text-sm text-textSecondary space-y-1">
                  <p>{formatDate(symptom.timestamp)}</p>
                  {symptom.duration && <p>Duration: {symptom.duration}</p>}
                  {symptom.notes && <p>Notes: {symptom.notes}</p>}
                  {symptom.triggers && symptom.triggers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {symptom.triggers.map((trigger) => (
                        <span key={trigger} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteSymptom(symptom.logId)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {symptoms.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-textPrimary mb-2">No symptoms logged yet</h3>
              <p className="text-textSecondary mb-4">Start tracking your symptoms to identify patterns</p>
              <button
                onClick={() => setShowSymptomForm(true)}
                className="btn-primary"
              >
                Log Your First Symptom
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReminders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary">Reminders</h2>
          <p className="text-textSecondary">Never miss your medications or appointments</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setReminderType('medication');
              setShowReminderForm(true);
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Medication</span>
          </button>
          <button
            onClick={() => {
              setReminderType('appointment');
              setShowReminderForm(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Appointment</span>
          </button>
        </div>
      </div>

      {showReminderForm && (
        <HealthInputForm
          variant={reminderType}
          onSubmit={handleReminderSubmit}
          onCancel={() => setShowReminderForm(false)}
        />
      )}

      <div className="glass-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Your Reminders</h3>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.reminderId} className="flex items-start justify-between p-4 bg-white/50 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  reminder.type === 'medication' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {reminder.type === 'medication' ? (
                    <Bell className="w-5 h-5 text-white" />
                  ) : (
                    <Calendar className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-textPrimary">{reminder.title}</h4>
                  <div className="text-sm text-textSecondary space-y-1">
                    <p>{formatTime(reminder.time)} • {reminder.frequency}</p>
                    {reminder.details && <p>{reminder.details}</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${reminder.isEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                <button
                  onClick={() => handleDeleteReminder(reminder.reminderId)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {reminders.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-textPrimary mb-2">No reminders set</h3>
              <p className="text-textSecondary mb-4">Set up reminders for medications and appointments</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setReminderType('medication');
                    setShowReminderForm(true);
                  }}
                  className="btn-secondary"
                >
                  Add Medication
                </button>
                <button
                  onClick={() => {
                    setReminderType('appointment');
                    setShowReminderForm(true);
                  }}
                  className="btn-primary"
                >
                  Add Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary">Health Records</h2>
          <p className="text-textSecondary">Store and organize your medical documents</p>
        </div>
        <label className="btn-primary flex items-center space-x-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </label>
      </div>

      <div className="glass-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Your Documents</h3>
        {records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record) => (
              <HealthRecordCard
                key={record.recordId}
                record={record}
                variant={record.documentType === 'image' ? 'image' : 'document'}
                onDelete={() => {
                  setRecords(prev => prev.filter(r => r.recordId !== record.recordId));
                  healthStorage.deleteHealthRecord(userId, record.recordId);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-textPrimary mb-2">No records uploaded</h3>
            <p className="text-textSecondary mb-4">Upload your health documents to keep them organized</p>
            <label className="btn-primary cursor-pointer">
              Upload Your First Document
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary">Health Summary</h2>
          <p className="text-textSecondary">Share your health information with providers</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Share2 className="w-4 h-4" />
          <span>Generate Summary</span>
        </button>
      </div>

      <div className="glass-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Summary Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">{symptoms.length}</div>
            <div className="text-sm text-blue-800">Total Symptoms</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">{reminders.filter(r => r.type === 'medication').length}</div>
            <div className="text-sm text-green-800">Medications</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">{records.length}</div>
            <div className="text-sm text-purple-800">Documents</div>
          </div>
        </div>
      </div>

      {symptoms.length > 0 && (
        <div className="glass-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Recent Symptoms Summary</h3>
          <div className="space-y-3">
            {symptoms.slice(0, 5).map((symptom) => (
              <div key={symptom.logId} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <div className="font-medium text-textPrimary">{symptom.symptom}</div>
                  <div className="text-sm text-textSecondary">{formatDate(symptom.timestamp)}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                  {symptom.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Share Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="font-medium text-textPrimary mb-1">Generate PDF Report</div>
            <div className="text-sm text-textSecondary">Create a comprehensive health summary</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="font-medium text-textPrimary mb-1">Share Link</div>
            <div className="text-sm text-textSecondary">Create a secure shareable link</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'symptoms':
        return renderSymptoms();
      case 'reminders':
        return renderReminders();
      case 'records':
        return renderRecords();
      case 'summary':
        return renderSummary();
      default:
        return renderDashboard();
    }
  };

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {notification && (
        <div className="mb-6">
          <NotificationBanner
            variant={notification.variant}
            title={notification.title}
            message={notification.message}
            onDismiss={() => setNotification(null)}
          />
        </div>
      )}
      {renderContent()}
    </AppShell>
  );
}
