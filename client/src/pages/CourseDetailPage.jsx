import CourseHeader from '../components/course/CourseHeader'
import CourseDescription from '../components/course/CourseDescription'
import CourseCurriculum from '../components/course/CourseCurriculum'
import CourseActionCard from '../components/course/CourseActionCard'
import { useCourseDetail } from '../hooks/useCourseDetail'
import { App, Spin } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'

const CourseDetail = () => {
  const { message } = App.useApp()
  const { slug } = useParams()
  const navigate = useNavigate()

  const {
    course,
    loading,
    enrolling,
    isEnrolled,
    enroll,
    resume,
    selectLesson
  } = useCourseDetail({ slug, navigate, message })

  if (loading) return <Spin fullscreen />
  if (!course)
    return <div className="text-center mt-20">Khóa học không tồn tại</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <CourseHeader course={course} />
          <CourseDescription description={course.description} />
          <CourseCurriculum
            course={course}
            isEnrolled={isEnrolled}
            onSelectLesson={selectLesson}
            onRequireEnroll={() =>
              message.warning('Bạn cần đăng ký khóa học để xem bài này')
            }
          />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CourseActionCard
              course={course}
              isEnrolled={isEnrolled}
              enrolling={enrolling}
              onEnroll={enroll}
              onResume={resume}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
