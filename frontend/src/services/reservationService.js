import api from './api.js'

export const reservationService = {
  listMine: async () => {
    const response = await api.get('/reservations/mine')
    return response.data
  },
  create: async (reservation) => {
    const response = await api.post('/reservations/', {
      resource_id: reservation.resource_id,
      start_time: reservation.start_time,
      end_time: reservation.end_time
    })
    return response.data
  },
  cancel: async (id) => {
    const response = await api.patch(`/reservations/${id}/cancel`)
    return response.data
  },
  getAvailability: async (resourceId, date) => {
    const response = await api.get(`/reservations/resources/${resourceId}/availability`, {
      params: { date }
    })
    return response.data
  }
}
