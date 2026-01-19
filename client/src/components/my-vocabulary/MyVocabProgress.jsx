// components/my-vocabulary/MyVocabProgress.jsx
import { Progress } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const MyVocabProgress = ({ total = 0, mastered = 0 }) => {
  const navigate = useNavigate()

  if (!total) return null

  const percent = Math.round((mastered / total) * 100)

  return (
    <div
      className="
        rounded-xl border bg-white p-5
        hover:shadow-sm transition cursor-pointer
      "
      onClick={() => navigate('/vocabulary/my/mastered')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-medium">
          <TrophyOutlined className="text-green-500" />
          Tiến độ thành thạo
        </div>

        <div className="text-sm text-gray-500">
          {mastered}/{total}
        </div>
      </div>

      {/* Progress bar */}
      <Progress percent={percent} strokeColor="#22c55e" showInfo={false} />

      {/* Footer */}
      <div className="mt-2 text-sm text-gray-500">
        {percent}% từ vựng đã được thành thạo
      </div>
    </div>
  )
}

export default MyVocabProgress
