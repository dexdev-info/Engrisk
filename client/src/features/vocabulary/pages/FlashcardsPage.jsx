import { Spin, Progress, Button } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  TrophyFilled
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useReviewQueue } from '../hooks/useReviewQueue'
import { useFlashcardReview } from '../hooks/useFlashcardReview'
import ReviewFlashcard from '../components/review/ReviewFlashcard'

const FlashcardsPage = () => {
  const navigate = useNavigate()
  const { queue, loading: queueLoading } = useReviewQueue()

  // Hook logic review
  const review = useFlashcardReview(queue)

  // 1. Loading State
  if (queueLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-6 bg-white">
        <Spin size="large" />
        <p className="text-gray-400 font-serif italic text-lg">
          Đang chuẩn bị thẻ bài...
        </p>
      </div>
    )
  }

  // 2. Empty / Done State (Editorial Style)
  if (!queue.length || review.done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 animate-fade-in">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-yellow-100 rounded-full scale-150 opacity-50 blur-xl"></div>
            <TrophyFilled className="text-6xl text-yellow-400 relative z-10" />
          </div>

          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Tuyệt vời!
          </h2>
          <p className="text-gray-500 text-lg font-sans mb-10 leading-relaxed">
            Bạn đã hoàn thành phiên ôn tập hôm nay.
            <br />
            Hãy quay lại vào ngày mai để duy trì chuỗi học tập nhé.
          </p>

          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/vocabulary/my')}
            className="h-12 px-8 rounded-full bg-black text-white hover:!bg-gray-800 border-none font-bold text-base shadow-xl shadow-gray-200"
          >
            Về trang cá nhân
          </Button>
        </div>
      </div>
    )
  }

  const vocab = review.current.vocabulary
  const progressPercent = Math.round((review.index / review.total) * 100)

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-2xl mx-auto px-6 py-8">
      {/* HEADER: Minimal */}
      <div className="flex items-center justify-between mb-8">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate('/vocabulary/my')}
          className="text-gray-400 hover:text-black transition-colors pl-0"
        >
          Thoát
        </Button>
        <div className="text-gray-900 font-mono font-bold text-lg tracking-widest">
          {String(review.index + 1).padStart(2, '0')}
          <span className="text-gray-300 mx-2">/</span>
          {String(review.total).padStart(2, '0')}
        </div>
      </div>

      {/* PROGRESS BAR: Black Minimal */}
      <div className="mb-12">
        <Progress
          percent={progressPercent}
          showInfo={false}
          strokeColor="#000000" // Màu đen quyền lực
          trailColor="#f3f4f6"
          size="small"
          className="!m-0"
        />
      </div>

      {/* FLASHCARD AREA */}
      <div className="flex-1 flex flex-col items-center md:justify-center w-full relative">
        {/* The Card */}
        <div className="w-full mb-7">
          <ReviewFlashcard
            vocab={vocab}
            isFlipped={review.isFlipped}
            onFlip={review.flip}
            onCorrect={() => review.submit(true)}
            onWrong={() => review.submit(false)}
          />
        </div>

        {/* CONTROLS (Floating Action Buttons) */}
        <div
          className={`
            fixed bottom-10 left-0 right-0 px-6 flex justify-center gap-8 
            md:static md:p-0 md:transform-none
            transition-all duration-300 ease-out
            ${review.isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        >
          {/* Nút Quên (Trái) */}
          <button
            onClick={() => review.submit(false)}
            disabled={review.submitting}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 rounded-full border border-gray-200 bg-white text-gray-400 group-hover:border-red-500 group-hover:text-red-500 group-hover:bg-red-50 transition-all flex items-center justify-center text-2xl shadow-sm">
              <CloseOutlined />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 group-hover:text-red-400 transition-colors">
              Quên
            </span>
          </button>

          {/* Nút Nhớ (Phải) */}
          <button
            onClick={() => review.submit(true)}
            disabled={review.submitting}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 rounded-full border border-gray-200 bg-white text-gray-400 group-hover:border-emerald-500 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all flex items-center justify-center text-2xl shadow-sm">
              <CheckOutlined />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 group-hover:text-emerald-500 transition-colors">
              Đã nhớ
            </span>
          </button>
        </div>

        {/* Keyboard Hint */}
        {!review.isFlipped && (
          <div className="fixed bottom-12 md:static md:mt-1 text-gray-500 text-sm font-mono animate-pulse">
            [ Space to Flip ]
          </div>
        )}
      </div>
    </div>
  )
}

export default FlashcardsPage
