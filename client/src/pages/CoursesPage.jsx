import { useEffect, useState, useMemo } from 'react'
import { Skeleton, Empty, Input } from 'antd'
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons'
import { courseService } from '../services/courseService.js'
import CourseCard from '../components/course/CourseCard.jsx'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getAll()
        setCourses(res.data || [])
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Dùng useMemo để tránh tính toán lại không cần thiết khi re-render
  const filteredCourses = useMemo(() => {
    return courses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [courses, search])

  // --- RENDER HELPERS ---

  // 1. Loading Skeleton: Giả lập 8 cái thẻ đang tải
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border border-gray-100 h-[320px] flex flex-col gap-4"
        >
          <Skeleton.Image active className="!w-full !h-40 rounded-xl" />
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER SECTION: Editorial Style */}
      <div className="bg-white pt-12 pb-10 px-4 md:px-8 max-w-7xl mx-auto text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-mono font-bold text-gray-900 mb-4 tracking-tight">
          Khám phá kiến thức
        </h1>
        <p className="text-gray-500 text-lg font-sans max-w-2xl mx-auto leading-relaxed">
          Lộ trình học tập bài bản từ cơ bản đến nâng cao, được thiết kế riêng
          cho bạn.
        </p>

        {/* Search Bar: Pill Shape & High Contrast Focus */}
        <div className="max-w-md mx-auto mt-8">
          <Input
            size="large"
            placeholder="Tìm kiếm khóa học..."
            prefix={<SearchOutlined className="text-gray-400 mr-2" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear={{
              clearIcon: <CloseCircleFilled className="text-gray-400" />
            }}
            // Style đồng bộ với VocabularySearch
            className="
              !rounded-full 
              !bg-gray-50 !border-gray-200 
              !px-6 !py-3
              !text-gray-900 placeholder:!text-gray-400
              hover:!bg-white hover:!border-gray-400 hover:!shadow-md
              focus-within:!bg-white focus-within:!border-gray-900 focus-within:!shadow-lg
              transition-all duration-300
              [&>input]:!bg-transparent
            "
          />
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {loading ? (
          renderSkeletons()
        ) : filteredCourses.length > 0 ? (
          /*
            - justify-around: Chia đều khoảng cách thừa ra xung quanh các thẻ
            - gap-6: Khoảng cách tối thiểu giữa các thẻ
          */
          <div className="flex flex-wrap justify-around gap-2 animate-fade-in">
            {filteredCourses.map((course) => (
              /* Wrapper: 
                - w-full: Trên mobile thì full màn hình
                - sm:w-[300px] lg:w-[320px]: PC fix cứng chiều rộng 
                - flex-grow-0: Không cho thẻ tự dãn ra quá to
              */
              <div
                key={course._id}
                className="w-full sm:w-[250px] lg:w-[270px] grow-0"
              >
                <CourseCard course={course} />
              </div>
            ))}

            {/* Hack: Thêm các thẻ rỗng (ghost items) để xử lý lỗi "Hàng cuối cùng bị căn giữa" của Flexbox space-around */}
            {/* Nếu hàng cuối chỉ có 1 thẻ, nó sẽ bị đẩy ra giữa rất xấu. Các thẻ rỗng này sẽ đẩy nó về bên trái. */}
            <div className="w-full sm:w-[300px] lg:w-[320px] h-0" />
            <div className="w-full sm:w-[300px] lg:w-[320px] h-0" />
            <div className="w-full sm:w-[300px] lg:w-[320px] h-0" />
          </div>
        ) : (
          // ) : filteredCourses.length > 0 ? (
          //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          //     {filteredCourses.map((course) => (
          //       <CourseCard key={course._id} course={course} />
          //     ))}
          //   </div>
          // ) : (

          <div className="py-20 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-400 font-serif italic">
                  Không tìm thấy khóa học nào với từ khóa "{search}"
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
