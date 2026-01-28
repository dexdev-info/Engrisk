import { useParams, useNavigate } from 'react-router-dom'
import { Button, Spin, Empty } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import VocabList from '../components/vocab/VocabList.jsx'
import { useMyVocabList } from '../hooks/useMyVocabList.js'

const STATUS_META = {
  learning: {
    title: 'Từ đang học',
    desc: 'Những từ bạn mới lưu và đang làm quen'
  },
  reviewing: {
    title: 'Từ đang ôn tập',
    desc: 'Những từ cần củng cố trí nhớ'
  },
  mastered: {
    title: 'Từ đã thành thạo',
    desc: 'Những từ bạn đã ghi nhớ vững'
  }
}

const MyVocabListPage = () => {
  const { status } = useParams()
  const navigate = useNavigate()

  const meta = STATUS_META[status]

  const { vocabs, loading, error } = useMyVocabList({
    status,
    limit: 50
  })

  if (!meta) {
    return <Empty description="Trạng thái không hợp lệ" />
  }

  // map userVocab -> Vocab
  const vocabList = vocabs.map((v) => ({
    ...v.vocabulary,
    userVocabulary: {
      status: v.status,
      nextReviewAt: v.nextReviewAt
    }
  }))

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/vocabulary/my')}
        />
        <div>
          <h1 className="text-2xl font-bold">{meta.title}</h1>
          <p className="text-sm text-gray-500">{meta.desc}</p>
        </div>
      </div>

      {/* Content */}
      {loading && <Spin />}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !vocabList.length && (
        <Empty description="Chưa có từ vựng nào" />
      )}

      <VocabList
        vocabs={vocabList}
        loading={loading}
        error={error}
        onSelect={(vocab) => navigate(`/vocabulary?word=${vocab.slug}`)}
      />
    </div>
  )
}

export default MyVocabListPage
