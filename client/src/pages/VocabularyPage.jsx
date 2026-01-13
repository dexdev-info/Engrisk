import { useState } from 'react'
import VocabularySearch from '../components/vocabulary/VocabularySearch.jsx'
import VocabularyLevelGrid from '../components/vocabulary/VocabularyLevelGrid.jsx'
import VocabularyList from '../components/vocabulary/VocabularyList.jsx'
import VocabularyModal from '../components/vocabulary/VocabularyModal.jsx'
import { useVocabularyList } from '../hooks/useVocabularyList.js'

const VocabularyPage = () => {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [selectedVocab, setSelectedVocab] = useState(null)

  const shouldFetch = Boolean(search || level)

  const { vocabs, loading, error } = useVocabularyList({
    search,
    level,
    page: 1,
    limit: 30
  })

  const handleSelectLevel = (lvl) => {
    setLevel(lvl)
    setSearch('')
  }

  const handleSearch = (value) => {
    setSearch(value)
    if (value) setLevel('')
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Search */}
      <VocabularySearch value={search} onChange={handleSearch} />

      {/* Entry view */}
      {!shouldFetch && <VocabularyLevelGrid onSelect={handleSelectLevel} />}

      {/* Result list */}
      {shouldFetch && (
        <VocabularyList
          vocabs={vocabs}
          loading={loading}
          error={error}
          onSelect={setSelectedVocab}
        />
      )}

      {/* Modal */}
      {selectedVocab && (
        <VocabularyModal
          open={true}
          vocabId={selectedVocab._id}
          vocabSlug={selectedVocab.slug}
          initialVocab={selectedVocab}
          onClose={() => setSelectedVocab(null)}
        />
      )}
    </div>
  )
}

export default VocabularyPage
