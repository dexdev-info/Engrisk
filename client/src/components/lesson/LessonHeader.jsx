// components/lesson/LessonHeader.jsx
import { Progress, Breadcrumb, Tag } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const LessonHeader = ({ lesson, progress }) => {
  if (!lesson) return null

  return (
    <header className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/courses">Khóa học</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{lesson.courseTitle}</Breadcrumb.Item>
        <Breadcrumb.Item>{lesson.title}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Title */}
      <h1 className="text-2xl font-bold">{lesson.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <ClockCircleOutlined /> {lesson.duration} phút
        </span>
        <Tag>{lesson.type.toUpperCase()}</Tag>
      </div>

      {/* Progress */}
      {/* {progress?.courseProgressPercentage !== undefined && (
        <div>
          <div className="text-sm mb-1 text-gray-600">Tiến độ khóa học</div>
          <Progress
            percent={progress.courseProgressPercentage}
            strokeColor="#1677ff"
          />
        </div>
      )} */}

      {/* Progress */}
      {progress?.accessCount && <Tag>{progress.accessCount} lượt học</Tag>}
    </header>
  )
}

export default LessonHeader
