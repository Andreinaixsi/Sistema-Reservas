import api from './api.js'

export const resourceService = {
  list: async () => {
    const response = await api.get('/resources/')
    return response.data
  },
  create: async (resource) => {
    const response = await api.post('/resources/', resource)
    return response.data
  },
  update: async (id, updatedFields) => {
    const response = await api.put(`/resources/${id}`, updatedFields)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/resources/${id}`)
    return response.data
  }
}
