import {
  ClockCircleOutlined,
  UserOutlined,
  DashboardOutlined
} from '@ant-design/icons'

const CourseDetailHeader = ({ course }) => {
  if (!course) return null

  // Format số liệu đẹp hơn (1200 -> 1.2k)
  const formatCount = (num) =>
    num > 1000 ? `${(num / 1000).toFixed(1)}k` : num

  return (
    <header className="mb-8">
      {/* 1. Badge Level */}
      <div className="mb-4">
        <span
          className="
          inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest
          bg-gray-100 text-gray-900 border border-gray-200
        "
        >
          {course.level}
        </span>
      </div>

      {/* 2. Title */}
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
        {course.title}
      </h1>

      {/* 3. Meta Info */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
        <span className="flex items-center gap-2">
          <ClockCircleOutlined />
          {course.estimatedDuration || 10} giờ học
        </span>
        <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>

        <span className="flex items-center gap-2">
          <UserOutlined />
          {formatCount(course.enrolledCount)} học viên
        </span>
        <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>

        <span className="flex items-center gap-2">
          <DashboardOutlined />
          {course.lessonsCount} bài học
        </span>
      </div>
    </header>
  )
}

export default CourseDetailHeader
