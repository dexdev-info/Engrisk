// pages/ReviewHubPage.jsx
import { useNavigate } from 'react-router-dom'
import { Card, Button, Spin, Empty } from 'antd'

import { useMyVocabularyList } from '../../hooks/useMyVocabularyList.js'
import MyVocabStatsGrid from '../../components/my-vocabulary/MyVocabStatsGrid.jsx'

const ReviewHubPage = () => {
  const navigate = useNavigate()

  const { vocabs: dueVocabs, loading } = useMyVocabularyList({
    due: true,
    limit: 50
  })

  const dueCount = dueVocabs.length

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-bold">Ôn tập từ vựng</h1>
        <p className="text-gray-500 mt-1">
          Củng cố trí nhớ bằng Spaced Repetition
        </p>
      </div>

      {/* ===== TODAY REVIEW ===== */}
      <Card className="bg-green-50 border-none">
        {loading ? (
          <Spin />
        ) : dueCount === 0 ? (
          <Empty description="Hôm nay không có từ nào cần ôn 🎉" />
        ) : (
          <div className="space-y-3">
            <div className="text-xl font-semibold">
              🔥 {dueCount} từ cần ôn hôm nay
            </div>

            <div className="flex gap-4">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/vocabulary/review/flashcards')}
              >
                Ôn bằng Flashcards
              </Button>

              <Button
                size="large"
                onClick={() => navigate('/vocabulary/review/quiz')}
              >
                Ôn bằng Quiz
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ===== PROGRESS ===== */}
      <MyVocabStatsGrid />
    </div>
  )
}

export default ReviewHubPage
