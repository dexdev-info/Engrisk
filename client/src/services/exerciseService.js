import api from '../lib/api.js'

export const exerciseService = {
  async submit({ exerciseId, userAnswer }) {
    const { data } = await api.post(`/exercises/${exerciseId}/submit`, {
      userAnswer
    })
    return data
  }
}
