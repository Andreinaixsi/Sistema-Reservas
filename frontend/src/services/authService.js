import api from './api.js'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.data?.access_token) {
      localStorage.setItem('token', response.data.access_token)
      return response.data
    }
    throw new Error("Respuesta de inicio de sesión inválida")
  },

  register: async (email, password, fullName) => {
    const response = await api.post('/auth/register', { email, password, full_name: fullName })
    return response.data
  },

  registerOrg: async (userData, orgData) => {
    const response = await api.post('/auth/register-org', {
      user: {
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName
      },
      organization: {
        name: orgData.name,
        type: orgData.type,
        resource_label_singular: orgData.resourceLabelSingular,
        resource_label_plural: orgData.resourceLabelPlural
      }
    })
    return response.data
  }
}
