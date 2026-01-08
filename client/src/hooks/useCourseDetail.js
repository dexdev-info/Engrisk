import { useEffect, useState, useCallback } from 'react'
import { courseService } from '../services/courseService.js'
import { useAuth } from './useAuth.js'

export const useCourseDetail = ({ slug, navigate, message }) => {
  const { user, reloadUser } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  // FETCH COURSE
  useEffect(() => {
    let mounted = true

    const fetchCourse = async () => {
      setLoading(true)
      try {
        const res = await courseService.getBySlug({ slug })
        if (mounted) setCourse(res.data)
      } catch (error) {
        console.error('[FETCH COURSE ERROR]', error)
        message?.error('Không thể tải thông tin khóa học')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchCourse()
    return () => (mounted = false)
  }, [slug])

  // DERIVED STATE
  const isEnrolled = Boolean(course?.isEnrolled)

  // ENROLL
  const enroll = useCallback(async () => {
    if (!user) {
      message?.info('Vui lòng đăng nhập để tham gia khóa học')
      navigate('/login', { state: { from: `/courses/${slug}` } })
      return
    }

    if (!course) return

    setEnrolling(true)
    try {
      const res = await courseService.enroll({ courseId: course._id })

      // Sync user.enrolledCourses
      await reloadUser()

      // Optimistic UI update
      setCourse((prev) => ({
        ...prev,
        enrolledCount: prev.enrolledCount + 1,
        isEnrolled: true,
        enrollmentData: res.data.enrollment
      }))

      message?.success('Đăng ký thành công! Bắt đầu học thôi.')

      // Auto navigate to first lesson
      const firstLesson = course.lessons?.[0]
      if (firstLesson) {
        navigate(`/learn/${course.slug}/${firstLesson.slug}`)
      }
    } catch (error) {
      console.error('[ENROLL ERROR]', error)
      message?.error(error.response?.data?.error || 'Đăng ký thất bại')
    } finally {
      setEnrolling(false)
    }
  }, [user, course, slug, navigate, reloadUser, message])

  // RESUME
  const resume = useCallback(() => {
    if (!course || !isEnrolled) {
      message?.warning('Bạn cần đăng ký khóa học để học')
      return
    }

    const enrollment = course.enrollmentData
    if (!enrollment) return

    const { lastLessonAccessed } = enrollment

    // Resume last lesson
    if (lastLessonAccessed) {
      const lesson = course.lessons.find(
        (l) => String(l._id) === String(lastLessonAccessed)
      )

      if (lesson) {
        navigate(`/learn/${course.slug}/${lesson.slug}`)
        return
      }
    }

    // Fallback: first lesson
    const firstLesson = course.lessons?.[0]
    if (firstLesson) {
      navigate(`/learn/${course.slug}/${firstLesson.slug}`)
    }
  }, [course, isEnrolled, navigate, message])

  // SELECT LESSON
  const selectLesson = useCallback(
    (lesson) => {
      if (!isEnrolled) {
        message?.warning('Bạn cần đăng ký khóa học để xem bài này')
        return
      }

      navigate(`/learn/${course.slug}/${lesson.slug}`)
    },
    [isEnrolled, course, navigate, message]
  )

  return {
    course,
    loading,
    enrolling,
    isEnrolled,

    // actions
    enroll,
    resume,
    selectLesson,

    // state setter (rare cases)
    setCourse
  }
}
