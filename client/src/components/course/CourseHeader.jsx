import { Typography, Tag } from 'antd'
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons'

const { Title } = Typography

const CourseHeader = ({ course }) => {
  if (!course) return null

  return (
    <header className="mb-6">
      <Title level={1} className="!mb-4">
        {course.title}
      </Title>

      <div className="flex items-center gap-4 text-gray-500">
        <Tag color="blue">{course.level}</Tag>

        <span className="flex items-center gap-1">
          <ClockCircleOutlined />
          {course.estimatedDuration || 10} giờ học
        </span>

        <span className="flex items-center gap-1">
          <UserOutlined />
          {course.enrolledCount} học viên
        </span>
      </div>
    </header>
  )
}

export default CourseHeader
