import { useMemo } from 'react'
import { Tooltip } from 'antd'
import {
  ThunderboltFilled,
  RetweetOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  LockOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

// --- 1. Sub-component: ActionItem ---
const ActionItem = ({
  icon,
  title,
  desc,
  onClick,
  primary = false,
  disabled = false,
  badgeCount = 0
}) => {
  // Logic Styles: Black & White Theme
  const getStyles = () => {
    if (disabled)
      return {
        container:
          'bg-gray-50 border-transparent opacity-50 cursor-not-allowed',
        icon: 'text-gray-400',
        title: 'text-gray-500',
        desc: 'text-gray-400',
        arrow: 'text-transparent'
      }

    if (primary)
      return {
        // Primary:
        container:
          'bg-gray-900 border-transparent shadow-xl shadow-gray-200 hover:bg-gray-800 cursor-pointer transform hover:-translate-y-1',
        icon: 'text-yellow-400',
        title: 'text-white',
        desc: 'text-gray-400',
        arrow: 'text-white'
      }

    // Default: Trắng viền xám
    return {
      container:
        'bg-white border-gray-100 hover:border-black hover:shadow-md cursor-pointer',
      icon: 'text-gray-900',
      title: 'text-gray-900',
      desc: 'text-gray-500',
      arrow: 'text-gray-300 group-hover:text-black'
    }
  }

  const s = getStyles()

  const Content = (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300
        ${s.container}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`text-2xl ${s.icon}`}>{icon}</div>

        {/* Text Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-base font-bold ${s.title}`}>{title}</span>

            {/* Badge (Chỉ hiện cho Primary) */}
            {primary && badgeCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {badgeCount}
              </span>
            )}
          </div>
          <span className={`text-xs font-medium ${s.desc} mt-0.5`}>{desc}</span>
        </div>
      </div>

      {/* Arrow Icon */}
      <div className={s.arrow}>
        {disabled ? <LockOutlined /> : <ArrowRightOutlined />}
      </div>
    </div>
  )

  return disabled ? (
    <Tooltip title="Tính năng đang phát triển">{Content}</Tooltip>
  ) : (
    Content
  )
}

// --- 2. Main Component ---
const MyVocabActions = ({ dueCount = 0 }) => {
  const navigate = useNavigate()

  const menuItems = useMemo(
    () => [
      {
        key: 'review-today',
        title: 'Ôn tập ngay',
        desc:
          dueCount > 0
            ? `${dueCount} từ đang chờ bạn`
            : 'Bạn đã hoàn thành bài hôm nay',
        icon: <ThunderboltFilled />,
        primary: true, // Black Card
        badgeCount: dueCount,
        path: '/vocabulary/review',
        // disabled: dueCount === 0 // Disable nếu không có bài (hoặc có thể để enable để xem lại)
      },
      {
        key: 'flashcards',
        title: 'Flashcards',
        desc: 'Luyện tập ngẫu nhiên',
        icon: <RetweetOutlined />,
        primary: false,
        path: '/vocabulary/review/flashcards'
      },
      {
        key: 'quiz',
        title: 'Quiz Game',
        desc: 'Thử thách trí nhớ (Sắp ra mắt)',
        icon: <AppstoreOutlined />,
        primary: false,
        disabled: true
      }
    ],
    [dueCount]
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-serif font-bold! text-gray-800 mb-1!">
          Hành động
        </h3>
        <p className="text-gray-400 text-sm font-sans">
          Các phương pháp ôn luyện
        </p>
      </div>

      {/* List Actions */}
      <div className="flex flex-col gap-4 flex-1">
        {menuItems.map((item) => (
          <ActionItem
            key={item.key}
            icon={item.icon}
            title={item.title}
            desc={item.desc}
            primary={item.primary}
            disabled={item.disabled}
            badgeCount={item.badgeCount}
            onClick={() => item.path && navigate(item.path)}
          />
        ))}
      </div>
    </div>
  )
}

export default MyVocabActions
