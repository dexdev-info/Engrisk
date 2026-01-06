import api from '../lib/api.js'

export const vocabularyService = {
  async toggleSave({ vocabId }) {
    const { data } = await api.post(`/vocabulary/${vocabId}/save`)
    return data
  },

  async review({ vocabId, isCorrect }) {
    const { data } = await api.post(`/vocabulary/review/${vocabId}`, {
      isCorrect
    })
    return data
  }
}
