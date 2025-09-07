'use client';

import { useState } from 'react';
import { Plus, Clock, Pill, Calendar, Activity } from 'lucide-react';
import { SymptomFormData, ReminderFormData } from '@/lib/types';

interface SymptomFormProps {
  variant: 'symptom';
  onSubmit: (data: SymptomFormData) => void;
  onCancel?: () => void;
}

interface ReminderFormProps {
  variant: 'medication' | 'appointment';
  onSubmit: (data: ReminderFormData) => void;
  onCancel?: () => void;
}

type HealthInputFormProps = SymptomFormProps | ReminderFormProps;

export function HealthInputForm({ variant, onSubmit, onCancel }: HealthInputFormProps) {
  const [symptomData, setSymptomData] = useState<SymptomFormData>({
    symptom: '',
    severity: 'low',
    duration: '',
    notes: '',
    triggers: [],
  });

  const [reminderData, setReminderData] = useState<ReminderFormData>({
    type: variant === 'medication' ? 'medication' : 'appointment',
    title: '',
    details: '',
    time: '',
    frequency: 'daily',
  });

  const [triggerInput, setTriggerInput] = useState('');

  const handleSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomData.symptom.trim()) return;
    if (variant === 'symptom') {
      (onSubmit as (data: SymptomFormData) => void)(symptomData);
    }
    setSymptomData({
      symptom: '',
      severity: 'low',
      duration: '',
      notes: '',
      triggers: [],
    });
  };

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderData.title.trim() || !reminderData.time) return;
    if (variant === 'medication' || variant === 'appointment') {
      (onSubmit as (data: ReminderFormData) => void)(reminderData);
    }
    setReminderData({
      type: variant === 'medication' ? 'medication' : 'appointment',
      title: '',
      details: '',
      time: '',
      frequency: 'daily',
    });
  };

  const addTrigger = () => {
    if (triggerInput.trim() && !symptomData.triggers.includes(triggerInput.trim())) {
      setSymptomData(prev => ({
        ...prev,
        triggers: [...prev.triggers, triggerInput.trim()]
      }));
      setTriggerInput('');
    }
  };

  const removeTrigger = (trigger: string) => {
    setSymptomData(prev => ({
      ...prev,
      triggers: prev.triggers.filter(t => t !== trigger)
    }));
  };

  if (variant === 'symptom') {
    return (
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textPrimary">Log Symptom</h3>
            <p className="text-sm text-textSecondary">Track your symptoms and patterns</p>
          </div>
        </div>

        <form onSubmit={handleSymptomSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Symptom *
            </label>
            <input
              type="text"
              value={symptomData.symptom}
              onChange={(e) => setSymptomData(prev => ({ ...prev, symptom: e.target.value }))}
              placeholder="e.g., Headache, Fatigue, Nausea"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Severity *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSymptomData(prev => ({ ...prev, severity: level }))}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    symptomData.severity === level
                      ? level === 'low'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : level === 'medium'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                      level === 'low' ? 'bg-green-500' :
                      level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium capitalize">{level}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Duration
            </label>
            <input
              type="text"
              value={symptomData.duration}
              onChange={(e) => setSymptomData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 2 hours, All day, 30 minutes"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Triggers
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={triggerInput}
                onChange={(e) => setTriggerInput(e.target.value)}
                placeholder="e.g., Stress, Weather, Food"
                className="input-field flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrigger())}
              />
              <button
                type="button"
                onClick={addTrigger}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {symptomData.triggers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {symptomData.triggers.map((trigger) => (
                  <span
                    key={trigger}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {trigger}
                    <button
                      type="button"
                      onClick={() => removeTrigger(trigger)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Notes
            </label>
            <textarea
              value={symptomData.notes}
              onChange={(e) => setSymptomData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional details about this symptom..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <button type="submit" className="btn-primary flex-1">
              Log Symptom
            </button>
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          variant === 'medication' 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500'
        }`}>
          {variant === 'medication' ? (
            <Pill className="w-5 h-5 text-white" />
          ) : (
            <Calendar className="w-5 h-5 text-white" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-textPrimary">
            {variant === 'medication' ? 'Add Medication Reminder' : 'Add Appointment Reminder'}
          </h3>
          <p className="text-sm text-textSecondary">
            {variant === 'medication' ? 'Never miss your medications' : 'Stay on top of your appointments'}
          </p>
        </div>
      </div>

      <form onSubmit={handleReminderSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            {variant === 'medication' ? 'Medication Name' : 'Appointment Title'} *
          </label>
          <input
            type="text"
            value={reminderData.title}
            onChange={(e) => setReminderData(prev => ({ ...prev, title: e.target.value }))}
            placeholder={variant === 'medication' ? 'e.g., Aspirin 100mg' : 'e.g., Cardiology Checkup'}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Time *
          </label>
          <input
            type="time"
            value={reminderData.time}
            onChange={(e) => setReminderData(prev => ({ ...prev, time: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Frequency
          </label>
          <select
            value={reminderData.frequency}
            onChange={(e) => setReminderData(prev => ({ 
              ...prev, 
              frequency: e.target.value as 'once' | 'daily' | 'weekly' | 'monthly' 
            }))}
            className="input-field"
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Details
          </label>
          <textarea
            value={reminderData.details}
            onChange={(e) => setReminderData(prev => ({ ...prev, details: e.target.value }))}
            placeholder={variant === 'medication' 
              ? 'Dosage instructions, with food, etc.' 
              : 'Doctor name, location, preparation needed, etc.'
            }
            rows={3}
            className="input-field resize-none"
          />
        </div>

        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex-1">
            <Clock className="w-4 h-4 mr-2" />
            Set Reminder
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
