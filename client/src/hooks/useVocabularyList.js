import { useCallback, useEffect, useRef, useState } from 'react'
import { vocabularyService } from '../services/vocabularyService.js'

/**
 * Hook: Fetch public vocabulary list
 * - Abort-safe
 * - Pagination-ready
 * - Filter-ready
 */
export const useVocabularyList = ({
  search = '',
  level = '',
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

  const abortRef = useRef(null)

  const fetchVocabs = useCallback(async () => {
    // Abort previous request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      setLoading(true)
      setError(null)

      const res = await vocabularyService.getAll({
        params: { search, level, page, limit },
        signal: controller.signal
      })

      const { data = [], total = 0, totalPages = 0, currentPage = page } = res
      setVocabs(data)
      setPagination({ total, totalPages, currentPage })
    } catch (e) {
      if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') {
        return
      }
      console.error('[VOCAB LIST ERROR]', e)
      // Chỉ set error nếu không phải do hủy request
      if (!controller.signal.aborted) {
        setError('Không thể tải danh sách từ vựng')
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [search, level, page, limit])

  useEffect(() => {
    fetchVocabs()
    return () => abortRef.current?.abort()
  }, [fetchVocabs])

  return {
    vocabs,
    loading,
    error,
    pagination,
    refetch: fetchVocabs
  }
}
