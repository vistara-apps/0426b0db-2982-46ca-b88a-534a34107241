'use client';

import { useState } from 'react';
import { FileText, Image, Download, Trash2, Eye, Calendar } from 'lucide-react';
import { HealthRecord } from '@/lib/types';
import { formatDate, getFileIcon } from '@/lib/utils';

interface HealthRecordCardProps {
  record: HealthRecord;
  variant?: 'document' | 'image';
  onDelete?: (recordId: string) => void;
  onView?: (record: HealthRecord) => void;
}

export function HealthRecordCard({ 
  record, 
  variant = 'document', 
  onDelete, 
  onView 
}: HealthRecordCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(record.recordId);
    } catch (error) {
      console.error('Failed to delete record:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab-result':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'prescription':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'vaccination':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'note':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'image':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lab-result':
        return 'Lab Result';
      case 'prescription':
        return 'Prescription';
      case 'vaccination':
        return 'Vaccination';
      case 'note':
        return 'Medical Note';
      case 'image':
        return 'Medical Image';
      default:
        return 'Document';
    }
  };

  return (
    <div className="glass-card p-4 rounded-lg hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            variant === 'image' 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}>
            {variant === 'image' ? (
              <Image className="w-6 h-6 text-white" />
            ) : (
              <FileText className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-textPrimary truncate">
              {record.fileName}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(record.documentType)}`}>
                <span className="mr-1">{getFileIcon(record.documentType)}</span>
                {getTypeLabel(record.documentType)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onView && (
            <button
              onClick={() => onView(record)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => window.open(record.fileUrl, '_blank')}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-textSecondary">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>Uploaded {formatDate(record.uploadTimestamp)}</span>
        </div>
      </div>

      {record.tags && record.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {record.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
