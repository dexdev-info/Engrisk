import { Avatar, Button } from 'antd'
import { PlayCircleOutlined, LockOutlined } from '@ant-design/icons'

const CourseCurriculum = ({
  course,
  isEnrolled,
  onSelectLesson,
  onRequireEnroll
}) => {
  if (!course?.lessons?.length) return null

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">
        Nội dung khóa học
        <span className="ml-2 text-sm text-gray-400">
          ({course.lessons.length} bài học)
        </span>
      </h3>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {course.lessons.map((lesson, index) => (
          <div
            key={lesson._id}
            className={`px-6 py-4 flex items-center justify-between border-b last:border-b-0 transition ${
              isEnrolled
                ? 'hover:bg-gray-50 cursor-pointer'
                : 'opacity-70 cursor-not-allowed'
            }`}
            onClick={() => {
              if (!isEnrolled) {
                onRequireEnroll?.()
                return
              }
              onSelectLesson(lesson)
            }}
          >
            <div className="flex items-center gap-4">
              <Avatar
                shape="square"
                size="large"
                className={
                  isEnrolled
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }
                icon={isEnrolled ? <PlayCircleOutlined /> : <LockOutlined />}
              />

              <div>
                <div className="font-medium">
                  Bài {index + 1}: {lesson.title}
                </div>
                <div className="text-xs text-gray-400">
                  {lesson.type?.toUpperCase() ?? 'LESSON'} • {lesson.duration}{' '}
                  phút
                </div>
              </div>
            </div>

            {isEnrolled && (
              <Button
                size="small"
                type="primary"
                ghost
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectLesson(lesson)
                }}
              >
                Học ngay
              </Button>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default CourseCurriculum
