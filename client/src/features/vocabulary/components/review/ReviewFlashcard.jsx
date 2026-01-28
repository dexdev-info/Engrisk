import { motion } from 'framer-motion'
import {
  SoundOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SwapOutlined
} from '@ant-design/icons'
import { useAudioPlayer } from '@/shared/hooks/useAudioPlayer.js'

const SWIPE_THRESHOLD = 100

const ReviewFlashcard = ({ vocab, isFlipped, onFlip, onCorrect, onWrong }) => {
  // Audio Player
  const { play, isLoading: audioLoading } = useAudioPlayer(vocab?.audioUrl, {
    autoStop: true
  })

  const handleAudioClick = (e) => {
    e.stopPropagation()
    play()
  }

  return (
    <div
      className="w-full max-w-sm md:max-w-md mx-auto py-8"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full aspect-3/4 md:aspect-4/3 h-80 cursor-pointer"
        // Animation Lật
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.5,
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}
        style={{ transformStyle: 'preserve-3d' }}
        // Interaction: Chỉ cho phép kéo khi đã lật (mặt sau)
        onClick={onFlip}
        drag={isFlipped ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2} // Kéo dãn nhẹ tạo cảm giác vật lý
        onDragEnd={(_, info) => {
          if (!isFlipped) return
          if (info.offset.x > SWIPE_THRESHOLD) onCorrect() // Kéo phải -> Đúng
          if (info.offset.x < -SWIPE_THRESHOLD) onWrong() // Kéo trái -> Sai
        }}
        whileTap={{ scale: 0.98, cursor: 'grabbing' }}
      >
        {/* === FRONT (Mặt trước - Câu hỏi) === */}
        <div
          className="
            absolute inset-0 
            bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 
            flex flex-col items-center justify-center p-8 text-center
          "
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Label nhỏ */}
          <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            Vocabulary
          </span>

          {/* Word: Serif to, đậm */}
          <h2 className="text-5xl font-serif font-bold text-gray-900 mb-2 tracking-tight">
            {vocab.word}
          </h2>

          {/* Pronunciation */}
          {vocab.pronunciation && (
            <div className="text-gray-400 font-mono text-lg mb-8">
              /{vocab.pronunciation}/
            </div>
          )}

          {/* Audio Button: Minimalist Circle */}
          <button
            onClick={handleAudioClick}
            className={`
              w-12 h-12 rounded-full border flex items-center justify-center transition-all
              ${
                audioLoading
                  ? 'border-gray-100 text-gray-300'
                  : 'border-gray-200 text-gray-600 hover:border-black hover:text-black hover:scale-105'
              }
            `}
          >
            <SoundOutlined className="text-lg" />
          </button>

          <div className="absolute bottom-6 text-gray-300 text-xs flex items-center gap-2">
            <SwapOutlined /> Chạm để lật
          </div>
        </div>

        {/* === BACK (Mặt sau - Đáp án) === */}
        <div
          className="
            absolute inset-0 
            bg-gray-50 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-200 
            flex flex-col items-center justify-center p-8 text-center
          "
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Label */}
          <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Meaning
          </span>

          {/* Meaning */}
          <p className="text-2xl font-medium text-gray-800 mb-6 leading-relaxed">
            {vocab.meaning}
          </p>

          <div className="w-12 h-px bg-gray-300 mb-6"></div>

          {/* Example: Serif Italic */}
          {vocab.example && (
            <div className="max-w-[80%]">
              <p className="text-lg text-gray-600 font-serif italic leading-relaxed">
                "{vocab.example}"
              </p>
            </div>
          )}

          {/* Swipe Indicators (Chỉ hiện ở mặt sau) */}
          <div className="absolute bottom-6 w-full px-8 flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-red-400 flex items-center gap-1">
              <CloseCircleOutlined /> Quên (Kéo trái)
            </span>
            <span className="text-emerald-500 flex items-center gap-1">
              (Kéo phải) Nhớ <CheckCircleOutlined />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ReviewFlashcard
