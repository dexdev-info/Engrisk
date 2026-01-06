import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { vocabularyService } from '../services/vocabularyService.js'

export const useVocabularySave = ({ vocabId, initialSaved }) => {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  // sync khi vocab thay đổi
  useEffect(() => {
    setSaved(initialSaved)
  }, [initialSaved])

  const toggleSave = useCallback(async () => {
    if (loading) return

    const nextSaved = !saved
    setLoading(true)

    try {
      await vocabularyService.toggleSave({ vocabId })
      setSaved(nextSaved)

      message.success(nextSaved ? 'Đã lưu vào từ của bạn' : 'Đã bỏ lưu từ vựng')
    } catch {
      message.error('Không thể lưu từ vựng')
    } finally {
      setLoading(false)
    }
  }, [saved, loading, vocabId])

  return {
    saved,
    loading,
    toggleSave
  }
}
