// components/my-vocabulary/MyVocabStatCard.jsx
import { Card } from 'antd'

const MyVocabStatCard = ({ title, count, icon, color, onClick }) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      className="rounded-xl shadow-sm transition hover:shadow-md"
      styles={{ body: { padding: 20 } }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`
            flex items-center justify-center
            w-12 h-12 rounded-full
            bg-${color}-100 text-${color}-600
            text-xl
          `}
        >
          {icon}
        </div>

        {/* Content */}
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold">{count}</div>
        </div>
      </div>
    </Card>
  )
}

export default MyVocabStatCard
