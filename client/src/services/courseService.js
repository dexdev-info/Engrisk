import api from '../lib/api.js'

export const courseService = {
  async getAll() {
    const { data } = await api.get('/courses')
    return data
  },

  async getBySlug({ slug }) {
    const { data } = await api.get(`/courses/${slug}`)
    return data
  },

  // API Enroll
  async enroll({ courseId }) {
    const { data } = await api.post(`/courses/${courseId}/enroll`)
    return data
  }
}