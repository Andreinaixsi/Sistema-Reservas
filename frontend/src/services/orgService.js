import api from './api.js'

export const orgService = {
  updateSettings: async (orgId, settings) => {
    const response = await api.put(`/organizations/${orgId}/settings`, settings)
    return response.data
  },
  updateOrgNomenclature: async (orgId, singular, plural) => {
    const response = await api.put(`/organizations/${orgId}/nomenclature`, {
      resource_label_singular: singular,
      resource_label_plural: plural
    })
    return response.data
  },
  listMembers: async (orgId) => {
    const response = await api.get(`/organizations/${orgId}/members`)
    return response.data
  },
  addMember: async (orgId, email) => {
    const response = await api.post(`/organizations/${orgId}/members`, { email })
    return response.data
  },
  regenerateInviteCode: async (orgId) => {
    const response = await api.post(`/organizations/${orgId}/regenerate-code`)
    return response.data
  },
  toggleInviteCode: async (orgId, enabled) => {
    const response = await api.put(`/organizations/${orgId}/toggle-code`, { enabled })
    return response.data
  },
  joinByInviteCode: async (inviteCode) => {
    const response = await api.post('/organizations/join', { invite_code: inviteCode })
    return response.data
  }
}
