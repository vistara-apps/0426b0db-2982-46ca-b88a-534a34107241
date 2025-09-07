'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Clock, Pill, Calendar, Activity, AlertCircle, CheckCircle, X } from 'lucide-react';
import { SymptomFormData, ReminderFormData } from '@/lib/types';

interface HealthInputFormProps {
  variant: 'symptom' | 'medication' | 'appointment';
  onSubmit: (data: SymptomFormData | ReminderFormData) => void;
  onCancel?: () => void;
}

interface FormErrors {
  symptom?: string;
  title?: string;
  time?: string;
  duration?: string;
}

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on mount
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // Validation functions
  const validateSymptomForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!symptomData.symptom.trim()) {
      newErrors.symptom = 'Symptom name is required';
    } else if (symptomData.symptom.length < 2) {
      newErrors.symptom = 'Symptom name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReminderForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!reminderData.title.trim()) {
      newErrors.title = `${variant === 'medication' ? 'Medication' : 'Appointment'} name is required`;
    } else if (reminderData.title.length < 2) {
      newErrors.title = 'Name must be at least 2 characters';
    }

    if (!reminderData.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSymptomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateSymptomForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(symptomData);
      setSymptomData({
        symptom: '',
        severity: 'low',
        duration: '',
        notes: '',
        triggers: [],
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error('Failed to submit symptom:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateReminderForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(reminderData);
      setReminderData({
        type: variant === 'medication' ? 'medication' : 'appointment',
        title: '',
        details: '',
        time: '',
        frequency: 'daily',
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error('Failed to submit reminder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate on blur for immediate feedback
    if (variant === 'symptom') {
      validateSymptomForm();
    } else {
      validateReminderForm();
    }
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
      <div className="glass-card p-6 rounded-lg animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-error-500 to-error-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-textPrimary">Log Symptom</h3>
              <p className="text-sm text-textSecondary">Track your symptoms and patterns</p>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-icon text-textSecondary hover:text-textPrimary"
              aria-label="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSymptomSubmit} className="space-y-6" noValidate>
          <div>
            <label 
              htmlFor="symptom-input"
              className="block text-sm font-medium text-textPrimary mb-2"
            >
              Symptom *
            </label>
            <div className="relative">
              <input
                id="symptom-input"
                ref={firstInputRef}
                type="text"
                value={symptomData.symptom}
                onChange={(e) => setSymptomData(prev => ({ ...prev, symptom: e.target.value }))}
                onBlur={() => handleFieldBlur('symptom')}
                placeholder="e.g., Headache, Fatigue, Nausea"
                className={`input-field ${
                  errors.symptom && touched.symptom ? 'input-field-error' : 
                  symptomData.symptom && !errors.symptom ? 'input-field-success' : ''
                }`}
                required
                aria-invalid={errors.symptom ? 'true' : 'false'}
                aria-describedby={errors.symptom ? 'symptom-error' : 'symptom-help'}
              />
              {symptomData.symptom && !errors.symptom && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success-500" />
              )}
            </div>
            {errors.symptom && touched.symptom && (
              <div id="symptom-error" className="mt-2 flex items-center space-x-2 text-error-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.symptom}</span>
              </div>
            )}
            <p id="symptom-help" className="mt-1 text-xs text-textTertiary">
              Enter the main symptom you're experiencing
            </p>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-textPrimary mb-2">
              Severity *
            </legend>
            <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-labelledby="severity-legend">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSymptomData(prev => ({ ...prev, severity: level }))}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 focus-ring ${
                    symptomData.severity === level
                      ? level === 'low'
                        ? 'border-success-500 bg-success-50 text-success-700'
                        : level === 'medium'
                        ? 'border-warning-500 bg-warning-50 text-warning-700'
                        : 'border-error-500 bg-error-50 text-error-700'
                      : 'border-border bg-white hover:border-borderHover'
                  }`}
                  role="radio"
                  aria-checked={symptomData.severity === level}
                  aria-label={`Severity level: ${level}`}
                >
                  <div className="text-center">
                    <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                      level === 'low' ? 'bg-success-500' :
                      level === 'medium' ? 'bg-warning-500' : 'bg-error-500'
                    }`} aria-hidden="true" />
                    <span className="text-sm font-medium capitalize">{level}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-textTertiary">
              Rate how severe this symptom feels to you
            </p>
          </fieldset>

          <div>
            <label htmlFor="duration-input" className="block text-sm font-medium text-textPrimary mb-2">
              Duration
            </label>
            <input
              id="duration-input"
              type="text"
              value={symptomData.duration}
              onChange={(e) => setSymptomData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 2 hours, All day, 30 minutes"
              className="input-field"
              aria-describedby="duration-help"
            />
            <p id="duration-help" className="mt-1 text-xs text-textTertiary">
              How long did this symptom last?
            </p>
          </div>

          <div>
            <label htmlFor="trigger-input" className="block text-sm font-medium text-textPrimary mb-2">
              Triggers
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                id="trigger-input"
                type="text"
                value={triggerInput}
                onChange={(e) => setTriggerInput(e.target.value)}
                placeholder="e.g., Stress, Weather, Food"
                className="input-field flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTrigger();
                  }
                }}
                aria-describedby="triggers-help"
              />
              <button
                type="button"
                onClick={addTrigger}
                className="btn-secondary px-4 py-2"
                aria-label="Add trigger"
                disabled={!triggerInput.trim()}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {symptomData.triggers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2" role="list" aria-label="Added triggers">
                {symptomData.triggers.map((trigger, index) => (
                  <span
                    key={trigger}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm badge-primary"
                    role="listitem"
                  >
                    {trigger}
                    <button
                      type="button"
                      onClick={() => removeTrigger(trigger)}
                      className="ml-2 text-primary-600 hover:text-primary-800 focus-ring rounded-full p-0.5"
                      aria-label={`Remove ${trigger} trigger`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p id="triggers-help" className="text-xs text-textTertiary">
              Add potential triggers that might have caused this symptom
            </p>
          </div>

          <div>
            <label htmlFor="notes-input" className="block text-sm font-medium text-textPrimary mb-2">
              Notes
            </label>
            <textarea
              id="notes-input"
              value={symptomData.notes}
              onChange={(e) => setSymptomData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional details about this symptom..."
              rows={3}
              className="textarea-field"
              aria-describedby="notes-help"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <p id="notes-help" className="text-xs text-textTertiary">
                Any additional details that might be helpful
              </p>
              <span className="text-xs text-textTertiary">
                {symptomData.notes.length}/500
              </span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Log Symptom</span>
                </>
              )}
            </button>
            {onCancel && (
              <button 
                type="button" 
                onClick={onCancel} 
                className="btn-secondary"
                disabled={isSubmitting}
              >
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
