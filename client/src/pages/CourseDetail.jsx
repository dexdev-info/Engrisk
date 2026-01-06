import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { App, Typography, Button, Spin, Avatar, Tag, Card, Divider } from 'antd'
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  UserOutlined
} from '@ant-design/icons'
import { courseService } from '../services/courseService.js'
import { useAuth } from '../hooks/useAuth.js'
// import { authService } from '../services/authService.js'
// import { useRevalidator } from 'react-router-dom' // Nếu dùng data router loader (optional)

const { Title, Paragraph, Text } = Typography

const CourseDetail = () => {
  const { message } = App.useApp()
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user, reloadUser } = useAuth()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  // Fetch course khi component mount HOAC khi user thay doi
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true)
      try {
        const res = await courseService.getBySlug(slug)
        setCourse(res.data)
      } catch (error) {
        console.error(error)
        message.error('Không thể tải thông tin khóa học')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [slug, user]) // Thêm vào dependency để refetch khi thay đổi

  const handleEnroll = async () => {
    if (!user) {
      message.info('Vui lòng đăng nhập để tham gia khóa học')
      return navigate('/login', { state: { from: `/courses/${slug}` } })
    }

    setEnrolling(true)
    try {
      // Gọi API Enroll
      const res = await courseService.enroll(course._id)

      // 1️⃣ Reload user để sync enrolledCourses
      await reloadUser()

      // 2️⃣ Update course local state (UI mượt, không đợi fetch lại)
      setCourse((prev) => ({
        ...prev,
        enrolledCount: prev.enrolledCount + 1,
        isEnrolled: true,
        enrollmentData: res.data.enrollment
      }))

      message.success('Đăng ký thành công! Bắt đầu học thôi.')

      // * Optional: Navigate to first lesson
      // if (course.lessons && course.lessons.length > 0) {
      //   navigate(`/learn/${course.slug}/${course.lessons[0].slug}`);
      // }
    } catch (error) {
      console.error('[ENROLL ERROR]', error)
      message.error(error.response?.data?.error || 'Đăng ký thất bại')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spin size="large" />
      </div>
    )
  if (!course)
    return <div className="text-center mt-20">Khóa học không tồn tại</div>

  // * Check user enrollment locally ưu tiên course.isEnrolled từ API
  const isEnrolled = course.isEnrolled === true

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/courses')}
        className="mb-4 text-gray-500 hover:text-blue-600"
      >
        Quay lại danh sách
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-2">
          <Title level={1} className="!mb-4">
            {course.title}
          </Title>
          <div className="flex items-center gap-4 mb-6">
            <Tag color="blue" className="px-3 py-1 text-sm">
              {course.level}
            </Tag>
            <span className="text-gray-500 flex items-center gap-1">
              <ClockCircleOutlined /> {course.estimatedDuration || 10} giờ học
            </span>
            <span className="text-gray-500 flex items-center gap-1">
              <UserOutlined /> {course.enrolledCount} học viên
            </span>
          </div>

          <Card className="mb-8 shadow-sm border-gray-100 bg-blue-50/30">
            <Paragraph className="text-lg text-gray-700 leading-relaxed mb-0">
              {course.description}
            </Paragraph>
          </Card>

          <Title level={3} className="!mb-4">
            Nội dung khóa học
          </Title>
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
                  if (isEnrolled) {
                    message.info(`Đi tới bài học: ${lesson.title}`)
                  } else {
                    message.warning('Bạn cần đăng ký khóa học để xem bài này')
                  }
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
                    icon={
                      isEnrolled ? <PlayCircleOutlined /> : <LockOutlined />
                    }
                  />
                  <div>
                    <div className="font-medium">
                      Bài {index + 1}: {lesson.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {lesson.type.toUpperCase()} • {lesson.duration} phút
                    </div>
                  </div>
                </div>

                {isEnrolled && (
                  <Button size="small" type="primary" ghost>
                    Học ngay
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Action Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card
              cover={
                <img
                  alt={course.title}
                  src={
                    course.thumbnail || 'https://via.placeholder.com/400x250'
                  }
                  className="h-48 object-cover"
                />
              }
              className="shadow-lg border-0 overflow-hidden rounded-xl"
            >
              <div className="text-center">
                <Title level={2} className="!mb-2 !text-blue-600">
                  Miễn phí
                </Title>
                <Text type="secondary" className="line-through mr-2">
                  1.200.000đ
                </Text>
                <Tag color="red">FREE</Tag>

                <Divider className="my-4" />

                {isEnrolled ? (
                  <>
                    <Tag color="success" className="mb-3">
                      ✓ Đã đăng ký
                    </Tag>
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="h-12 text-lg font-bold bg-green-600 hover:bg-green-500 border-none"
                      onClick={() => {
                        if (course.lessons && course.lessons.length > 0) {
                          message.info('Đang chuyển đến bài học đầu tiên...')
                          navigate(`/learn/${course.slug}/${course.lessons[0].slug}`)
                        }
                      }}
                    >
                      TIẾP TỤC HỌC
                    </Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    block
                    className="h-12 text-lg font-bold shadow-blue-300 shadow-lg"
                    loading={enrolling}
                    onClick={handleEnroll}
                  >
                    ĐĂNG KÝ NGAY
                  </Button>
                )}

                <div className="mt-4 space-y-2 text-left text-gray-600 text-sm">
                  <p className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" /> Truy cập
                    trọn đời
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" /> Học trên
                    mọi thiết bị
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" /> Cấp chứng
                    chỉ khi hoàn thành
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
