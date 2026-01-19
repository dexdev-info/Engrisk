import { useState } from 'react'
import VocabularyModal from '../vocabulary/VocabularyModal.jsx'

const LessonVocabulary = ({ vocabularies }) => {
  const [vocabs, setVocabs] = useState(vocabularies)
  const [active, setActive] = useState(null)

  const handleToggleSaved = (vocabId, saved) => {
    setVocabs((prev) =>
      prev.map((v) => (v._id === vocabId ? { ...v, isSaved: saved } : v))
    )
  }

  return (
    <section>
      <h3 className="font-semibold mb-3">Từ vựng</h3>

      <div className="flex flex-wrap gap-2">
        {vocabs.map((v) => (
          <button
            key={v._id}
            onClick={() => setActive(v)}
            className={`px-3 py-1 rounded ${
              v.isSaved
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            {v.word}
          </button>
        ))}
      </div>

      {active && (
        <VocabularyModal
          // key={active._id}
          open={true}
          vocabId={active._id}
          vocabSlug={active.slug}
          initialVocab={active}
          onClose={() => setActive(null)}
          onSavedChange={(saved) => handleToggleSaved(active._id, saved)}
        />
      )}
    </section>
  )
}

export default LessonVocabulary
