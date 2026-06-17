import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  LogOut, 
  Home, 
  Globe, 
  Clock, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  UserCheck, 
  Copy, 
  RefreshCw,
  Search,
  Sliders
} from 'lucide-react'

import { useAuth } from './shared/hooks/useAuth.js'
import LoginForm from './features/auth/components/LoginForm.jsx'
import ReservationForm from './features/reservations/components/ReservationForm.jsx'
import ResourceCard from './features/resources/components/ResourceCard.jsx'
import Button from './shared/components/Button.jsx'
import ErrorMessage from './shared/components/ErrorMessage.jsx'
import Modal from './shared/components/Modal.jsx'

import { authService } from './services/authService.js'
import { resourceService } from './services/resourceService.js'
import { reservationService } from './services/reservationService.js'
import { orgService } from './services/orgService.js'

// --- LAYOUT PRINCIPAL ---
function MainLayout({ children }) {
  const { user, activeOrg, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const labelSingular = activeOrg?.resource_label_singular || 'Recurso'
  const labelPlural = activeOrg?.resource_label_plural || 'Recursos'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary-600" />
          <span className="font-bold text-lg bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">ReservaFacil</span>
          {activeOrg && (
            <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 font-semibold px-2 py-0.5 rounded-full ml-2">
              {activeOrg.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-800">{user?.full_name}</span>
            <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wider">
              {user?.role === 'admin' ? 'Administrador' : 'Miembro'}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all active-scale"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
          
          {/* Hamburger button for mobile */}
          <button 
            className="p-2 md:hidden hover:bg-slate-100 rounded-xl transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar (Desktop) */}
        <aside className="w-64 bg-white border-r border-slate-200/80 p-6 hidden md:block">
          <div className="space-y-8 sticky top-24">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Principal</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/dashboard" className="flex items-center gap-3 text-slate-700 hover:bg-slate-50 hover:text-primary-600 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active-scale">
                    <Home className="w-4 h-4" /> Dashboard
                  </Link>
                </li>
                {activeOrg && (
                  <>
                    <li>
                      <Link to="/resources" className="flex items-center gap-3 text-slate-700 hover:bg-slate-50 hover:text-primary-600 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active-scale">
                        <Calendar className="w-4 h-4" /> {labelPlural}
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-reservations" className="flex items-center gap-3 text-slate-700 hover:bg-slate-50 hover:text-primary-600 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active-scale">
                        <Clock className="w-4 h-4" /> Mis Reservas
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {activeOrg && user?.role === 'admin' && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Administración</h3>
                <ul className="space-y-1.5">
                  <li>
                    <Link to="/admin/resources" className="flex items-center gap-3 text-slate-700 hover:bg-slate-50 hover:text-primary-600 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active-scale">
                      <Sliders className="w-4 h-4" /> Gestionar {labelPlural}
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/settings" className="flex items-center gap-3 text-slate-700 hover:bg-slate-50 hover:text-primary-600 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active-scale">
                      <Settings className="w-4 h-4" /> Reglas de Reserva
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/members" className="flex items-center gap-3 text-slate-700 hover:bg-slate-50 hover:text-primary-600 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active-scale">
                      <Users className="w-4 h-4" /> Miembros
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 bg-white h-full p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
              <div className="font-bold text-slate-800 text-lg mb-4">Menú de Navegación</div>
              <ul className="space-y-3">
                <li><Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-primary-600 py-1.5">Dashboard</Link></li>
                {activeOrg && (
                  <>
                    <li><Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-primary-600 py-1.5">{labelPlural}</Link></li>
                    <li><Link to="/my-reservations" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-primary-600 py-1.5">Mis Reservas</Link></li>
                  </>
                )}
                {activeOrg && user?.role === 'admin' && (
                  <>
                    <li className="border-t border-slate-100 my-2 pt-2"></li>
                    <li><Link to="/admin/resources" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-primary-600 py-1.5">Gestionar {labelPlural}</Link></li>
                    <li><Link to="/admin/settings" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-primary-600 py-1.5">Reglas de Reserva</Link></li>
                    <li><Link to="/admin/members" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-primary-600 py-1.5">Miembros</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  )
}

// --- LANDING PAGE ---
function HomeView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/20 flex flex-col justify-center items-center p-6 text-center">
      <div className="max-w-3xl space-y-6 bg-white p-8 md:p-12 rounded-3xl border border-slate-200/50 shadow-xl/10 shadow-slate-200/50">
        <div className="inline-flex p-3 bg-primary-50 rounded-2xl border border-primary-100 text-primary-600 mb-2">
          <Calendar className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Gestiona reservas multi-organización <br />
          <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">sin conflictos de horarios</span>
        </h1>
        <p className="max-w-xl mx-auto text-slate-600 text-base md:text-lg">
          La plataforma unificada y premium para reservar salas, canchas, aulas y recursos compartidos de forma controlada y eficiente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/login" className="px-8 py-3 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 hover:shadow-xl font-semibold transition active-scale">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 font-semibold transition active-scale">
            Registrar Cuenta
          </Link>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-6 justify-center text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Multi-Tenant Aislado</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Reglas Personalizadas</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Control de Conflictos</span>
        </div>
      </div>
    </div>
  )
}

// --- LOGIN VIEW ---
function LoginView() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLoginSubmit = async ({ email, password }) => {
    setLoading(true)
    setError('')
    try {
      const data = await authService.login(email, password)
      login(data.access_token)
      navigate('/dashboard')
    } catch (e) {
      setError(e.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-150 shadow-md">
        <div className="text-center mb-6">
          <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-slate-900">Iniciar Sesión</h2>
          <p className="text-xs text-slate-500 mt-1">Ingresa tus credenciales para acceder a tu organización</p>
        </div>

        {error && <ErrorMessage message={error} className="mb-4" />}

        <LoginForm onSubmit={handleLoginSubmit} />

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600 space-y-2">
          <div>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary-600 font-bold hover:underline">
              Regístrate aquí
            </Link>
          </div>
          <div>
            ¿Quieres registrar una nueva entidad?{' '}
            <Link to="/register-org" className="text-primary-600 font-bold hover:underline">
              Crea una organización
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- REGISTER VIEW ---
function RegisterView() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!fullName || !email || !password) {
      setError('Por favor, complete todos los campos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authService.register(email, password, fullName)
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-150 shadow-md">
        <div className="text-center mb-6">
          <UserCheck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-slate-900">Registrar Cuenta</h2>
          <p className="text-xs text-slate-500 mt-1">Crea tu cuenta de miembro independiente</p>
        </div>

        {error && <ErrorMessage message={error} className="mb-4" />}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <input 
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="Juan Pérez"
            />
          </div>
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
              placeholder="Min. 6 caracteres"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            Registrarse
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 font-bold hover:underline">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

// --- REGISTER ORG VIEW ---
function RegisterOrgView() {
  const navigate = useNavigate()
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [orgType, setOrgType] = useState('condominio')
  const [singular, setSingular] = useState('Área Común')
  const [plural, setPlural] = useState('Áreas Comunes')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegisterOrg = async (e) => {
    e.preventDefault()
    if (!adminName || !adminEmail || !adminPassword || !orgName) {
      setError('Por favor, complete todos los campos obligatorios.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authService.registerOrg(
        { email: adminEmail, password: adminPassword, fullName: adminName },
        { name: orgName, type: orgType, resourceLabelSingular: singular, resourceLabelPlural: plural }
      )
      // Redirigir a login
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Error al registrar la organización')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 py-12">
      <div className="max-w-lg w-full bg-white p-8 rounded-3xl border border-slate-150 shadow-md">
        <div className="text-center mb-6">
          <Globe className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-slate-900">Registrar Organización</h2>
          <p className="text-xs text-slate-500 mt-1">Crea tu organización y tu cuenta de administrador simultáneamente</p>
        </div>

        {error && <ErrorMessage message={error} className="mb-4" />}

        <form onSubmit={handleRegisterOrg} className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Datos del Administrador</h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Completo *</label>
              <input 
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                placeholder="Admin Las Palmeras"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                <input 
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                  placeholder="admin@correo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contraseña *</label>
                <input 
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                  placeholder="Min. 6 caracteres"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Datos de la Organización</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre de la Organización *</label>
                <input 
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                  placeholder="Condominio Las Palmeras"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tipo de Entidad</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                >
                  <option value="condominio">Condominio / Residencial</option>
                  <option value="universidad">Universidad / Colegio</option>
                  <option value="empresa">Empresa / Oficina</option>
                  <option value="centro_deportivo">Centro Deportivo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nomenclatura Singular</label>
                <input 
                  type="text"
                  value={singular}
                  onChange={(e) => setSingular(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                  placeholder="Ej: Cancha, Aula, Sala"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nomenclatura Plural</label>
                <input 
                  type="text"
                  value={plural}
                  onChange={(e) => setPlural(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                  placeholder="Ej: Canchas, Aulas, Salas"
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
            Registrar Organización
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 font-bold hover:underline">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

// --- DASHBOARD VIEW ---
// --- DASHBOARD VIEW ---
function DashboardView() {
  const { user, activeOrg, refreshOrg } = useAuth()
  const [upcoming, setUpcoming] = useState([])
  const [resources, setResources] = useState([])
  
  // Onboarding state
  const [inviteCode, setInviteCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [joinSuccess, setJoinSuccess] = useState('')

  const labelPlural = activeOrg?.resource_label_plural || 'Recursos'

  useEffect(() => {
    if (!activeOrg) return
    const loadData = async () => {
      try {
        const allRes = await resourceService.list()
        const allBookings = await reservationService.listMine()
        
        setResources(allBookings)
        // Filtrar próximas reservas activas
        const filtered = allBookings
          .filter(b => b.status === 'active')
          .map(b => {
            const res = allRes.find(r => r.id === b.resource_id)
            return {
              ...b,
              resourceName: res?.name || 'Recurso'
            }
          })
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
        
        setUpcoming(filtered)
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err)
      }
    }
    loadData()
  }, [activeOrg])

  const handleJoinSubmit = async (e) => {
    e.preventDefault()
    if (!inviteCode.trim()) return
    setJoining(true)
    setJoinError('')
    setJoinSuccess('')
    try {
      const data = await orgService.joinByInviteCode(inviteCode)
      setJoinSuccess(`¡Te has unido con éxito a la organización ${data.name}!`)
      setInviteCode('')
      // Actualizar el perfil en AuthContext
      await refreshOrg()
    } catch (err) {
      setJoinError(err.message || 'Código de invitación inválido o inactivo')
    } finally {
      setJoining(false)
    }
  }

  // Si el usuario no pertenece a ninguna organización, mostrar pantalla de onboarding
  if (!activeOrg) {
    return (
      <div className="max-w-md mx-auto my-12 space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <Globe className="w-12 h-12 text-primary-600 mx-auto" />
          <h2 className="text-3xl font-extrabold text-slate-800">¡Te damos la bienvenida!</h2>
          <p className="text-sm text-slate-500">
            Para comenzar a reservar espacios y recursos, necesitas unirte a una organización existente.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-lg">Ingresar Código de Invitación</h3>
            <p className="text-xs text-slate-400">Pídele el código de acceso al administrador de tu entidad.</p>
          </div>

          {joinSuccess && (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-xl text-xs flex gap-2 items-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold">{joinSuccess}</span>
            </div>
          )}

          {joinError && (
            <div className="bg-red-50 border border-red-205 text-red-850 p-4 rounded-xl text-xs flex gap-2 items-center">
              <AlertTriangle className="w-5 h-5 text-red-650" />
              <span className="font-semibold">{joinError}</span>
            </div>
          )}

          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Código de 8 caracteres
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Ej: PALM2026"
                maxLength={12}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-lg font-bold tracking-widest focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition uppercase text-slate-800"
                disabled={joining}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" disabled={joining}>
              {joining ? 'Procesando...' : 'Unirse a la Organización'}
            </Button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500">
          ¿Deseas crear una nueva organización?{' '}
          <Link to="/register-org" className="text-primary-600 font-bold hover:underline">
            Registra una entidad nueva
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-8 rounded-3xl text-white shadow-md">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-1">¡Hola, {user?.full_name}!</h2>
        <p className="text-white/80 text-sm md:text-base">
          Bienvenido al panel de control de <strong>{activeOrg?.name}</strong>. Aquí puedes gestionar tus reservas de {labelPlural.toLowerCase()}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Reservas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Próximas Reservas</h3>
            <Link to="/resources" className="text-xs text-primary-600 font-bold hover:underline">Ver todos los espacios</Link>
          </div>
          
          {upcoming.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center shadow-sm py-12">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 text-sm mb-1">No tienes reservas activas</h4>
              <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">Explora los espacios disponibles y agenda tu primer horario sin conflictos.</p>
              <Link to="/resources" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold shadow hover:bg-primary-700 transition active-scale inline-block">
                Reservar un Espacio
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(b => (
                <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                      {b.resourceName}
                    </span>
                    <div className="font-bold text-slate-800 text-sm pt-1">
                      {new Date(b.start_time).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.start_time.split('T')[1].substring(0, 5)} - {b.end_time.split('T')[1].substring(0, 5)}
                    </div>
                  </div>
                  <Link to="/my-reservations" className="text-xs text-slate-400 hover:text-red-500 font-semibold border border-slate-150 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-100 transition">
                    Cancelar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acceso Rápido / Información */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Información de la Entidad</h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">Tipo de Organización:</span>
              <span className="font-semibold text-slate-800 uppercase">{activeOrg?.type}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">Zona Horaria:</span>
              <span className="font-semibold text-slate-800">{activeOrg?.settings?.timezone}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">Rango Horario:</span>
              <span className="font-semibold text-slate-800">
                {activeOrg?.settings?.allowed_start_time.substring(0, 5)} - {activeOrg?.settings?.allowed_end_time.substring(0, 5)}
              </span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-slate-400">Anticipación Máxima:</span>
              <span className="font-semibold text-slate-800">{activeOrg?.settings?.max_days_ahead} días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- RESOURCES LIST VIEW ---
function ResourcesListView() {
  const { activeOrg } = useAuth()
  const [list, setList] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const labelSingular = activeOrg?.resource_label_singular || 'Recurso'
  const labelPlural = activeOrg?.resource_label_plural || 'Recursos'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await resourceService.list()
      setList(data.filter(r => r.is_active))
      setLoading(false)
    }
    load()
  }, [])

  const filtered = list.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">{labelPlural} Disponibles</h2>
          <p className="text-xs text-slate-500">Selecciona un espacio para consultar su disponibilidad y realizar tu reserva</p>
        </div>
        
        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
            placeholder={`Buscar ${labelSingular.toLowerCase()}...`}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white border border-slate-100 rounded-2xl p-6 h-40 animate-pulse space-y-4">
              <div className="h-5 bg-slate-200 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3 pt-2"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 rounded-3xl text-center py-16 shadow-sm">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-sm mb-1">No se encontraron {labelPlural.toLowerCase()}</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">Ajusta los términos de búsqueda o recarga la página para verificar la disponibilidad.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(res => (
            <ResourceCard key={res.id} resource={{
              ...res,
              resource_label_singular: labelSingular
            }} />
          ))}
        </div>
      )}
    </div>
  )
}

// --- RESOURCE DETAIL & BOOKING VIEW ---
function ResourceDetailView() {
  const { id } = useParams()
  const { activeOrg } = useAuth()
  const navigate = useNavigate()
  
  const [resource, setResource] = useState(null)
  const [date, setDate] = useState('')
  const [availability, setAvailability] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const labelSingular = activeOrg?.resource_label_singular || 'Recurso'

  // Inicializar con la fecha de hoy en el timezone de la organización
  useEffect(() => {
    const today = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const formatted = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
    setDate(formatted)
  }, [])

  useEffect(() => {
    const loadResource = async () => {
      const list = await resourceService.list()
      const found = list.find(r => r.id === Number(id))
      setResource(found)
    }
    loadResource()
  }, [id])

  useEffect(() => {
    if (id && date) {
      const loadAvailability = async () => {
        const data = await reservationService.getAvailability(id, date)
        setAvailability(data)
      }
      loadAvailability()
    }
  }, [id, date])

  const handleReservationSubmit = async ({ startTime, endTime }) => {
    setSuccessMsg('')
    setErrorMsg('')
    try {
      // Registrar reserva en mockDb
      const startDateTimeStr = `${date}T${startTime}:00`
      const endDateTimeStr = `${date}T${endTime}:00`
      
      await reservationService.create({
        resource_id: Number(id),
        user_id: 102, // Vecino
        user_email: "vecino@example.com",
        start_time: startDateTimeStr,
        end_time: endDateTimeStr
      })
      
      setSuccessMsg('¡Reserva confirmada con éxito!')
      // Recargar disponibilidad
      const data = await reservationService.getAvailability(id, date)
      setAvailability(data)
    } catch (e) {
      setErrorMsg(e.message || 'Conflicto de reservas u horario inválido')
    }
  }

  // Generar slots visuales del día (ej: 08:00 a 22:00 en bloques de 1 hora)
  const renderTimeSlots = () => {
    if (!availability) return null
    const startHour = Number(availability.settings.allowed_start_time.split(':')[0])
    const endHour = Number(availability.settings.allowed_end_time.split(':')[0])
    
    const slots = []
    for (let h = startHour; h < endHour; h++) {
      const timeStrStart = `${String(h).padStart(2, '0')}:00`
      const timeStrEnd = `${String(h + 1).padStart(2, '0')}:00`
      
      // Verificar si hay cruce con alguna reserva ocupada
      const occupiedBy = availability.occupied.find(o => {
        return (timeStrStart < o.end && timeStrEnd > o.start)
      })

      slots.push(
        <div key={h} className={`p-4 rounded-xl border flex items-center justify-between text-xs transition ${
          occupiedBy 
            ? 'bg-red-50/70 border-red-150 text-red-800' 
            : 'bg-emerald-50/50 border-emerald-100 text-emerald-800 hover:bg-emerald-50 transition-all'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${occupiedBy ? 'text-red-500' : 'text-emerald-600'}`} />
            <span className="font-bold">{timeStrStart} - {timeStrEnd}</span>
          </div>
          <div>
            {occupiedBy ? (
              <span className="bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-md text-[10px]">
                Ocupado por {occupiedBy.user_email}
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-md text-[10px]">
                Disponible
              </span>
            )}
          </div>
        </div>
      )
    }
    return <div className="space-y-2 max-h-96 overflow-y-auto pr-1">{slots}</div>
  }

  if (!resource) return <div className="p-8 text-center text-slate-500">Cargando detalles...</div>

  return (
    <div className="space-y-6">
      <div>
        <Link to="/resources" className="text-xs text-primary-600 font-bold hover:underline">&larr; Volver al listado</Link>
        <h2 className="text-2xl font-extrabold text-slate-800 mt-2">{resource.name}</h2>
        <p className="text-xs text-slate-500 max-w-2xl">{resource.description || 'Sin descripción disponible.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Calendario / Disponibilidad */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" /> Disponibilidad Horaria
            </h3>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          {renderTimeSlots()}
        </div>

        {/* Formulario de Reserva */}
        <div className="lg:col-span-2 space-y-4">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-xl text-xs flex gap-3 items-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}
          {errorMsg && <ErrorMessage message={errorMsg} />}

          <ReservationForm 
            resource={{
              ...resource,
              resource_label_singular: labelSingular
            }}
            onSubmit={handleReservationSubmit}
            orgSettings={availability?.settings}
          />
        </div>
      </div>
    </div>
  )
}

// --- MY RESERVATIONS VIEW ---
function MyReservationsView() {
  const { activeOrg } = useAuth()
  const [list, setList] = useState([])
  const [resources, setResources] = useState([])
  const [cancellationTarget, setCancellationTarget] = useState(null)

  const labelSingular = activeOrg?.resource_label_singular || 'Recurso'

  const loadReservations = async () => {
    const allRes = await resourceService.list()
    const allBookings = await reservationService.listMine()
    
    setResources(allRes)
    setList(allBookings.map(b => {
      const res = allRes.find(r => r.id === b.resource_id)
      return {
        ...b,
        resourceName: res?.name || 'Recurso'
      }
    }))
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const handleCancelClick = (res) => {
    setCancellationTarget(res)
  }

  const handleConfirmCancel = async () => {
    if (cancellationTarget) {
      await reservationService.cancel(cancellationTarget.id)
      setCancellationTarget(null)
      loadReservations()
    }
  }

  const activeReservations = list.filter(b => b.status === 'active')
  const historicalReservations = list.filter(b => b.status === 'cancelled')

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Mis Reservas</h2>
        <p className="text-xs text-slate-500">Historial completo de tus asignaciones activas y canceladas</p>
      </div>

      {/* Reservas Activas */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-base border-l-4 border-primary-500 pl-3">Asignaciones Activas</h3>
        
        {activeReservations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center py-10 shadow-sm text-xs text-slate-400">
            No tienes reservas activas en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReservations.map(res => (
              <div key={res.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                      {res.resourceName}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                      Activa
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">
                    {new Date(res.start_time).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {res.start_time.split('T')[1].substring(0, 5)} - {res.end_time.split('T')[1].substring(0, 5)}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end">
                  <Button 
                    variant="danger" 
                    className="py-1 px-3 text-xs bg-red-50 text-red-600 border border-red-150 hover:bg-red-100 hover:text-red-700 font-semibold rounded-lg shadow-none active-scale"
                    onClick={() => handleCancelClick(res)}
                  >
                    Cancelar Reserva
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial / Canceladas */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-base border-l-4 border-slate-400 pl-3">Historial y Cancelaciones</h3>
        
        {historicalReservations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center py-10 shadow-sm text-xs text-slate-400">
            No cuentas con reservas canceladas o vencidas en tu historial.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="p-4">{labelSingular}</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Horario</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historicalReservations.map(res => (
                  <tr key={res.id} className="text-slate-600 hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">{res.resourceName}</td>
                    <td className="p-4">
                      {new Date(res.start_time).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      {res.start_time.split('T')[1].substring(0, 5)} - {res.end_time.split('T')[1].substring(0, 5)}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase text-[9px] border border-slate-200">
                        Cancelado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Cancelación */}
      <Modal
        isOpen={!!cancellationTarget}
        onClose={() => setCancellationTarget(null)}
        title="Cancelar Reserva"
        confirmText="Sí, Cancelar Reserva"
        cancelText="No, Mantener"
        onConfirm={handleConfirmCancel}
      >
        <p className="text-slate-600 text-xs">
          ¿Estás seguro de que deseas cancelar tu reserva para <strong>{cancellationTarget?.resourceName}</strong> programada para el día{' '}
          <strong>
            {cancellationTarget && new Date(cancellationTarget.start_time).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </strong>?
        </p>
        <p className="text-slate-400 text-[10px] mt-2 italic">
          Esta acción liberará el horario de forma inmediata y permitirá que otros miembros de la organización reserven este bloque.
        </p>
      </Modal>
    </div>
  )
}

// --- ADMIN - RESOURCES CRUD ---
function AdminResourcesView() {
  const { activeOrg } = useAuth()
  const [resources, setResources] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  
  // Campos del formulario
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [capacity, setCapacity] = useState('')

  const labelSingular = activeOrg?.resource_label_singular || 'Recurso'
  const labelPlural = activeOrg?.resource_label_plural || 'Recursos'

  const loadResources = async () => {
    const list = await resourceService.list()
    setResources(list)
  }

  useEffect(() => {
    loadResources()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingResource(null)
    setName('')
    setDescription('')
    setCapacity('')
    setModalOpen(true)
  }

  const handleOpenEditModal = (res) => {
    setEditingResource(res)
    setName(res.name)
    setDescription(res.description || '')
    setCapacity(res.capacity || '')
    setModalOpen(true)
  }

  const handleSaveResource = async () => {
    if (!name) return

    if (editingResource) {
      // Editar
      await resourceService.update(editingResource.id, {
        name,
        description,
        capacity: capacity ? Number(capacity) : null
      })
    } else {
      // Crear
      await resourceService.create({
        name,
        description,
        capacity: capacity ? Number(capacity) : null,
        is_active: true
      })
    }
    
    setModalOpen(false)
    loadResources()
  }

  const handleDeleteResource = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar este ${labelSingular.toLowerCase()}?`)) {
      await resourceService.delete(id)
      loadResources()
    }
  }

  const handleToggleActive = async (res) => {
    await resourceService.update(res.id, { is_active: !res.is_active })
    loadResources()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Gestionar {labelPlural}</h2>
          <p className="text-xs text-slate-500">Crea, edita o desactiva las salas y equipamientos de tu organización</p>
        </div>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Crear {labelSingular}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {resources.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No hay {labelPlural.toLowerCase()} creados.</div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="p-4">Nombre</th>
                <th className="p-4">Capacidad</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {resources.map(res => (
                <tr key={res.id} className="text-slate-600 hover:bg-slate-50/50">
                  <td className="p-4">
                    <span className="font-bold text-slate-800 block">{res.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{res.description || 'Sin descripción'}</span>
                  </td>
                  <td className="p-4 font-semibold">{res.capacity || 'Ilimitada'}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleActive(res)}
                      className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase border transition ${
                        res.is_active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      {res.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenEditModal(res)}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteResource(res.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Crear / Editar */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingResource ? `Editar ${labelSingular}` : `Crear ${labelSingular}`}
        onConfirm={handleSaveResource}
        confirmText="Guardar"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre *</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
              placeholder="Ej: Salón de Eventos"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs h-20 resize-none"
              placeholder="Ubicación, equipamiento, etc."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Capacidad Máxima</label>
            <input 
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
              placeholder="Ej: 50"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

// --- ADMIN - MEMBERS VIEW ---
function AdminMembersView() {
  const { activeOrg, refreshOrg } = useAuth()
  const [members, setMembers] = useState([])
  const [emailToInvite, setEmailToInvite] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)

  const loadMembers = async () => {
    if (!activeOrg?.id) return
    try {
      const list = await orgService.listMembers(activeOrg.id)
      setMembers(list)
    } catch (err) {
      setError(err.message || 'Error al cargar miembros.')
    }
  }

  useEffect(() => {
    if (activeOrg?.id) {
      loadMembers()
    }
  }, [activeOrg?.id])

  const handleInvite = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!emailToInvite || !activeOrg?.id) return

    try {
      await orgService.addMember(activeOrg.id, emailToInvite)
      setSuccess(`¡Usuario ${emailToInvite} agregado con éxito!`)
      setEmailToInvite('')
      loadMembers()
    } catch (err) {
      setError(err.message || 'Error al agregar miembro.')
    }
  }

  const handleRegenerateCode = async () => {
    if (!activeOrg?.id) return
    if (window.confirm("¿Seguro de regenerar el código? El código anterior quedará inválido de inmediato.")) {
      try {
        await orgService.regenerateInviteCode(activeOrg.id)
        refreshOrg()
        setSuccess("Código de invitación regenerado correctamente.")
      } catch (err) {
        setError(err.message || 'Error al regenerar código.')
      }
    }
  }

  const handleToggleCode = async (e) => {
    if (!activeOrg?.id) return
    try {
      await orgService.toggleInviteCode(activeOrg.id, e.target.checked)
      refreshOrg()
    } catch (err) {
      setError(err.message || 'Error al modificar estado del código.')
    }
  }

  const copyToClipboard = () => {
    if (activeOrg?.invite_code) {
      navigator.clipboard.writeText(activeOrg.invite_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Miembros de la Organización</h2>
        <p className="text-xs text-slate-500">Administra los usuarios pertenecientes a la organización y configura los métodos de acceso autónomo</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-xl text-xs flex gap-2 items-center">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Panel izquierdo: Miembros */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {members.map(m => (
                  <tr key={m.user_id} className="text-slate-600">
                    <td className="p-4 font-bold text-slate-800">{m.full_name}</td>
                    <td className="p-4">{m.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        m.role === 'admin' 
                          ? 'bg-primary-50 text-primary-700 border border-primary-100' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {m.role === 'admin' ? 'Admin' : 'Miembro'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel derecho: Invitaciones */}
        <div className="space-y-6">
          {/* Código de Invitación */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-primary-600" /> Código de Invitación
            </h3>
            
            <div className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50">
              <span className="font-mono text-base font-extrabold text-slate-800 tracking-wider">
                {activeOrg?.invite_code || '---'}
              </span>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-200 text-slate-500 rounded-lg transition"
                title="Copiar Código"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <input 
                type="checkbox"
                id="inviteEnabled"
                checked={activeOrg?.invite_code_enabled || false}
                onChange={handleToggleCode}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="inviteEnabled" className="text-slate-700 font-semibold">Permitir registro por código</label>
            </div>

            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 py-2 text-xs"
              onClick={handleRegenerateCode}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Regenerar Código
            </Button>
          </div>

          {/* Invitar por email */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Agregar Miembro Directamente</h3>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email del usuario</label>
                <input 
                  type="email"
                  value={emailToInvite}
                  onChange={(e) => setEmailToInvite(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
                  placeholder="vecino@correo.com"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-2 text-xs">
                Agregar Usuario
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- ADMIN - SETTINGS VIEW ---
function AdminSettingsView() {
  const { activeOrg, refreshOrg } = useAuth()
  const [maxDays, setMaxDays] = useState(7)
  const [maxDuration, setMaxDuration] = useState(120)
  const [allowedStart, setAllowedStart] = useState('06:00')
  const [allowedEnd, setAllowedEnd] = useState('22:00')
  const [timezone, setTimezone] = useState('UTC')
  
  // nomenclatura
  const [singular, setSingular] = useState('Recurso')
  const [plural, setPlural] = useState('Recursos')

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (activeOrg) {
      setSingular(activeOrg.resource_label_singular || 'Recurso')
      setPlural(activeOrg.resource_label_plural || 'Recursos')
      if (activeOrg.settings) {
        setMaxDays(activeOrg.settings.max_days_ahead)
        setMaxDuration(activeOrg.settings.max_duration_minutes)
        setAllowedStart(activeOrg.settings.allowed_start_time.substring(0, 5))
        setAllowedEnd(activeOrg.settings.allowed_end_time.substring(0, 5))
        setTimezone(activeOrg.settings.timezone)
      }
    }
  }, [activeOrg])

  const handleSave = async (e) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    if (allowedStart >= allowedEnd) {
      setError('La hora de inicio permitida debe ser menor que la hora de fin.')
      return
    }

    if (!activeOrg?.id) {
      setError('No hay organización activa configurada.')
      return
    }

    try {
      // Guardar configuraciones en backend
      await orgService.updateSettings(activeOrg.id, {
        max_days_ahead: Number(maxDays),
        max_duration_minutes: Number(maxDuration),
        allowed_start_time: allowedStart + ":00",
        allowed_end_time: allowedEnd + ":00",
        timezone
      })

      // Guardar nomenclaturas
      await orgService.updateOrgNomenclature(activeOrg.id, singular, plural)

      refreshOrg()
      setSuccess('Configuración de la organización guardada con éxito.')
    } catch (err) {
      setError(err.message || 'Ocurrió un error al guardar la configuración.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Reglas de Reserva (Settings)</h2>
        <p className="text-xs text-slate-500">Configura los límites operacionales y la nomenclatura personalizada de tu organización</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-xl text-xs flex gap-2 items-center">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">Nomenclatura Personalizada</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Singular</label>
              <input 
                type="text"
                value={singular}
                onChange={(e) => setSingular(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
                placeholder="Ej: Cancha, Aula"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Plural</label>
              <input 
                type="text"
                value={plural}
                onChange={(e) => setPlural(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
                placeholder="Ej: Canchas, Aulas"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">Límites y Restricciones</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Anticipación Máxima (Días)</label>
              <input 
                type="number"
                value={maxDays}
                onChange={(e) => setMaxDays(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Duración Máxima (Minutos)</label>
              <input 
                type="number"
                value={maxDuration}
                onChange={(e) => setMaxDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Hora Apertura Diaria</label>
              <input 
                type="time"
                value={allowedStart}
                onChange={(e) => setAllowedStart(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Hora Cierre Diaria</label>
              <input 
                type="time"
                value={allowedEnd}
                onChange={(e) => setAllowedEnd(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> Huso Horario de la Entidad
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-xs"
            >
              <option value="UTC">UTC (Tiempo Universal)</option>
              <option value="America/Bogota">Bogotá / Lima / Quito (UTC-5)</option>
              <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
              <option value="America/Santiago">Santiago de Chile (UTC-4)</option>
              <option value="America/Argentina/Buenos_Aires">Buenos Aires (UTC-3)</option>
              <option value="Europe/Madrid">Madrid (UTC+1)</option>
            </select>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full py-2.5">
          Guardar Cambios
        </Button>
      </form>
    </div>
  )
}

// --- PRIVATEROUTE COMPONENT ---
function PrivateRoute({ children }) {
  const { token } = useAuth()
  if (!token) {
    return <LoginView />
  }
  return <MainLayout>{children}</MainLayout>
}

// --- APP ROUTING COMPONENT ---
export default function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<HomeView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/register-org" element={<RegisterOrgView />} />

      {/* Rutas Privadas / Protegidas */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardView /></PrivateRoute>} />
      <Route path="/resources" element={<PrivateRoute><ResourcesListView /></PrivateRoute>} />
      <Route path="/resources/:id" element={<PrivateRoute><ResourceDetailView /></PrivateRoute>} />
      <Route path="/my-reservations" element={<PrivateRoute><MyReservationsView /></PrivateRoute>} />
      
      {/* Rutas Privadas / Administración (Protegidas localmente en renderizado) */}
      <Route path="/admin/resources" element={<PrivateRoute><AdminResourcesView /></PrivateRoute>} />
      <Route path="/admin/settings" element={<PrivateRoute><AdminSettingsView /></PrivateRoute>} />
      <Route path="/admin/members" element={<PrivateRoute><AdminMembersView /></PrivateRoute>} />
    </Routes>
  )
}
