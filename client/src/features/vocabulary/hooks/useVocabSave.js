import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { vocabService } from '../services/vocabService.js'

export const useVocabSave = ({ vocabId, initialSaved, onSavedChange }) => {
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
      await vocabService.toggleSave(vocabId)
      setSaved(nextSaved)
      onSavedChange?.(nextSaved)

      message.success(nextSaved ? 'Đã lưu vào từ của bạn' : 'Đã bỏ lưu từ vựng')
    } catch {
      message.error('Không thể lưu từ vựng')
    } finally {
      setLoading(false)
    }
  }, [saved, loading, vocabId, onSavedChange])

  return {
    saved,
    loading,
    toggleSave
  }
}
