// Base de datos simulada en localStorage para persistencia en cliente (fallback del demo)

const DEFAULT_ORG = {
  id: 1,
  name: "Condominio Las Palmeras",
  type: "condominio",
  invite_code: "PALM2026",
  invite_code_enabled: true,
  resource_label_singular: "Área Común",
  resource_label_plural: "Áreas Comunes",
  settings: {
    max_days_ahead: 10,
    max_duration_minutes: 180,
    allowed_start_time: "08:00:00",
    allowed_end_time: "22:00:00",
    timezone: "America/Bogota"
  }
}

const DEFAULT_RESOURCES = [
  {
    id: 1,
    organization_id: 1,
    name: "Salón de Eventos",
    description: "Salón cerrado con aire acondicionado, parrilla y juegos de mesa. Ideal para cumpleaños.",
    capacity: 50,
    is_active: true
  },
  {
    id: 2,
    organization_id: 1,
    name: "Cancha de Tenis",
    description: "Cancha de arcilla profesional con iluminación nocturna. Se requiere calzado adecuado.",
    capacity: 4,
    is_active: true
  },
  {
    id: 3,
    organization_id: 1,
    name: "Gimnasio Comunitario",
    description: "Equipado con cintas de correr, mancuernas, máquinas de polea y colchonetas.",
    capacity: 10,
    is_active: true
  }
]

const DEFAULT_MEMBERS = [
  {
    user_id: 101,
    organization_id: 1,
    email: "admin@example.com",
    full_name: "Administrador Las Palmeras",
    role: "admin"
  },
  {
    user_id: 102,
    organization_id: 1,
    email: "vecino@example.com",
    full_name: "Juan Pérez (Vecino)",
    role: "member"
  }
]

const DEFAULT_RESERVATIONS = [
  {
    id: 1,
    resource_id: 2,
    user_id: 102,
    user_email: "vecino@example.com",
    start_time: "2026-06-15T09:00:00",
    end_time: "2026-06-15T11:00:00",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    resource_id: 1,
    user_id: 102,
    user_email: "vecino@example.com",
    start_time: "2026-06-16T15:00:00",
    end_time: "2026-06-16T18:00:00",
    status: "active",
    created_at: new Date().toISOString()
  }
]

const initializeDb = () => {
  if (!localStorage.getItem('org_data')) {
    localStorage.setItem('org_data', JSON.stringify(DEFAULT_ORG))
  }
  if (!localStorage.getItem('resources_data')) {
    localStorage.setItem('resources_data', JSON.stringify(DEFAULT_RESOURCES))
  }
  if (!localStorage.getItem('members_data')) {
    localStorage.setItem('members_data', JSON.stringify(DEFAULT_MEMBERS))
  }
  if (!localStorage.getItem('reservations_data')) {
    localStorage.setItem('reservations_data', JSON.stringify(DEFAULT_RESERVATIONS))
  }
}

// Inicializar de inmediato
initializeDb()

export const mockDb = {
  // ORGANIZACIÓN
  getOrg: () => {
    return JSON.parse(localStorage.getItem('org_data'))
  },
  updateOrg: (newOrg) => {
    localStorage.setItem('org_data', JSON.stringify(newOrg))
    return newOrg
  },
  updateSettings: (newSettings) => {
    const org = mockDb.getOrg()
    org.settings = { ...org.settings, ...newSettings }
    mockDb.updateOrg(org)
    return org.settings
  },

  // RECURSOS
  getResources: () => {
    return JSON.parse(localStorage.getItem('resources_data'))
  },
  saveResources: (resources) => {
    localStorage.setItem('resources_data', JSON.stringify(resources))
  },
  addResource: (resource) => {
    const list = mockDb.getResources()
    const newResource = {
      ...resource,
      id: list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1,
      organization_id: 1,
      is_active: resource.is_active !== undefined ? resource.is_active : true
    }
    list.push(newResource)
    mockDb.saveResources(list)
    return newResource
  },
  updateResource: (id, updatedFields) => {
    const list = mockDb.getResources()
    const index = list.findIndex(r => r.id === Number(id))
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields }
      mockDb.saveResources(list)
      return list[index]
    }
    return null
  },
  deleteResource: (id) => {
    let list = mockDb.getResources()
    list = list.filter(r => r.id !== Number(id))
    mockDb.saveResources(list)
    return true
  },

  // MIEMBROS
  getMembers: () => {
    return JSON.parse(localStorage.getItem('members_data'))
  },
  addMember: (email, fullName = "Nuevo Miembro") => {
    const list = mockDb.getMembers()
    if (list.some(m => m.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("El usuario ya pertenece a esta organización.")
    }
    const newMember = {
      user_id: Math.floor(Math.random() * 10000) + 200,
      organization_id: 1,
      email: email.toLowerCase(),
      full_name: fullName,
      role: "member"
    }
    list.push(newMember)
    localStorage.setItem('members_data', JSON.stringify(list))
    return newMember
  },

  // RESERVAS
  getReservations: () => {
    return JSON.parse(localStorage.getItem('reservations_data'))
  },
  saveReservations: (reservations) => {
    localStorage.setItem('reservations_data', JSON.stringify(reservations))
  },
  addReservation: (reservation) => {
    const list = mockDb.getReservations()
    const newRes = {
      ...reservation,
      id: list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1,
      status: 'active',
      created_at: new Date().toISOString()
    }
    
    // Validar solapamiento (RN-001) en cliente
    const overlap = list.some(r => {
      if (r.resource_id !== Number(newRes.resource_id) || r.status !== 'active') return false
      // Cruzar rangos de tiempo
      return (newRes.start_time < r.end_time && newRes.end_time > r.start_time)
    })
    
    if (overlap) {
      throw new Error("Conflicto de horario: El recurso ya está reservado en ese horario.")
    }

    list.push(newRes)
    mockDb.saveReservations(list)
    return newRes
  },
  cancelReservation: (id) => {
    const list = mockDb.getReservations()
    const index = list.findIndex(r => r.id === Number(id))
    if (index !== -1) {
      list[index].status = 'cancelled'
      mockDb.saveReservations(list)
      return list[index]
    }
    return null
  }
}
