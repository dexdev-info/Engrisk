// import { useState } from 'react'
// import { lessonService } from '../../services/lessonService.js'
// import { useDebounce } from '../../hooks/useDebounce.js'

// const LessonNotes = ({ lessonId, initialNotes }) => {
//   const [notes, setNotes] = useState(initialNotes || '')

//   useDebounce(notes, 1000, async (val) => {
//     if (!lessonId) return

//     await lessonService.saveNotes({
//       lessonId,
//       notes: val
//     })
//   })

//   return (
//     <section>
//       <h3 className="font-semibold mb-2">Ghi chú</h3>
//       <textarea
//         value={notes}
//         onChange={(e) => setNotes(e.target.value)}
//         className="w-full border rounded-lg p-3 min-h-[120px]"
//         placeholder="Viết ghi chú của bạn..."
//       />
//     </section>
//   )
// }

// export default LessonNotes

import { useState } from 'react'
import {
  LoadingOutlined,
  CheckCircleFilled,
  FileTextOutlined
} from '@ant-design/icons'
import { lessonService } from '../../services/lessonService.js'
import { useDebounce } from '../../hooks/useDebounce.js'

const LessonNotes = ({ lessonId, initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || '')
  // Thêm state để báo trạng thái lưu
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved

  useDebounce(notes, 1000, async (val) => {
    if (!lessonId) return

    // 1. Bắt đầu lưu
    setSaveStatus('saving')

    try {
      await lessonService.saveNotes({
        lessonId,
        notes: val
      })
      // 2. Lưu thành công
      setSaveStatus('saved')

      // Reset về idle sau 2s để ẩn thông báo
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Save notes failed', error)
      setSaveStatus('idle')
    }
  })

  return (
    <section className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
      {/* Header nhỏ gọn */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <FileTextOutlined />
          <span>Ghi chú cá nhân</span>
        </div>

        {/* Status Indicator */}
        <div className="text-xs font-medium transition-all duration-300">
          {saveStatus === 'saving' && (
            <span className="text-gray-400 flex items-center gap-1">
              <LoadingOutlined /> Đang lưu...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircleFilled /> Đã lưu
            </span>
          )}
        </div>
      </div>

      {/* Textarea: Style giấy viết (Font Serif, nền trắng, không viền focus thô) */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="
          w-full min-h-[140px] resize-none
          bg-white rounded-lg p-4
          border border-gray-200 focus:border-gray-400
          focus:outline-none focus:ring-0 focus:shadow-sm
          font-serif text-gray-700 leading-relaxed
          placeholder:font-sans placeholder:text-gray-400 placeholder:italic
          transition-all duration-200
        "
        placeholder="Ghi lại những điểm quan trọng trong bài học..."
      />
    </section>
  )
}

export default LessonNotes
