import { useState } from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined, FireOutlined } from '@ant-design/icons'
import VocabSearch from '../components/vocab/VocabSearch.jsx'
import VocabLevelGrid from '../components/vocab/VocabLevelGrid.jsx'
import VocabList from '../components/vocab/VocabList.jsx'
import VocabModal from '../components/vocab/VocabModal.jsx'
import { useVocabList } from '../hooks/useVocabList.js'

const PublicVocabPage = () => {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [selectedVocab, setSelectedVocab] = useState(null)

  // Logic: Fetch khi có từ khóa search HOẶC đã chọn level
  const shouldFetch = Boolean(search || level)

  // Fetch Data & Helper Update từ Hook
  const {
    vocabs,
    loading,
    error,
    updateVocabLocal
  } = useVocabList({
    search: shouldFetch ? search : '',
    level: shouldFetch ? level : '',
    page: 1,
    limit: 30
  })

  // --- HANDLERS ---
  const handleSelectLevel = (value) => {
    setLevel(value)
    setSearch('') // Reset search nếu chọn level
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Cuộn lên đầu trang
  }

  const handleSearch = (value) => {
    setSearch(value)
    if (value) setLevel('') // Reset level nếu search
  }

  const handleBackToGrid = () => {
    setLevel('')
    setSearch('')
  }

  // Update trạng thái Save ngay lập tức ở client
  const handleSavedChange = (vocabId, saved) => {
    // 1. Update List bên ngoài (dùng hàm của hook)
    updateVocabLocal(vocabId, { isSaved: saved })

    // 2. Update Modal (nếu đang mở)
    setSelectedVocab((prev) =>
      prev?._id === vocabId ? { ...prev, isSaved: saved } : prev
    )
  }

  const handleCloseModal = () => {
    setSelectedVocab(null)
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. SEARCH BAR AREA */}
      <div className="max-w-2xl">
        <VocabSearch value={search} onChange={handleSearch} />
      </div>

      {/* 2. CONTENT AREA */}
      {!shouldFetch ? (
        /* --- VIEW 1: LANDING (GRID LEVELS) --- */
        <div className="animate-fade-in">
          {/* Section Title */}
          <h2 className="text-xl font-inter font-bold! text-gray-900 mb-6! flex items-center gap-2">
            <FireOutlined className="text-gray-400" /> Chủ đề phổ biến
          </h2>
          <VocabLevelGrid onSelect={handleSelectLevel} />
        </div>
      ) : (
        /* --- VIEW 2: RESULTS LIST --- */
        <div className="animate-fade-in">
          {/* Result Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              {/* Nút Back: Chỉ hiện khi chọn Level để user quay lại grid dễ dàng */}
              {level && (
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBackToGrid}
                  className="text-gray-500! hover:text-black! hover:bg-gray-100! rounded-full!"
                >
                  Quay lại
                </Button>
              )}

              {/* Title */}
              <h2 className="text-2xl font-inter font-bold text-gray-900 m-0 leading-none">
                {level
                  ? `Cấp độ: ${level.charAt(0).toUpperCase() + level.slice(1)}`
                  : `Kết quả cho "${search}"`}
              </h2>
            </div>

            {/* Counter */}
            {!loading && vocabs?.length > 0 && (
              <span className="text-sm font-medium text-gray-400 font-sans bg-gray-50 px-3 py-1 rounded-full">
                {vocabs.length} kết quả
              </span>
            )}
          </div>

          <VocabList
            vocabs={vocabs}
            loading={loading}
            error={error}
            onSelect={setSelectedVocab}
          />
        </div>
      )}

      {/* 3. MODAL DETAIL */}
      {selectedVocab && (
        <VocabModal
          open={!!selectedVocab}
          vocabId={selectedVocab._id}
          vocabSlug={selectedVocab.slug}
          initialVocab={selectedVocab}
          onClose={handleCloseModal}
          onSavedChange={(saved) => handleSavedChange(selectedVocab._id, saved)}
        />
      )}
    </div>
  )
}

export default PublicVocabPage
