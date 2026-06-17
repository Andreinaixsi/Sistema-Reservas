import React from 'react'

export default function Button({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled = false, 
  className = '' 
}) {
  const baseStyles = 'px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
