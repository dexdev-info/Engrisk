import { Tabs, ConfigProvider } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { ReadOutlined, StarOutlined, StarFilled } from '@ant-design/icons'

const VocabTabs = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Logic xác định tab đang active
  const activeKey = pathname.startsWith('/vocabulary/my') ? 'my' : 'public'

  const items = [
    {
      key: 'public',
      label: (
        <span className="flex items-center gap-2 text-base">
          <ReadOutlined />
          Từ điển chung
        </span>
      )
    },
    {
      key: 'my',
      label: (
        <span className="flex items-center gap-2 text-base">
          {/* Đổi icon ngôi sao đặc/rỗng tùy trạng thái active để thêm phần tinh tế */}
          {activeKey === 'my' ? <StarFilled /> : <StarOutlined />}
          Từ vựng của tôi
        </span>
      )
    }
  ]

  return (
    // Dùng ConfigProvider để override màu xanh mặc định thành Đen (Black)
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemColor: '#6b7280', // Gray-500 (Inactive)
            itemSelectedColor: '#000000', // Black (Active)
            itemHoverColor: '#1f2937', // Gray-800 (Hover)
            inkBarColor: '#000000', // Thanh gạch chân màu đen
            titleFontSize: 16, // Chữ to hơn chút cho dễ đọc
            itemActiveColor: '#000000',
            horizontalItemGutter: 40 // Khoảng cách giữa 2 tab rộng ra cho thoáng
          }
        }
      }}
    >
      <Tabs
        activeKey={activeKey}
        onChange={(key) => {
          if (key === 'public') navigate('/vocabulary')
          if (key === 'my') navigate('/vocabulary/my')
        }}
        items={items}
        // Bỏ đường viền xám dưới cùng của toàn bộ thanh Tab để nhìn nó "phẳng" vào nền hơn
        className="custom-tabs-minimal font-medium"
        tabBarStyle={{ borderBottom: '1px solid #f3f4f6' }} // Viền siêu mờ
      />
    </ConfigProvider>
  )
}

export default VocabTabs