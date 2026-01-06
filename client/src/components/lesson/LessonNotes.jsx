import { useState } from 'react'
import { lessonService } from '../../services/lessonService.js'
import { useDebounce } from '../../hooks/useDebounce.js'

const LessonNotes = ({ lessonId, initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || '')

  useDebounce(notes, 1000, async (val) => {
    if (!lessonId) return

    await lessonService.saveNotes({
      lessonId,
      notes: val
    })
  })

  return (
    <section>
      <h3 className="font-semibold mb-2">Ghi chú</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border rounded-lg p-3 min-h-[120px]"
        placeholder="Viết ghi chú của bạn..."
      />
    </section>
  )
}

export default LessonNotes
