import { Progress } from 'antd'
import { TrophyFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const MyVocabProgress = ({ total = 0, mastered = 0 }) => {
  const navigate = useNavigate()

  if (!total) return null

  const percent = Math.round((mastered / total) * 100)

  return (
    <div
      onClick={() => navigate('/vocabulary/my/mastered')}
      className="group cursor-pointer flex flex-col items-center"
    >
      {/* 1. Circular Progress */}
      <div className="relative transition-transform duration-300 group-hover:scale-105">
        <Progress
          type="circle"
          percent={percent}
          size={180} // Kích thước lớn, chiếm trọn không gian
          strokeColor="#000000"
          railColor="#f3f4f6" // Màu nền xám nhạt
          strokeWidth={4} // Nét mảnh, tinh tế
          format={(p) => (
            <div className="flex flex-col items-center justify-center -mt-2">
              <span className="text-5xl font-serif font-bold text-gray-900 leading-none mb-1">
                {p}%
              </span>
              <span className="text-xs text-gray-400 font-sans uppercase tracking-widest font-medium">
                Mastery
              </span>
            </div>
          )}
        />

        {/* Glow effect (Ẩn, hiện khi hover) */}
        <div className="absolute inset-0 rounded-full bg-gray-200 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
      </div>

      {/* 2. Footer Stats (Pill Shape) */}
      <div className="mt-8">
        <div
          className="
          inline-flex items-center gap-3 px-5 py-2.5 
          bg-gray-50 rounded-full border border-gray-100 
          group-hover:bg-white group-hover:border-gray-300 group-hover:shadow-sm
          transition-all duration-300
        "
        >
          <TrophyFilled className="text-yellow-500 text-lg" />
          <span className="text-sm text-gray-600">
            <strong className="text-gray-900 font-bold">{mastered}</strong>
            <span className="mx-1 text-gray-400">/</span>
            {total} từ đã thuộc
          </span>
        </div>
      </div>
    </div>
  )
}

export default MyVocabProgress
