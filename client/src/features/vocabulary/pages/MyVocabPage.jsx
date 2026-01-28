import { useState, useEffect, useRef } from 'react'
import { Alert, Skeleton, Button } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

import MyVocabStatsGrid from '../components/my-vocab/MyVocabStatsGrid.jsx'
import MyVocabProgress from '../components/my-vocab/MyVocabProgress.jsx'
import MyVocabQuickActions from '../components/my-vocab/MyVocabActions.jsx'
import VocabSearch from '../components/vocab/VocabSearch.jsx'
import VocabList from '../components/vocab/VocabList.jsx'
import VocabModal from '../components/vocab/VocabModal.jsx'

import { useMyVocabList } from '../hooks/useMyVocabList.js'
import { useVocabList } from '../hooks/useVocabList.js'

const MyVocabPage = () => {
  const [search, setSearch] = useState('')
  const [selectedVocab, setSelectedVocab] = useState(null)
  // State local cho Statistics để tự cộng trừ số lượng
  const [statistics, setStatistics] = useState(null)

  // --- DATA 1: STATS (Dashboard) ---
  const {
    statistics: fetchedStatistics,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useMyVocabList({ page: 1, limit: 1 })

  // Sync data từ API vào state local
  // Dùng ref để track xem đây có phải lần đầu load không
  const isFirstLoad = useRef(true)

  useEffect(() => {
    // Chỉ sync khi:
    // 1. Có dữ liệu từ API
    // 2. VÀ (Là lần đầu load HOẶC statistics hiện tại đang null)
    // Điều này ngăn việc API cũ ghi đè lên số liệu mới mà ta vừa update tay
    if (fetchedStatistics) {
      setStatistics(fetchedStatistics)
      isFirstLoad.current = false
    }
  }, [fetchedStatistics]) // Thêm statistics vào dep để check null

  // === DATA 2: SEARCH RESULTS (Chỉ lấy khi có search) ===
  // Logic: Chỉ fetch khi không rỗng
  const shouldFetch = search.trim().length > 0

  const {
    vocabs,
    loading: searchLoading,
    error: searchError,
    updateVocabLocal
  } = useVocabList({
    search: shouldFetch ? search : '',
    limit: 20
  })

  // === HANDLERS ===
  // CORE LOGIC: Đồng bộ trạng thái mọi nơi
  const handleSavedChange = (vocabId, isSaved) => {
    // 1. Update danh sách tìm kiếm (Search List)
    updateVocabLocal(vocabId, { isSaved })

    // 2. Update Modal (nếu đang mở đúng từ đó)
    setSelectedVocab((prev) =>
      prev?._id === vocabId ? { ...prev, isSaved } : prev
    )

    // 3. Update Statistics (Cộng/Trừ số lượng)
    if (statistics) {
      setStatistics((prev) => {
        // Tính toán delta
        const delta = isSaved ? 1 : -1

        return {
          ...prev,
          // Tổng số: Tăng hoặc giảm
          total: Math.max(0, prev.total + delta),

          // Learning: Giả sử từ mới lưu vào 'learning', bỏ lưu thì trừ đi
          // (Logic tương đối, nhưng đủ tốt cho UX)
          learning: Math.max(0, prev.learning + delta)

          // Due review: Nếu là save mới thì chưa due, nếu unsave từ đang due thì trừ đi
          // (Chỗ này hơi phức tạp nên ta có thể giữ nguyên hoặc update tương đối)
        }
      })
    }

    // 4. Background Sync (Quan trọng)
    // Gọi refetch thầm lặng để server trả về số liệu chuẩn xác nhất sau 1-2s
    // Nó sẽ khớp lại với số ta vừa cộng tay
    try {
      refetchStats()
    } catch (e) {
      // Ignore error
    }
  }

  const handleCloseModal = () => setSelectedVocab(null)

  // Callback cập nhật lại list khi save/unsave trong modal (nếu cần)
  // Ở đây public search list tự quản lý state local nên không cần reload lại trang

  // === RENDER HELPERS ===
  // 1. Render Dashboard (Mặc định)
  const renderDashboard = () => {
    // Loading State
    if (statsLoading && !statistics) {
      return (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton active className="mt-8" paragraph={{ rows: 6 }} />
          </div>
          <div className="md:col-span-1">
            <Skeleton.Button
              active
              size="large"
              block
              style={{ height: 200 }}
            />
          </div>
        </div>
      )
    }

    // Error State
    if (statsError) {
      return (
        <Alert
          type="error"
          title="Không thể tải dữ liệu"
          description={statsError}
          showIcon
          className="border-red-100 bg-red-50 text-red-800"
        />
      )
    }

    const hasData = statistics?.total > 0

    // ! Lấy số lượng từ cần ôn
    const dueCount = statistics?.dueForReview || 0

    // Empty State
    if (!hasData) {
      return (
        <div className="py-20 text-center border-t border-gray-100 mt-8">
          <div className="mb-6 text-6xl opacity-90">🌱</div>
          <h3 className="text-xl font-inter font-bold text-gray-900 mb-2">
            Khu vườn từ vựng còn trống
          </h3>
          <p className="text-gray-500 font-sans max-w-md mx-auto">
            Hãy bắt đầu tìm kiếm và lưu lại những từ vựng đầu tiên để xây dựng
            kho kiến thức của riêng bạn.
          </p>
        </div>
      )
    }

    return (
      <div className="animate-fade-in space-y-8">
        {/* Stats Grid */}
        <MyVocabStatsGrid statistics={statistics} />

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
              <div className="mb-6">
                <h3 className="text-xl font-serif font-bold! text-gray-800 flex mb-1!">
                  Biểu đồ học tập
                </h3>
                <p className="text-gray-400 text-sm font-sans">
                  Theo dõi mức độ thông thạo
                </p>
              </div>
              {/* Left: Progress Chart */}
              <div className="flex-1 flex items-center justify-center">
                <MyVocabProgress
                  total={statistics.total}
                  mastered={statistics.mastered}
                />
              </div>
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
      <div className="animate-fade-in mt-8">
        {/* Search Header Wrapper */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm uppercase tracking-wider font-medium mb-1">
              Kết quả tìm kiếm
            </span>
            <span className="text-2xl font-serif font-bold text-gray-900">
              "{search}"
            </span>
          </div>

          <Button
            type="text"
            icon={<CloseCircleOutlined />}
            onClick={() => setSearch('')}
            className="text-gray-400 hover:text-black hover:bg-gray-100 rounded-full h-10 px-4"
          >
            Đóng
          </Button>
        </div>

        <div className="bg-white min-h-[400px]">
          <VocabList
            vocabs={vocabs}
            loading={searchLoading}
            error={searchError}
            onSelect={setSelectedVocab}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen space-y-8">
      {/* === HEADER === */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-9">
        <div>
          <h1 className="text-3xl md:text-3xl font-serif font-bold! text-gray-800 mb-3! tracking-tight">
            My Vocabulary
          </h1>
          <p className="text-gray-500 font-sans text-lg">
            Quản lý và ôn tập kho tàng kiến thức của bạn.
          </p>
        </div>

        {/* Search Bar: Pill Shape */}
        <div className="w-full md:w-100">
          <VocabSearch value={search} onChange={setSearch} />
        </div>
      </div>

      {/* === BODY CONTENT === */}
      {/* UI sẽ tự động switch khi search state thay đổi (sau 400ms) */}
      {shouldFetch ? renderSearchResults() : renderDashboard()}

      {/* === MODAL === */}
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

export default MyVocabPage
