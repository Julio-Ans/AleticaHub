// Toast notification component for user feedback
'use client';

import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-400" />;
      case 'error':
        return <FaExclamationCircle className="text-red-400" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-400" />;
      case 'info':
        return <FaInfoCircle className="text-blue-400" />;
      default:
        return <FaInfoCircle className="text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900 border-green-600';
      case 'error':
        return 'bg-red-900 border-red-600';
      case 'warning':
        return 'bg-yellow-900 border-yellow-600';
      case 'info':
        return 'bg-blue-900 border-blue-600';
      default:
        return 'bg-gray-900 border-gray-600';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${getBackgroundColor()} border rounded-lg p-4 shadow-lg max-w-sm animate-slide-in-right`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="text-white text-sm flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
}
