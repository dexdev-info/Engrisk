import { Button, Progress, Tag } from 'antd'
import {
  CheckOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  HistoryOutlined
} from '@ant-design/icons'

const CourseDetailActionCard = ({
  course,
  isEnrolled,
  enrolling,
  onEnroll,
  onResume
}) => {
  if (!course) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
      {/* Image Cover */}
      <div className="relative h-48 bg-gray-100">
        <img
          alt={course.title}
          src={course.thumbnail || 'https://via.placeholder.com/400x250'}
          className="w-full h-full object-cover"
        />
        {/* Price Tag Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">Miễn phí</span>
            <span className="text-sm text-gray-300 line-through decoration-gray-400">
              1.200.000đ
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* CTA Button Area */}
        {isEnrolled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                <CheckOutlined /> Đã đăng ký
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(course.enrollmentData?.progressPercentage || 0)}%
                hoàn thành
              </span>
            </div>

            <Progress
              percent={course.enrollmentData?.progressPercentage}
              showInfo={false}
              strokeColor="#000000" // Thanh tiến độ màu đen
              size="small"
              className="mt-5!"
            />

            <Button
              type="primary"
              size="large"
              block
              onClick={onResume}
              className="bg-black! text-white! hover:bg-gray-800! border-none font-bold h-12 rounded-lg mt-5!"
            >
              TIẾP TỤC HỌC
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            size="large"
            block
            loading={enrolling}
            onClick={onEnroll}
            className="bg-black! text-white! hover:bg-gray-800! border-none font-bold h-12 rounded-lg shadow-xl shadow-gray-200 mt-5!"
          >
            ĐĂNG KÝ NGAY
          </Button>
        )}

        {/* Benefits List */}
        <div className="mt-8 space-y-4 pt-6 border-t border-gray-100">
          <h4 className="font-bold text-sm text-gray-900 mb-5!">Khóa học bao gồm:</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <HistoryOutlined className="mt-0.5 text-gray-400" />
              <span>Truy cập trọn đời không giới hạn</span>
            </li>
            <li className="flex items-start gap-3">
              <MobileOutlined className="mt-0.5 text-gray-400" />
              <span>Học trên mọi thiết bị (Mobile, Web)</span>
            </li>
            <li className="flex items-start gap-3">
              <SafetyCertificateOutlined className="mt-0.5 text-gray-400" />
              <span>Cấp chứng chỉ khi hoàn thành</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailActionCard
