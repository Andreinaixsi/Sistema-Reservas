import React, { useState } from 'react'
import Button from '../../../shared/components/Button.jsx'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Por favor, complete todos los campos.')
      return
    }
    setError('')
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={error} />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="ejemplo@correo.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" variant="primary" className="w-full">
        Iniciar Sesión
      </Button>
    </form>
  )
}
