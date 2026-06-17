import React, { createContext, useState, useEffect } from 'react'
import api from '../../services/api.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [activeOrg, setActiveOrg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      if (token) {
        localStorage.setItem('token', token)
        try {
          const response = await api.get('/profile/')
          const profile = response.data
          setUser({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: profile.role
          })
          setActiveOrg(profile.organization)
        } catch (e) {
          console.error("Error al cargar perfil desde el backend:", e)
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
          setActiveOrg(null)
        }
      } else {
        localStorage.removeItem('token')
        setUser(null)
        setActiveOrg(null)
      }
      setLoading(false)
    }

    fetchUserData()
  }, [token])

  const login = (newToken) => {
    setToken(newToken)
  }

  const logout = () => {
    setToken(null)
  }

  const refreshOrg = async () => {
    if (token) {
      try {
        const response = await api.get('/profile/')
        setActiveOrg(response.data.organization)
      } catch (e) {
        console.error("Error al actualizar organización activa:", e)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, activeOrg, setActiveOrg, refreshOrg, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

