import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para inyectar token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar y formatear errores del backend automáticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Error en el servidor'
    if (error.response?.data) {
      const detail = error.response.data.detail
      if (typeof detail === 'string') {
        message = detail
      } else if (Array.isArray(detail)) {
        message = detail.map(d => d.msg).join(', ')
      } else if (error.response.data.message) {
        message = error.response.data.message
      }
    } else if (error.message) {
      message = error.message
    }
    return Promise.reject(new Error(message))
  }
)

export default api
