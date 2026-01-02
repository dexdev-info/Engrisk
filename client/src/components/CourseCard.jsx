import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {/* Ảnh thumbnail */}
      <div className="h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
        />
      </div>

      {/* Nội dung */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-bold px-2 py-1 rounded ${
              course.level === 'Beginner'
                ? 'bg-green-100 text-green-700'
                : course.level === 'Intermediate'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {course.level}
          </span>
        </div>

        <h3
          className="text-xl font-bold text-gray-800 mb-2 truncate"
          title={course.title}
        >
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {course.description}
        </p>

        {/* Nút học ngay -> Link sang trang chi tiết */}
        <Link
          to={`/course/${course._id}`}
          className="block text-center w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Học ngay
        </Link>
      </div>
    </div>
  )
}

export default CourseCard
