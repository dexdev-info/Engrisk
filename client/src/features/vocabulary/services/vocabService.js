import api from '@/lib/api.js'

export const vocabService = {
  /**
   * @param {Object} params - { level, partOfSpeech, search, page, limit }
   * @param {AbortSignal} signal
   */
  async getAll({ params = {}, signal }) {
    const { data } = await api.get('/vocabulary', { params, signal })
    return data
  },

  async getById({ vocabId, signal }) {
    const { data } = await api.get(`/vocabulary/id/${vocabId}`, { signal })
    return data
  },

  async getBySlug({ slug, signal }) {
    const { data } = await api.get(`/vocabulary/slug/${slug}`, { signal })
    return data
  },

  /**
   * @param {Object} params - { status, due, page, limit }
   */
  async getMyVocabularies(params = {}) {
    const { data } = await api.get('/vocabulary/my', { params })
    return data
  },

  // Get review queue (words due for review today)
  async getReviewQueue() {
    const { data } = await api.get('/vocabulary/review-queue')
    return data
  },

  // Toggle save vocabulary (Save/Unsave)
  async toggleSave(vocabId) {
    const { data } = await api.post(`/vocabulary/${vocabId}/save`)
    return data
  },

  // Submit review result
  async submitReview({ userVocabId, isCorrect }) {
    const { data } = await api.post(`/vocabulary/review/${userVocabId}`, {
      isCorrect
    })
    return data
  },

  // Update vocabulary notes
  async updateNotes({ userVocabId, notes }) {
    const { data } = await api.post(`/vocabulary/${userVocabId}/notes`, {
      notes
    })
    return data
  }
}
