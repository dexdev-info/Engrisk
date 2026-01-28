import { useEffect, useState } from 'react'
import { vocabService } from '../services/vocabService.js'

export const useReviewQueue = () => {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setLoading(true)
        const res = await vocabService.getReviewQueue()
        setQueue(res.data || [])
      } catch {
        setError('Không thể tải danh sách ôn tập')
      } finally {
        setLoading(false)
      }
    }

    fetchQueue()
  }, [])

  return {
    queue,
    loading,
    error
  }
}