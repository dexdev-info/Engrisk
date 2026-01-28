import { memo } from 'react'
import { Button, Tooltip } from 'antd'
import {
  SoundOutlined,
  StarOutlined,
  StarFilled,
  LoadingOutlined
} from '@ant-design/icons'

import { useAudioPlayer } from '@/shared/hooks/useAudioPlayer.js'
import { useVocabSave } from '@/features/vocabulary/hooks/useVocabSave.js'

const VocabCard = ({ vocab, onOpen, onSavedChange }) => {
  const {
    word,
    pronunciation,
    meaning,
    audioUrl,
    level, // Có thể dùng hoặc không
    partOfSpeech,
    isSaved
  } = vocab

  // Audio
  const {
    play,
    isLoading: audioLoading,
    error: audioError
  } = useAudioPlayer(audioUrl)

  // Save
  const {
    saved,
    loading: saving,
    toggleSave
  } = useVocabSave({
    vocabId: vocab._id,
    initialSaved: isSaved,
    onSavedChange
  })

  return (
    <div
      className="
        group relative h-full flex flex-col justify-between
        bg-white p-5 rounded-2xl
        border border-gray-200 transition-all duration-300
        hover:border-black hover:shadow-sm
        cursor-pointer
      "
      onClick={() => onOpen?.(vocab)}
    >
      {/* ===== 1. Top Section: Word & Info ===== */}
      <div>
        <div className="flex justify-between items-start mb-2">
          {/* Word & Part of Speech */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight group-hover:underline decoration-2 underline-offset-4">
              {word}
            </h3>

            {/* Dictionary Style: /phiên âm/ • (loại từ) */}
            <div className="flex items-center gap-2 mt-1 text-sm font-serif text-gray-500 italic">
              {pronunciation && <span>{pronunciation}</span>}
              {partOfSpeech && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300 not-italic"></span>
                  <span>({partOfSpeech})</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Meaning */}
        <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3 font-sans">
          {meaning}
        </p>
      </div>

      {/* ===== 2. Bottom Section: Actions & Meta ===== */}
      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
        {/* Level Badge (Minimalist) */}
        {level ? (
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
            {level}
          </span>
        ) : (
          <div></div> // Spacer nếu không có level
        )}

        {/* Action Buttons: Dùng text button cho thoáng */}
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Audio Button */}
          {audioUrl && (
            <Tooltip title="Nghe phát âm">
              <Button
                type="text"
                size="small"
                shape="circle"
                className="flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100"
                onClick={play}
                disabled={!!audioError}
                icon={audioLoading ? <LoadingOutlined /> : <SoundOutlined />}
              />
            </Tooltip>
          )}

          {/* Save Button */}
          <Tooltip title={saved ? 'Bỏ lưu' : 'Lưu từ'}>
            <Button
              type="text"
              size="small"
              shape="circle"
              loading={saving}
              className={`flex items-center justify-center hover:bg-gray-100 transition-colors ${
                saved ? 'text-black' : 'text-gray-300 hover:text-gray-600'
              }`}
              onClick={toggleSave}
              icon={saved ? <StarFilled /> : <StarOutlined />}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default memo(VocabCard)
