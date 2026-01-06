import api from '../lib/api.js'

export const courseService = {
  getAll: async () => {
    const response = await api.get('/courses')
    return response.data
  },

  getBySlug: async (slug) => {
    const response = await api.get(`/courses/${slug}`)
    return response.data
  },

  // API Enroll
  enroll: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`)
    return response.data
  }
}