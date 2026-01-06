import api from '../lib/api.js'

export const lessonService = {
  async getBySlug({ slug }) {
    const { data } = await api.get(`/lessons/${slug}`)
    return data
  },

  async markComplete({ lessonId }) {
    const { data } = await api.post(`/lessons/${lessonId}/complete`)
    return data
  },

  async saveNotes({ lessonId, notes }) {
    const { data } = await api.post(`/lessons/${lessonId}/notes`, { notes })
    return data
  },

  async updateTimeSpent({ lessonId, timeSpent }) {
    const { data } = await api.post(`/lessons/${lessonId}/update-time`, { timeSpent })
    return data
  }
}
