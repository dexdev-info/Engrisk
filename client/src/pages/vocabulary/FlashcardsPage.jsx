import { Spin, Empty, Progress, Button, Typography } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useReviewQueue } from '../../hooks/useReviewQueue'
import { useFlashcardReview } from '../../hooks/useFlashcardReview'
import ReviewFlashcard from '../../components/review/ReviewFlashcard'

const { Title } = Typography

const FlashcardsPage = () => {
  const navigate = useNavigate()
  const { queue, loading: queueLoading } = useReviewQueue()

  // Hook logic review
  const review = useFlashcardReview(queue)

  // 1. Loading State
  if (queueLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] gap-4">
        <Spin size="large" />
        <p className="text-gray-500">Đang chuẩn bị thẻ bài...</p>
      </div>
    )
  }

  // 2. Empty / Done State
  if (!queue.length || review.done) {
    return (
      <div className="max-w-md mx-auto pt-20 px-6 text-center animate-fade-in">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🎉</div>
          <Title level={3}>Tuyệt vời!</Title>
          <p className="text-gray-500 mb-8">
            Bạn đã hoàn thành phiên ôn tập hôm nay. Hãy quay lại vào ngày mai
            nhé!
          </p>
          <Button
            type="primary"
            size="large"
            block
            shape="round"
            onClick={() => navigate('/vocabulary/my')}
          >
            Về trang cá nhân
          </Button>
        </div>
      </div>
    )
  }

  const vocab = review.current.vocabulary

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate('/vocabulary/my')}
        >
          Thoát
        </Button>
        <div className="text-gray-500 font-medium">
          {review.index + 1} / {review.total}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 px-2">
        <Progress
          percent={Math.round((review.index / review.total) * 100)}
          showInfo={false}
          strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
          trailColor="#f0f0f0"
          size="small"
        />
      </div>

      {/* FLASHCARD AREA */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        {/* The Card */}
        <ReviewFlashcard
          vocab={vocab}
          isFlipped={review.isFlipped}
          onFlip={review.flip}
          onCorrect={() => review.submit(true)}
          onWrong={() => review.submit(false)}
        />

        {/* CONTROLS (Chỉ hiện khi đã lật thẻ) */}
        <div
          className={`transition-opacity duration-300 ${review.isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="flex items-center justify-center gap-6">
            {/* Nút Quên */}
            <button
              onClick={() => review.submit(false)}
              disabled={review.submitting}
              className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl border-2 border-red-100 hover:bg-red-100 hover:scale-110 transition-all shadow-sm"
            >
              <CloseOutlined />
            </button>

            <div className="text-gray-400 text-sm font-medium">
              Đã nhớ từ này chưa?
            </div>

            {/* Nút Nhớ */}
            <button
              onClick={() => review.submit(true)}
              disabled={review.submitting}
              className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-2xl border-2 border-green-100 hover:bg-green-100 hover:scale-110 transition-all shadow-sm"
            >
              <CheckOutlined />
            </button>
          </div>
        </div>

        {/* Keyboard Hint */}
        {!review.isFlipped && (
          <p className="text-center text-sm text-gray-400 animate-pulse">
            Bấm <b>Space</b> hoặc chạm để lật thẻ
          </p>
        )}
      </div>
    </div>
  )
}

export default FlashcardsPage
