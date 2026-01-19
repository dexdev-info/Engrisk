import { useState } from 'react'
import { Alert, Skeleton, Typography, Button, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'

import MyVocabStatsGrid from '../../components/my-vocabulary/MyVocabStatsGrid.jsx'
import MyVocabProgress from '../../components/my-vocabulary/MyVocabProgress.jsx'
import MyVocabQuickActions from '../../components/my-vocabulary/MyVocabQuickActions.jsx'
import VocabularySearch from '../../components/vocabulary/VocabularySearch.jsx'
import VocabularyList from '../../components/vocabulary/VocabularyList.jsx'
import VocabularyModal from '../../components/vocabulary/VocabularyModal.jsx'

import { useMyVocabularyList } from '../../hooks/useMyVocabularyList.js'
import { useVocabularyList } from '../../hooks/useVocabularyList.js'

const { Title, Text } = Typography

const MyVocabularyPage = () => {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [selectedVocab, setSelectedVocab] = useState(null)

  // --- DATA 1: STATS (Dashboard) ---
  const {
    statistics,
    loading: statsLoading,
    error: statsError
  } = useMyVocabularyList({
    page: 1,
    limit: 1
  })

  // === DATA 2: SEARCH RESULTS (Chỉ lấy khi có search) ===
  // Logic: Chỉ fetch khi không rỗng
  const shouldSearch = search.trim().length > 0

  const {
    vocabs,
    loading: searchLoading,
    error: searchError
  } = useVocabularyList({
    search: shouldSearch ? search : '',
    limit: 20
  })

  // === HANDLERS ===
  const handleCloseModal = () => setSelectedVocab(null)

  // Callback cập nhật lại list khi save/unsave trong modal (nếu cần)
  // Ở đây public search list tự quản lý state local nên không cần reload lại trang

  // === RENDER HELPERS ===
  // 1. Render Dashboard (Mặc định)
  const renderDashboard = () => {
    // Loading State
    if (statsLoading && !statistics) {
      return (
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton active className="md:col-span-2" paragraph={{ rows: 6 }} />
          <Skeleton active className="md:col-span-1" paragraph={{ rows: 6 }} />
        </div>
      )
    }

    // Error State
    if (statsError)
      return (
        <Alert
          type="error"
          title="Lỗi tải dữ liệu"
          description={statsError}
          showIcon
        />
      )

    const hasData = statistics?.total > 0

    // ! Lấy số lượng từ cần ôn
    const dueCount = statistics?.dueForReview || 0

    if (!hasData) {
      return (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 text-center animate-fade-in">
          <div className="text-4xl mb-4">🌱</div>
          <Title level={4} className="text-gray-700">
            Chưa có từ vựng nào
          </Title>
          <Text type="secondary">
            Hãy nhập từ khóa vào ô tìm kiếm phía trên để bắt đầu hành trình nhé!
          </Text>
        </div>
      )
    }

    return (
      <div className="animate-fade-in space-y-8">
        {/* Stats Grid */}
        <MyVocabStatsGrid statistics={statistics} />

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  📊 Tiến độ học tập
                </h3>
                <p className="text-gray-400 text-sm">
                  Hành trình chinh phục từ vựng
                </p>
              </div>
              {/* Left: Progress Chart */}
              <MyVocabProgress
                total={statistics.total}
                mastered={statistics.mastered}
              />
            </div>
          </div>
          {/* Right: Quick Actions */}
          <div className="md:col-span-1">
            {/* Truyền prop dueCount vào component con */}
            <MyVocabQuickActions dueCount={dueCount} />
          </div>
        </div>
      </div>
    )
  }

  // 2. Render Search Results
  const renderSearchResults = () => {
    return (
      <div className="animate-fade-in-up bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
        <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">
              Kết quả tìm kiếm
            </span>
            <Text type="secondary">
              Từ khóa:{' '}
              <span className="font-medium text-green-600">"{search}"</span>
            </Text>
          </div>

          <button
            onClick={() => setSearch('')}
            className="text-sm px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors font-medium"
          >
            ✕ Đóng tìm kiếm
          </button>
        </div>

        <VocabularyList
          vocabs={vocabs}
          loading={searchLoading}
          error={searchError}
          onSelect={setSelectedVocab}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen space-y-8">
      {/* === HEADER === */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Title
            level={2}
            style={{ margin: 0, fontWeight: 800, color: '#1f2937' }}
          >
            My Vocabulary
          </Title>
          <Text className="text-gray-500 text-base">
            Quản lý kho tàng kiến thức
          </Text>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-96">
          <VocabularySearch value={search} onChange={setSearch} />
        </div>
      </div>

      {/* === BODY CONTENT === */}
      {/* UI sẽ tự động switch khi search state thay đổi (sau 400ms) */}
      {shouldSearch ? renderSearchResults() : renderDashboard()}

      {/* === MODAL === */}
      {selectedVocab && (
        <VocabularyModal
          open={!!selectedVocab}
          vocabId={selectedVocab._id}
          vocabSlug={selectedVocab.slug}
          initialVocab={selectedVocab}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default MyVocabularyPage
