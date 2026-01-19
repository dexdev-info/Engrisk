// components/my-vocabulary/MyVocabStatsGrid.jsx
import { useNavigate } from 'react-router-dom'
import {
  BookOutlined,
  SyncOutlined,
  TrophyOutlined,
  AppstoreOutlined
} from '@ant-design/icons'

import MyVocabStatCard from './MyVocabStatCard.jsx'

const COLOR_MAP = {
  blue: 'bg-blue-100 text-blue-600',
  gold: 'bg-yellow-100 text-yellow-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600'
}

const MyVocabStatsGrid = ({ statistics }) => {
  const navigate = useNavigate()

  if (!statistics) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* TOTAL */}
      <MyVocabStatCard
        title="Tổng từ vựng"
        count={statistics.total}
        icon={<AppstoreOutlined />}
        color={COLOR_MAP.blue}
        onClick={() => navigate('/vocabulary/my')}
      />

      {/* LEARNING */}
      <MyVocabStatCard
        title="Đang học"
        count={statistics.learning}
        icon={<BookOutlined />}
        color={COLOR_MAP.gold}
        onClick={() => navigate('/vocabulary/my/learning')}
      />

      {/* REVIEWING */}
      <MyVocabStatCard
        title="Đang ôn tập"
        count={statistics.reviewing}
        icon={<SyncOutlined />}
        color={COLOR_MAP.purple}
        onClick={() => navigate('/vocabulary/my/reviewing')}
      />

      {/* MASTERED */}
      <MyVocabStatCard
        title="Đã thành thạo"
        count={statistics.mastered}
        icon={<TrophyOutlined />}
        color={COLOR_MAP.green}
        onClick={() => navigate('/vocabulary/my/mastered')}
      />
    </div>
  )
}

export default MyVocabStatsGrid
