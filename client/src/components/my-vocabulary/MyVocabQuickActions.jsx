import { useMemo } from 'react'
import { Card, Tooltip, Tag } from 'antd'
import {
  ThunderboltOutlined,
  RetweetOutlined,
  AppstoreOutlined,
  RightOutlined,
  LockOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

// --- 1. Sub-component: ActionItem (UI thuần túy) ---
const ActionItem = ({
  icon,
  title,
  desc,
  onClick,
  primary = false,
  disabled = false,
  badgeCount = 0
}) => {
  // Logic styles: (Tailwind + Antd Colors) Tách biệt để dễ đọc
  const getStyles = () => {
    if (disabled)
      return {
        wrapper: 'bg-gray-50 border-transparent opacity-60 cursor-not-allowed',
        iconBox: 'bg-gray-200 text-gray-400',
        text: 'text-gray-500'
      }
    if (primary)
      return {
        wrapper:
          'bg-green-50 border-green-200 shadow-sm hover:shadow-md hover:border-green-300 cursor-pointer',
        iconBox: 'bg-green-500 text-white shadow-green-200',
        text: 'text-green-700 font-bold'
      }
    // default
    return {
      wrapper:
        'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200 cursor-pointer',
      iconBox:
        'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-green-600 group-hover:shadow-sm',
      text: 'text-gray-700 font-medium'
    }
  }

  const styles = getStyles()

  const Content = (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${styles.wrapper}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="flex items-center gap-3">
        {/* Icon Box */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-colors ${styles.iconBox}`}
        >
          {icon}
        </div>

        {/* Text Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${styles.text}`}>{title}</span>
            {badgeCount > 0 && (
              <Tag
                color="red"
                className="m-0 rounded-full px-2 text-xs border-none"
              >
                {badgeCount}
              </Tag>
            )}
          </div>
          <span className="text-xs text-gray-400 font-medium">{desc}</span>
        </div>
      </div>

      {/* Status Icon */}
      {disabled ? (
        <LockOutlined className="text-gray-300 text-xs" />
      ) : (
        <RightOutlined className={`text-xs ${styles.arrow}`} />
      )}
    </div>
  )

  return disabled ? <Tooltip title="Coming soon!">{Content}</Tooltip> : Content
}

// --- 2. Main Component ---
const MyVocabQuickActions = ({ dueCount = 0 }) => {
  const navigate = useNavigate()

  // Data-Driven: Cấu hình menu tại đây. Dễ dàng thêm mục mới.
  const menuItems = useMemo(
    () => [
      {
        key: 'review-today',
        title: 'Ôn tập hôm nay',
        desc:
          dueCount > 0
            ? 'Đừng để bị quên kiến thức'
            : 'Đã hoàn thành xuất sắc!',
        icon: <ThunderboltOutlined />,
        primary: dueCount > 0, // Logic highlight
        badgeCount: dueCount,
        path: '/vocabulary/review'
      },
      {
        key: 'flashcards',
        title: 'Học Flashcards',
        desc: 'Luyện tập ngẫu nhiên',
        icon: <RetweetOutlined />,
        primary: false,
        path: '/vocabulary/review/flashcards'
      },
      {
        key: 'divider', // Marker để render dòng kẻ
        type: 'divider'
      },
      {
        key: 'quiz',
        title: 'Quiz Challenge',
        desc: 'Kiểm tra mức độ ghi nhớ',
        icon: <AppstoreOutlined />,
        primary: false,
        disabled: true // Feature flag
      }
    ],
    [dueCount]
  )

  return (
    <Card
      className="shadow-sm border-gray-100 h-full"
      title={
        <span className="text-base font-bold text-gray-800">Luyện tập</span>
      }
      variant={true}
      classNames={{ body: 'p-4 flex flex-col gap-3' }}
    >
      {menuItems.map((item) =>
        item.type === 'divider' ? (
          <div key={item.key} className="h-px bg-gray-100 my-1" />
        ) : (
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
        )
      )}
    </Card>
  )
}

export default MyVocabQuickActions
