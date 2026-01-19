import { motion } from 'framer-motion'
import { SoundOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useAudioPlayer } from '../../hooks/useAudioPlayer.js'

const SWIPE_THRESHOLD = 100

const ReviewFlashcard = ({
  vocab, // Nhận nguyên object vocab để lấy audio
  isFlipped,
  onFlip,
  onCorrect,
  onWrong
}) => {
  // Audio Player cho flashcard
  const { play, isLoading: audioLoading } = useAudioPlayer(vocab?.audioUrl, {
    autoStop: true
  })

  // Ngăn sự kiện click lật thẻ khi bấm vào nút Audio
  const handleAudioClick = (e) => {
    e.stopPropagation()
    play()
  }

  return (
    <div className="w-full max-w-md mx-auto" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-80 cursor-pointer"
        // Animation
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.4,
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}
        style={{ transformStyle: 'preserve-3d' }}
        // Interaction
        onClick={onFlip}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2} // Tạo cảm giác kéo giãn
        onDragEnd={(_, info) => {
          if (!isFlipped) return // Chỉ swipe được khi đã lật
          if (info.offset.x > SWIPE_THRESHOLD) onCorrect()
          if (info.offset.x < -SWIPE_THRESHOLD) onWrong()
        }}
      >
        {/* === FRONT (Mặt trước) === */}
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-gray-400 text-sm uppercase tracking-wider mb-4">
            Từ vựng
          </span>
          <h2 className="text-4xl font-bold text-gray-800 text-center">
            {vocab.word}
          </h2>

          <div className="mt-6">
            <Button
              shape="circle"
              icon={<SoundOutlined />}
              loading={audioLoading}
              onClick={handleAudioClick} // Nghe audio mà không lật
            />
          </div>
          <div className="absolute bottom-4 text-gray-400 text-xs">
            Chạm để lật
          </div>
        </div>

        {/* === BACK (Mặt sau) === */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center justify-center p-6 text-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <span className="text-blue-400 text-sm uppercase tracking-wider mb-2">
            Nghĩa
          </span>
          <p className="text-xl font-medium text-gray-800 mb-4">
            {vocab.meaning}
          </p>

          {vocab.pronunciation && (
            <div className="text-gray-500 italic mb-4">
              /{vocab.pronunciation}/
            </div>
          )}

          {vocab.example && (
            <div className="bg-white/60 p-3 rounded-lg text-sm text-gray-600 italic">
              "{vocab.example}"
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ReviewFlashcard
