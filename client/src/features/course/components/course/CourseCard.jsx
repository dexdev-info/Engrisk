import { Link } from 'react-router-dom'
import { BookOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons'

const CourseCard = ({ course }) => {
  // Helper: Format số lượng học viên (ví dụ: 1200 -> 1.2k)
  const formatCount = (num) => {
    return num > 1000 ? `${(num / 1000).toFixed(1)}k` : num
  }

  return (
    <Link to={`/courses/${course.slug}`} className="group block h-full">
      <article 
        className="
          h-full flex flex-col bg-white rounded-2xl overflow-hidden
          border border-gray-200 transition-all duration-300
          hover:border-gray-900 hover:shadow-none
        "
      >
        {/* 1. THUMBNAIL AREA */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            alt={course.title}
            src={course.thumbnail || 'https://via.placeholder.com/300x200'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Level Badge: Glassmorphism Style */}
          <div className="absolute top-3 right-3">
            <span className="
              px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
              bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm
              text-gray-900
            ">
              {course.level}
            </span>
          </div>
        </div>

        {/* 2. CONTENT AREA */}
        <div className="flex flex-col flex-1 p-5">
          {/* Title */}
          <h3 
            className="
              text-xl font-serif font-bold text-gray-900 line-clamp-2 mb-2
              group-hover:underline decoration-1 underline-offset-4 decoration-gray-900
            "
            title={course.title}
          >
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4 flex-1 font-sans">
            {course.description}
          </p>

          {/* 3. FOOTER META */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <BookOutlined /> {course.lessonsCount} bài
              </span>
              <span className="flex items-center gap-1.5">
                <UserOutlined /> {formatCount(course.enrolledCount)} học viên
              </span>
            </div>

            {/* Icon mũi tên chỉ hiện khi hover */}
            <ArrowRightOutlined className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-black" />
          </div>
        </div>
      </article>
    </Link>
  )
}

export default CourseCard