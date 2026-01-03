import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Layout,
  Menu,
  Typography,
  Button,
  Spin,
  message,
  Progress,
  Drawer
} from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  LeftOutlined,
  RightOutlined,
  PlayCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import ReactPlayer from 'react-player/lazy' // Cần cài: npm install react-player
import ReactMarkdown from 'react-markdown' // Cần cài: npm install react-markdown

import lessonService from '@/services/lessonService'
import courseService from '@/services/courseService'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const Lesson = () => {
  const { courseSlug, lessonSlug } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch song song cả course (lấy sidebar) và lesson (lấy nội dung)
        const [courseRes, lessonRes] = await Promise.all([
          courseService.getBySlug(courseSlug),
          lessonService.getBySlug(lessonSlug)
        ])
        setCourse(courseRes.data)
        setLesson(lessonRes.data)
      } catch (error) {
        console.error(error)
        message.error('Không thể tải bài học')
        navigate(`/courses/${courseSlug}`)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [courseSlug, lessonSlug, navigate])

  // 2. Tính toán Navigation (Prev/Next)
  const { prevLesson, nextLesson, currentIndex } = useMemo(() => {
    if (!course || !lesson) return {}
    const lessons = course.lessons || []
    const idx = lessons.findIndex((l) => l.slug === lesson.slug)
    return {
      prevLesson: idx > 0 ? lessons[idx - 1] : null,
      nextLesson: idx < lessons.length - 1 ? lessons[idx + 1] : null,
      currentIndex: idx
    }
  }, [course, lesson])

  // 3. Handle Complete
  const handleComplete = async () => {
    setCompleting(true)
    try {
      await lessonService.markComplete(lesson._id)
      message.success('Đã hoàn thành bài học! 🎉')

      // Update UI state locally
      setLesson((prev) => ({ ...prev, isCompleted: true }))

      // Auto next lesson sau 1.5s
      if (nextLesson) {
        setTimeout(() => {
          navigate(`/learn/${courseSlug}/${nextLesson.slug}`)
        }, 1500)
      }
    } catch (error) {
      message.error(error.response?.data?.error || 'Lỗi xử lý')
    } finally {
      setCompleting(false)
    }
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang tải bài học..." />
      </div>
    )

  if (!lesson || !course) return null

  // Sidebar Menu Items
  const menuItems = course.lessons.map((l, idx) => ({
    key: l.slug,
    icon: l.type === 'video' ? <PlayCircleOutlined /> : <FileTextOutlined />,
    label: (
      <div className="flex justify-between items-center w-full">
        <span className="truncate">{`${idx + 1}. ${l.title}`}</span>
        {/* Note: Cần logic check completed của từng bài trong list, tạm thời chưa có trong API getCourse */}
      </div>
    ),
    onClick: () => {
      navigate(`/learn/${courseSlug}/${l.slug}`)
      setMobileDrawerOpen(false)
    }
  }))

  return (
    <Layout className="h-screen overflow-hidden">
      {/* HEADER */}
      <Header className="bg-white border-b px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Button
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block"
          />
          <Button
            icon={<MenuUnfoldOutlined />}
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden"
          />
          <Title level={5} className="!m-0 truncate max-w-[200px] md:max-w-md">
            {course.title}
          </Title>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm hidden sm:inline">
            Tiến độ:{' '}
            {Math.round(
              ((currentIndex + (lesson.isCompleted ? 1 : 0)) /
                course.lessons.length) *
                100
            )}
            %
          </span>
          <Progress
            type="circle"
            percent={Math.round(
              ((currentIndex + (lesson.isCompleted ? 1 : 0)) /
                course.lessons.length) *
                100
            )}
            width={32}
          />
          <Button
            type="text"
            onClick={() => navigate(`/courses/${courseSlug}`)}
          >
            Thoát
          </Button>
        </div>
      </Header>

      <Layout>
        {/* SIDEBAR (Desktop) */}
        <Sider
          theme="light"
          width={300}
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="border-r hidden md:block overflow-y-auto"
        >
          <div className="p-4 font-bold text-gray-500 border-b">
            Nội dung khóa học
          </div>
          <Menu
            mode="inline"
            selectedKeys={[lessonSlug]}
            items={menuItems}
            className="border-none"
          />
        </Sider>

        {/* DRAWER (Mobile) */}
        <Drawer
          placement="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          width={300}
          bodyStyle={{ padding: 0 }}
        >
          <div className="p-4 font-bold text-gray-500 border-b">
            Nội dung khóa học
          </div>
          <Menu
            mode="inline"
            selectedKeys={[lessonSlug]}
            items={menuItems}
            className="border-none"
          />
        </Drawer>

        {/* MAIN CONTENT AREA */}
        <Content className="bg-gray-50 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm min-h-[80vh] flex flex-col">
            {/* 1. Video Player */}
            {lesson.videoUrl && (
              <div className="w-full aspect-video bg-black rounded-t-xl overflow-hidden">
                <ReactPlayer
                  url={lesson.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  playing={false}
                />
              </div>
            )}

            {/* 2. Content */}
            <div className="p-6 md:p-10 flex-1">
              <Title level={2}>{lesson.title}</Title>

              <div className="prose max-w-none mb-8 text-gray-700">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>

              {/* Vocabulary Preview Section (Tạm thời) */}
              {lesson.vocabularies?.length > 0 && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-700 mb-2">
                    Từ vựng trong bài:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lesson.vocabularies.map((v) => (
                      <span
                        key={v._id}
                        className="px-2 py-1 bg-white rounded border border-blue-200 text-sm font-medium cursor-pointer hover:bg-blue-100 transition"
                      >
                        {v.word} 🔊
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Footer Navigation */}
            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex items-center justify-between sticky bottom-0 z-10">
              <Button
                icon={<LeftOutlined />}
                disabled={!prevLesson}
                onClick={() =>
                  navigate(`/learn/${courseSlug}/${prevLesson.slug}`)
                }
              >
                Bài trước
              </Button>

              {lesson.isCompleted ? (
                <Button
                  type="primary"
                  className="bg-green-600 hover:bg-green-500 px-8"
                  icon={<CheckCircleFilled />}
                  onClick={() =>
                    nextLesson &&
                    navigate(`/learn/${courseSlug}/${nextLesson.slug}`)
                  }
                >
                  {nextLesson ? 'Bài tiếp theo' : 'Hoàn thành khóa học'}
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  loading={completing}
                  onClick={handleComplete}
                  className="px-8 font-bold"
                >
                  Hoàn thành bài học
                </Button>
              )}

              <Button
                disabled={!nextLesson}
                onClick={() =>
                  navigate(`/learn/${courseSlug}/${nextLesson.slug}`)
                }
              >
                Bài sau <RightOutlined />
              </Button>
            </div>
          </div>
          <div className="h-10"></div> {/* Spacer bottom */}
        </Content>
      </Layout>
    </Layout>
  )
}

export default Lesson
