import api from '../lib/api.js'

const lessonService = {
  getBySlug: async (slug) => {
    const response = await api.get(`/lessons/${slug}`)
    return response.data
  },

  markComplete: async (lessonId) => {
    const response = await api.post(`/lessons/${lessonId}/complete`)
    return response.data
  },
}

export default lessonService