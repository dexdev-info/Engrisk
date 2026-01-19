import React from 'react'
import { Empty, Skeleton } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import VocabularyCard from './VocabularyCard.jsx'

const VocabularyList = ({ vocabs, loading, error, onSelect }) => {
  // 1. Loading State: Dùng Skeleton thay vì Spin
  // Render giả 6 cái card để người dùng hình dung được layout
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="p-6 border border-gray-100 rounded-xl bg-white h-48 flex flex-col justify-between"
          >
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: '40%' }} />
            <Skeleton.Button active size="small" style={{ width: 80 }} />
          </div>
        ))}
      </div>
    )
  }

  // 2. Error State: Style nhẹ nhàng hơn, tránh dùng text đỏ chói
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <WarningOutlined className="text-2xl mb-2 text-gray-400" />
        <span className="font-medium">Có lỗi xảy ra: {error}</span>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm underline hover:text-gray-800"
        >
          Tải lại trang
        </button>
      </div>
    )
  }

  // 3. Empty State: Minimalist style
  if (!vocabs || vocabs.length === 0) {
    return (
      <div className="py-20">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-gray-400">
              Không tìm thấy từ vựng nào phù hợp.
            </span>
          }
        />
      </div>
    )
  }

  // 4. Success State
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {vocabs.map((v) => (
        <VocabularyCard key={v._id} vocab={v} onOpen={onSelect} />
      ))}
    </div>
  )
}

export default VocabularyList
