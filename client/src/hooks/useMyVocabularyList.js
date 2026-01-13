import { useCallback, useEffect, useRef, useState } from 'react'
import { vocabularyService } from '../services/vocabularyService.js'

/**
 * Hook: Fetch user's saved vocabularies (My Vocabulary)
 * - Abort-safe
 * - Pagination-ready
 * - Support status + due (SRS)
 */
export const useMyVocabularyList = ({
  status = '', // learning | reviewing | mastered
  due = false, // true = due for review
  page = 1,
  limit = 20
}) => {
  const [vocabs, setVocabs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: page
  })

  const [statistics, setStatistics] = useState(null)

  const abortRef = useRef(null)

  const fetchMyVocabs = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      setLoading(true)
      setError(null)

      const res = await vocabularyService.getMyVocabularies(
        {
          status,
          due: due ? 'true' : undefined,
          page,
          limit
        },
        controller.signal
      )

      setVocabs(res.data || [])

      setPagination({
        total: res.total,
        totalPages: res.totalPages,
        currentPage: res.currentPage
      })

      if (res.statistics) {
        setStatistics(res.statistics)
      }
    } catch (e) {
      if (e.name === 'AbortError' || e.code === 'ERR_CANCELED') return

      console.error('[MY VOCAB LIST ERROR]', e)
      setError('Không thể tải kho từ vựng của bạn')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [status, due, page, limit])

  useEffect(() => {
    fetchMyVocabs()
    return () => abortRef.current?.abort()
  }, [fetchMyVocabs])

  return {
    vocabs,
    loading,
    error,
    pagination,
    statistics,
    refetch: fetchMyVocabs
  }
}
