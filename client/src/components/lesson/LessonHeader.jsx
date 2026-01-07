import { Progress, Breadcrumb, Tag } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const LessonHeader = ({ lesson, progress, navigation }) => {
  if (!lesson) return null

  const coursePercent =
    navigation?.totalLessons && navigation?.currentPosition
      ? Math.round((navigation.currentPosition / navigation.totalLessons) * 100)
      : 0

  return (
    <header className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            title: <Link to="/courses">Khóa học</Link>
          },
          {
            title: lesson.course.title
          },
          {
            title: lesson.title
          }
        ]}
      />

      {/* Title */}
      <h1 className="text-2xl font-bold">{lesson.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <ClockCircleOutlined /> {lesson.duration} phút
        </span>
        <Tag>{lesson.type.toUpperCase()}</Tag>
        {progress?.accessCount && (
          <Tag color="blue">{progress.accessCount} lượt học</Tag>
        )}
      </div>

      {/* Progress Bar */}
      {navigation && (
        <div className="pt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>
              Bài {navigation.currentPosition} / {navigation.totalLessons}
            </span>
            <span>{coursePercent}%</span>
          </div>

          <Progress
            percent={coursePercent}
            showInfo={false}
            strokeColor="#1677ff"
          />
        </div>
      )}
    </header>
  )
}

export default LessonHeader
