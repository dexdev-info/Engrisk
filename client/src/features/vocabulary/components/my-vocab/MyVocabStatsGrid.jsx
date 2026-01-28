import { useNavigate } from 'react-router-dom'
import {
  AppstoreFilled,
  ReadFilled,
  SyncOutlined,
  TrophyFilled
} from '@ant-design/icons'

import MyVocabStatCard from './MyVocabStatCard.jsx'

const MyVocabStatsGrid = ({ statistics }) => {
  const navigate = useNavigate()

  if (!statistics) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
      {/* 1. TOTAL: Màu xám trung tính (Default) */}
      <MyVocabStatCard
        title="Tổng"
        count={statistics.total}
        icon={<AppstoreFilled />}
        color="default"
        onClick={() => navigate('/vocabulary/my')}
      />

      {/* 2. LEARNING: Màu Cam */}
      <MyVocabStatCard
        title="Đang học"
        count={statistics.learning}
        icon={<ReadFilled />}
        color="orange"
        onClick={() => navigate('/vocabulary/my/learning')}
      />

      {/* 3. REVIEWING: Màu Xanh */}
      {/* Thêm hiệu ứng spin nhẹ nếu có từ cần ôn */}
      <MyVocabStatCard
        title="Cần ôn"
        count={statistics.reviewing}
        icon={<SyncOutlined spin={statistics.reviewing > 0} />}
        color="blue"
        onClick={() => navigate('/vocabulary/my/reviewing')}
      />

      {/* 4. MASTERED: Màu Xanh lá (Thành công/Kết quả) */}
      <MyVocabStatCard
        title="Đã thuộc"
        count={statistics.mastered}
        icon={<TrophyFilled />}
        color="green"
        onClick={() => navigate('/vocabulary/my/mastered')}
      />
    </div>
  )
}

export default MyVocabStatsGrid
