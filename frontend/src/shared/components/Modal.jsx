import React from 'react'
import Button from './Button.jsx'

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar', 
  onConfirm,
  showActions = true 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 overflow-hidden transform transition-all">
        <h3 className="text-lg font-bold text-slate-950 mb-3">{title}</h3>
        <div className="text-sm text-slate-600 mb-6">{children}</div>

        {showActions && (
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant="primary" onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
