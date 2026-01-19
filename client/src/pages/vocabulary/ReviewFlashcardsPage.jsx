// pages/ReviewFlashcardsPage.jsx
import { Button, Spin, Empty, Progress } from 'antd'
import { useReviewQueue } from '../../hooks/useReviewQueue.js'
import { useFlashcardReview } from '../../hooks/useFlashcardReview.js'
import ReviewFlashcard from '../../components/review/ReviewFlashcard.jsx'

const ReviewFlashcardsPage = () => {
  const { queue, loading } = useReviewQueue()
  const review = useFlashcardReview(queue)

  if (loading) return <Spin />

  if (!queue.length)
    return <Empty description="Không có từ nào cần ôn hôm nay 🎉" />

  if (review.done)
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold">🎉 Hoàn thành!</h2>
        <p>Bạn đã ôn xong hôm nay</p>
      </div>
    )

  const vocab = review.current.vocabulary

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Progress
        percent={Math.round(((review.index + 1) / review.total) * 100)}
      />

      <ReviewFlashcard
        front={vocab.word}
        back={
          <div className="space-y-3">
            <p className="text-lg">{vocab.meaning}</p>
            {vocab.example && (
              <p className="italic text-gray-600">{vocab.example}</p>
            )}
          </div>
        }
        isFlipped={review.isFlipped}
        onFlip={review.flip}
        onCorrect={() => review.submit(true)}
        onWrong={() => review.submit(false)}
      />

      <p className="text-center text-sm text-gray-400 mt-4">
        Space: lật thẻ • ← chưa nhớ • → nhớ rồi • Swipe để trả lời
      </p>

      {review.isFlipped && (
        <div className="flex justify-center gap-4">
          <Button danger size="large" onClick={() => review.submit(false)}>
            Chưa nhớ
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => review.submit(true)}
          >
            Nhớ rồi
          </Button>
        </div>
      )}
    </div>
  )
}

export default ReviewFlashcardsPage
