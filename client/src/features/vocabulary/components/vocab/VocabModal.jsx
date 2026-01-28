import { Modal, Button, Divider, Skeleton, Tooltip } from 'antd'
import {
  StarOutlined,
  StarFilled,
  SoundOutlined,
  CloseOutlined,
  BookOutlined,
  SwapRightOutlined
} from '@ant-design/icons'

import { useVocab } from '@/features/vocabulary/hooks/useVocab.js'
import { useVocabSave } from '@/features/vocabulary/hooks/useVocabSave.js'
import { useAudioPlayer } from '@/shared/hooks/useAudioPlayer.js'

const VocabModal = ({
  open,
  vocabId,
  vocabSlug,
  initialVocab,
  onClose,
  onSavedChange
}) => {
  const hasInitial = Boolean(initialVocab)
  const { vocab, loading, error } = useVocab({
    id: vocabId,
    slug: vocabSlug,
    enabled: !hasInitial
  })

  const data = vocab || initialVocab
  const audio = useAudioPlayer(data?.audioUrl)

  const {
    saved,
    loading: saving,
    toggleSave
  } = useVocabSave({
    vocabId: data?._id,
    initialSaved: data?.isSaved,
    onSavedChange
  })

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      destroyOnHidden
      closeIcon={
        <CloseOutlined className="text-gray-400 hover:text-black transition-colors text-lg" />
      }
      className="editorial-modal"
      // Style override cho Modal
      styles={{
        content: { borderRadius: '24px', padding: 0, overflow: 'hidden' }, // Bo góc to hơn
        body: { padding: 0 } // Reset padding để tự control
      }}
    >
      {loading && !data ? (
        <div className="p-12">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      ) : error && !initialVocab ? (
        <div className="text-center text-red-500 py-12 px-6">
          <p>Không thể tải thông tin từ vựng.</p>
          <Button onClick={onClose}>Đóng</Button>
        </div>
      ) : data ? (
        <div className="flex flex-col">
          {/* 1. HERO SECTION (Image & Word) */}
          <div className="relative bg-gray-50 p-8 md:p-10 border-b border-gray-100">
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1">
                {/* Word */}
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-2">
                  {data.word}
                </h1>

                {/* Pronunciation & Audio */}
                <div className="flex items-center gap-3 text-gray-500 text-lg font-mono mb-4">
                  {data.pronunciation && <span>/{data.pronunciation}/</span>}

                  {data.audioUrl && (
                    <button
                      onClick={audio.toggle}
                      disabled={audio.isLoading}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-black hover:text-black transition-all shadow-sm"
                    >
                      {audio.isPlaying ? (
                        <span className="animate-pulse">🔊</span>
                      ) : (
                        <SoundOutlined />
                      )}
                    </button>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-600">
                    {data.partOfSpeech}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-600">
                    {data.level}
                  </span>
                  {data.userVocabulary?.status && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${
                        data.userVocabulary.status === 'mastered'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      <BookOutlined /> {data.userVocabulary.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button (Save) */}
              <Tooltip title={saved ? 'Bỏ lưu' : 'Lưu vào từ điển của bạn'}>
                <Button
                  type="text"
                  loading={saving}
                  onClick={toggleSave}
                  className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white bg-transparent border border-transparent hover:border-gray-200 transition-all"
                >
                  {saved ? (
                    <StarFilled className="text-2xl text-yellow-400" />
                  ) : (
                    <StarOutlined className="text-2xl text-gray-400 hover:text-gray-600" />
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* 2. CONTENT SECTION */}
          <div className="p-8 md:p-10 space-y-8 bg-white">
            {/* Meaning & Image Layout */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                {/* Meaning */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Định nghĩa
                  </h3>
                  <p className="text-xl text-gray-800 leading-relaxed font-medium">
                    {data.meaning}
                  </p>
                </div>

                {/* Example */}
                {data.example && (
                  <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-black">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Ví dụ
                    </h3>
                    <p className="text-lg text-gray-700 font-serif italic mb-1">
                      "{data.example}"
                    </p>
                    {data.exampleTranslation && (
                      <p className="text-sm text-gray-500 font-sans">
                        {data.exampleTranslation}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Image (Right side) */}
              {data.imageUrl && (
                <div className="md:col-span-1">
                  <img
                    src={data.imageUrl}
                    alt={data.word}
                    className="w-full h-auto rounded-xl object-cover border border-gray-100 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Synonyms / Antonyms */}
            {(data.synonyms?.length > 0 || data.antonyms?.length > 0) && (
              <>
                <Divider className="border-gray-100" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.synonyms?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <SwapRightOutlined /> Đồng nghĩa
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.synonyms.map((s) => (
                          <span
                            key={s}
                            className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-transparent hover:border-gray-300 transition-colors cursor-default"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.antonyms?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <SwapRightOutlined className="rotate-180" /> Trái nghĩa
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.antonyms.map((a) => (
                          <span
                            key={a}
                            className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-transparent hover:border-gray-300 transition-colors cursor-default"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

export default VocabModal

{
  /* {data.relatedWords?.length > 0 && (
            <>
              <Divider />
              <div>
                <h4 className="font-semibold mb-2">Từ liên quan</h4>
                <div className="flex flex-wrap gap-2">
                  {data.relatedWords.map((w) => (
                    <Tag key={w._id}>{w.word}</Tag>
                  ))}
                </div>
              </div>
            </>
          )} */
}

{
  /* ===== REVIEW INFO ===== */
}
{
  /* {data.userVocabulary && (
            <>
              <Divider />
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <TrophyOutlined /> Lần ôn tập:{' '}
                  {data.userVocabulary.reviewCount}
                </div>
                {data.userVocabulary.nextReviewAt && (
                  <div>
                    ⏭️ Ôn tiếp:{' '}
                    {new Date(
                      data.userVocabulary.nextReviewAt
                    ).toLocaleDateString()}
                  </div>
                )}
              </div>
            </>
          )} */
}
