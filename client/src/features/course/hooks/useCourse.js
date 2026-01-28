import { useEffect, useState } from 'react'
import { courseService } from '@/features/course/services/courseService.js'

export const useCourse = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mouted = true // react 19 safe async pattern

    const fetchCourses = async () => {
      try {
        const res = await courseService.getAll()
        if (!mouted) return
        setCourses(res.data ?? [])
      } catch (err) {
        if (!mouted) return
        setError(err)
      } finally {
        if (mouted) setLoading(false)
      }
    }

    fetchCourses()

    return () => mouted = false
  }, [])

  return { courses, loading, error }
}
