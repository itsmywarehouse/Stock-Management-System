import React from 'react';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { AlertType } from '../../types';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const alertStyles = {
  success: 'bg-green-50 text-green-800 border-green-300',
  error: 'bg-red-50 text-red-800 border-red-300',
  warning: 'bg-amber-50 text-amber-800 border-amber-300',
  info: 'bg-blue-50 text-blue-800 border-blue-300',
};

const iconMap = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div className={`${alertStyles[type]} flex items-center p-4 mb-4 rounded-md border`}>
      <div className="flex-shrink-0 mr-3">
        {iconMap[type]}
      </div>
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      {onClose && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};