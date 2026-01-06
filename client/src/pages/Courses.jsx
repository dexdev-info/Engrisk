import { useEffect, useState } from 'react'
import { Typography, Row, Col, Spin, Empty, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { courseService } from '../services/courseService.js'
import CourseCard from '../components/course/CourseCard.jsx'

const { Title, Paragraph } = Typography

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getAll()
        setCourses(res.data)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Filter client-side cho mượt
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <Title level={2} className="!text-blue-600 !mb-2">
          Khóa Học Tiếng Anh
        </Title>
        <Paragraph className="text-gray-500 text-lg">
          Lộ trình học tập bài bản từ cơ bản đến nâng cao
        </Paragraph>

        <div className="max-w-md mx-auto mt-6">
          <Input
            size="large"
            placeholder="Tìm kiếm khóa học..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="rounded-full px-6"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" tip="Đang tải khóa học..." />
        </div>
      ) : filteredCourses.length > 0 ? (
        <Row gutter={[24, 24]}>
          {filteredCourses.map((course) => (
            <Col key={course._id} xs={24} sm={12} lg={8} xl={6}>
              <CourseCard course={course} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Chưa có khóa học nào hoặc không tìm thấy kết quả." />
      )}
    </div>
  )
}

export default Courses
