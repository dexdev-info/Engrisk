import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Typography,
  Button,
  Spin,
  List,
  Avatar,
  Tag,
  Card,
  Divider,
  message
} from 'antd'
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LockOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import courseService from '../services/courseService.js'
import { useAuth } from '../hooks/useAuth.js'
import { authService } from '../services/authService.js'
import { useRevalidator } from 'react-router-dom' // Nếu dùng data router loader (optional)

const { Title, Paragraph, Text } = Typography

const CourseDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
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
  }, [slug])

  // Note: login() không phù hợp để reload user.
  // Ta nên dùng window.location.reload() hoặc 1 hàm reloadUser() trong context.
  // Nhưng đơn giản nhất:
  // Handle Enrollment
  const handleEnroll = async () => {
    if (!user) {
      message.info('Vui lòng đăng nhập để tham gia khóa học')
      return navigate('/login', { state: { from: `/courses/${slug}` } })
    }

    setEnrolling(true)
    try {
      // Gọi API Enroll (Sẽ làm sau)
      await courseService.enroll(course._id)
      message.success('Đăng ký thành công! Bắt đầu học thôi.')
      // Cách nhanh nhất để refresh state: Reload trang để lấy lại User Info mới và Course Detail mới
      // Hoặc pro hơn: navigate tới bài học đầu tiên luôn

      if (course.lessons && course.lessons.length > 0) {
        // Chuyển hướng đến bài đầu tiên (Cần tạo trang Lesson trước)
        // navigate(`/learn/${course.slug}/${course.lessons[0].slug}`);

        // Tạm thời reload để thấy nút đổi trạng thái
        window.location.reload()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
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

  // Check user enrollment locally (Simple check)
  const isEnrolled =
    user?.enrolledCourses?.includes(course._id) || course.isEnrolled

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
            <List
              itemLayout="horizontal"
              dataSource={course.lessons}
              renderItem={(lesson, index) => (
                <List.Item
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0 ${
                    isEnrolled ? 'hover:pl-8' : 'opacity-70'
                  }`}
                  onClick={() => {
                    if (isEnrolled) {
                      message.info(`Đi tới bài học: ${lesson.title}`)
                      // navigate(...)
                    } else {
                      message.warning('Bạn cần đăng ký khóa học để xem bài này')
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={
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
                    }
                    title={
                      <Text strong className="text-base">
                        Bài {index + 1}: {lesson.title}
                      </Text>
                    }
                    description={
                      <div className="flex gap-3 text-xs text-gray-400 mt-1">
                        <span>{lesson.type.toUpperCase()}</span>
                        <span>•</span>
                        <span>{lesson.duration} phút</span>
                      </div>
                    }
                  />
                  {/* Nút Action bên phải */}
                  {isEnrolled && (
                    <Button size="small" type="primary" ghost>
                      Học ngay
                    </Button>
                  )}
                </List.Item>
              )}
            />
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
                  <Button
                    type="primary"
                    size="large"
                    block
                    className="h-12 text-lg font-bold bg-green-600 hover:bg-green-500 border-none"
                  >
                    TIẾP TỤC HỌC
                  </Button>
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
