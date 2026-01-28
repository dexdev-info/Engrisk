import { PlayCircleFilled, LockFilled, FileTextOutlined } from '@ant-design/icons'

const CourseDetailCurriculum = ({ course, isEnrolled, onSelectLesson, onRequireEnroll }) => {
  if (!course?.lessons?.length) return null

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-2xl font-serif font-bold text-gray-900">
          Nội dung khóa học
        </h3>
        <span className="text-sm text-gray-500 font-medium">
          {course.lessons.length} bài học
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {course.lessons.map((lesson, index) => {
          const isAccessible = isEnrolled // Logic đơn giản: Đã đăng ký là xem được hết
          
          return (
            <div
              key={lesson._id}
              onClick={() => isAccessible ? onSelectLesson(lesson) : onRequireEnroll?.()}
              className={`
                group flex items-start gap-4 py-4 border-b border-gray-100 last:border-0
                transition-all duration-200
                ${isAccessible ? 'cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded-lg' : 'opacity-60 cursor-not-allowed'}
              `}
            >
              {/* Index Number */}
              <span className="mt-1 text-sm font-bold text-gray-400 w-6 flex-shrink-0">
                {(index + 1).toString().padStart(2, '0')}
              </span>

              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-base font-semibold ${isAccessible ? 'text-gray-900 group-hover:text-black' : 'text-gray-500'}`}>
                    {lesson.title}
                  </h4>
                  
                  {/* Status Icon */}
                  {isAccessible ? (
                    <PlayCircleFilled className="text-gray-400 group-hover:text-black transition-colors" />
                  ) : (
                    <LockFilled className="text-gray-300" />
                  )}
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FileTextOutlined /> {lesson.type?.toUpperCase() ?? 'LESSON'}
                  </span>
                  <span>•</span>
                  <span>{lesson.duration} phút</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default CourseDetailCurriculum