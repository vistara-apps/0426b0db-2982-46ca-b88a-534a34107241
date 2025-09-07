'use client';

import { useState } from 'react';
import { AlertCircle, Info, X, CheckCircle } from 'lucide-react';

interface NotificationBannerProps {
  variant: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function NotificationBanner({ 
  variant, 
  title, 
  message, 
  onDismiss, 
  action 
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-600',
          IconComponent: Info,
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-600',
          IconComponent: AlertCircle,
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: 'text-green-600',
          IconComponent: CheckCircle,
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-600',
          IconComponent: AlertCircle,
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: 'text-gray-600',
          IconComponent: Info,
        };
    }
  };

  const styles = getVariantStyles();
  const { IconComponent } = styles;

  return (
    <div className={`rounded-lg border p-4 ${styles.container} animate-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-start space-x-3">
        <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.icon}`} />
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium mb-1">{title}</h4>
          <p className="text-sm opacity-90">{message}</p>
          
          {action && (
            <button
              onClick={action.onClick}
              className="mt-3 text-sm font-medium underline hover:no-underline transition-all duration-200"
            >
              {action.label}
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors ${styles.icon}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
