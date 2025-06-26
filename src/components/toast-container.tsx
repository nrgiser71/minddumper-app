'use client'

import React from 'react'
import { useToast, type Toast } from './toast-context'

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast()

  const getToastStyles = (type: Toast['type']) => {
    const baseStyles = 'toast-item'
    switch (type) {
      case 'success':
        return `${baseStyles} toast-success`
      case 'error':
        return `${baseStyles} toast-error`
      case 'info':
      default:
        return `${baseStyles} toast-info`
    }
  }

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'info':
      default:
        return 'ℹ'
    }
  }

  return (
    <div className={getToastStyles(toast.type)}>
      <div className="toast-icon">
        {getIcon(toast.type)}
      </div>
      <div className="toast-message">
        {toast.message}
      </div>
      <button 
        className="toast-close"
        onClick={() => removeToast(toast.id)}
        aria-label="Sluiten"
      >
        ×
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}