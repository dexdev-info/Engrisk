import { useEffect, useState, useCallback, useRef } from 'react'
import { vocabularyService } from '../services/vocabularyService'

export const useVocabulary = ({ id, slug }) => {
  const [vocab, setVocab] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const abortRef = useRef(null)

  const fetchVocab = useCallback(async () => {
    if (!id && !slug) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      setLoading(true)
      setError(null)

      const res = id
        ? await vocabularyService.getById({
            vocabId: id,
            signal: controller.signal
          })
        : await vocabularyService.getBySlug({
            slug: slug,
            signal: controller.signal
          })

      setVocab(res.data)
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError(e?.message || 'Không thể tải từ vựng')
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [id, slug])

  useEffect(() => {
    fetchVocab()
    return () => abortRef.current?.abort()
  }, [fetchVocab])

  return {
    vocab,
    loading,
    error,
    refetch: fetchVocab
  }
}
