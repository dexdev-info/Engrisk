// hooks/useReviewQueue.js
import { useEffect, useState } from 'react'
import { vocabularyService } from '../services/vocabularyService.js'

export const useReviewQueue = () => {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setLoading(true)
        const res = await vocabularyService.getReviewQueue()
        setQueue(res.data || [])
      } catch (e) {
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


// // hooks/useReviewQueue.js
// import { useEffect, useState } from 'react'
// import { vocabularyService } from '../services/vocabularyService'

// export const useReviewQueue = () => {
//   const [queue, setQueue] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     vocabularyService
//       .getReviewQueue()
//       .then((res) => setQueue(res.data || []))
//       .finally(() => setLoading(false))
//   }, [])

//   return { queue, loading }
// }
