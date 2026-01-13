import { Spin, Empty } from 'antd'
import VocabularyCard from './VocabularyCard.jsx'

const VocabularyList = ({ vocabs, loading, error, onSelect }) => {
  if (loading) return <Spin />
  if (error) return <div className="text-red-500">{error}</div>
  if (!vocabs.length) return <Empty description="Không tìm thấy từ vựng" />

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vocabs.map((v) => (
        <VocabularyCard key={v._id} vocab={v} onOpen={onSelect} />
      ))}
    </div>
  )
}

export default VocabularyList
