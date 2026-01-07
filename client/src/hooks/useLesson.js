import { useEffect, useState, useRef } from 'react'
import { lessonService } from '../services/lessonService.js'

export const useLesson = (lessonSlug) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const startTimeRef = useRef(null)

  // Fetch lesson
  useEffect(() => {
    // let isBootstrapped = false
    // if (isBootstrapped) return
    // isBootstrapped = true

    let mounted = true

    const fetchLesson = async () => {
      try {
        const res = await lessonService.getBySlug({
          slug: lessonSlug
        })

        if (mounted) {
          setData(res.data)
          setLoading(false)
        }
      } catch {
        if (mounted) setLoading(false)
      }
    }
    fetchLesson()

    return () => {
      mounted = false
    }
  }, [lessonSlug])

  // start time tracking
  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [lessonSlug])

  // send time on unmount
  useEffect(() => {
    return () => {
      if (!data?.lesson?._id || !startTimeRef.current) return

      const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000)

      if (seconds > 10) {
        lessonService.updateTimeSpent({
          lessonId: data.lesson._id,
          timeSpent: seconds
        })
      }
    }
  }, [data])

  return { data, loading, setData }
}
