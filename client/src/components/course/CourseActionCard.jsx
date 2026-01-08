import { Card, Button, Tag, Divider, Progress, Typography } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const CourseActionCard = ({
  course,
  isEnrolled,
  enrolling,
  onEnroll,
  onResume
}) => {
  if (!course) return null

  return (
    <Card
      cover={
        <img
          alt={course.title}
          src={course.thumbnail || 'https://via.placeholder.com/400x250'}
          className="h-48 object-cover"
        />
      }
      className="shadow-lg border-0 overflow-hidden rounded-xl"
    >
      <div className="text-center">
        <Title level={2} className="!text-blue-600 !mb-1">
          Miễn phí
        </Title>

        <Text type="secondary" className="line-through">
          1.200.000đ
        </Text>
        <Tag color="red" className="ml-2">
          FREE
        </Tag>

        <Divider className="my-4" />

        {isEnrolled ? (
          <>
            <Tag color="success" className="mb-3">
              ✓ Đã đăng ký
            </Tag>

            {course.enrollmentData && (
              <div className="mb-4 text-left">
                <div className="text-sm text-gray-600 mb-1">
                  Tiến độ khóa học
                </div>
                <Progress
                  percent={course.enrollmentData.progressPercentage}
                  strokeColor={{
                    from: '#108ee9',
                    to: '#87d068'
                  }}
                  size="small"
                />
              </div>
            )}

            <Button
              type="primary"
              size="large"
              block
              className="h-12 text-lg font-bold bg-green-600 hover:bg-green-500 border-none"
              onClick={onResume}
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
            onClick={onEnroll}
          >
            ĐĂNG KÝ NGAY
          </Button>
        )}

        <div className="mt-4 space-y-2 text-left text-gray-600 text-sm">
          <p className="flex items-center gap-2">
            <CheckCircleOutlined className="text-green-500" /> Truy cập trọn đời
          </p>
          <p className="flex items-center gap-2">
            <CheckCircleOutlined className="text-green-500" /> Học trên mọi
            thiết bị
          </p>
          <p className="flex items-center gap-2">
            <CheckCircleOutlined className="text-green-500" /> Cấp chứng chỉ khi
            hoàn thành
          </p>
        </div>
      </div>
    </Card>
  )
}

export default CourseActionCard
