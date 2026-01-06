import { useState } from 'react'
import VocabularyModal from './VocabularyModal.jsx'

const LessonVocabulary = ({ vocabularies }) => {
  const [active, setActive] = useState(null)

  return (
    <section>
      <h3 className="font-semibold mb-3">Từ vựng</h3>

      <div className="flex flex-wrap gap-2">
        {vocabularies.map((v) => (
          <button
            key={v._id}
            onClick={() => setActive(v)}
            className="px-3 py-1 rounded bg-blue-50 text-blue-700"
          >
            {v.word}
          </button>
        ))}
      </div>

      {active && (
        <VocabularyModal vocab={active} onClose={() => setActive(null)} />
      )}
    </section>
  )
}

export default LessonVocabulary
