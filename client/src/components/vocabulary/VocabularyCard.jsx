import { memo } from 'react'
import { Button, Tag, Tooltip } from 'antd'
import { SoundOutlined, StarOutlined, StarFilled } from '@ant-design/icons'

import { useAudioPlayer } from '../../hooks/useAudioPlayer.js'
import { useVocabularySave } from '../../hooks/useVocabularySave.js'

const VocabularyCard = ({ vocab, onOpen, onSavedChange }) => {
  const {
    word,
    pronunciation,
    meaning,
    audioUrl,
    level,
    partOfSpeech,
    isSaved
  } = vocab

  // 🔊 Audio
  const {
    play,
    isPlaying,
    isLoading: audioLoading,
    error: audioError
  } = useAudioPlayer(audioUrl)

  // Save
  const {
    saved,
    loading: saving,
    toggleSave
  } = useVocabularySave({
    vocabId: vocab._id,
    initialSaved: isSaved,
    onSavedChange
  })

  return (
    <div
      className="
        relative
        border rounded-xl p-4
        bg-white
        hover:shadow-md transition
        cursor-pointer
      "
      onClick={() => onOpen?.(vocab)}
    >
      {/* ===== Top Right Actions ===== */}
      <div
        className="absolute top-3 right-3 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Audio */}
        {audioUrl && (
          <Tooltip title={audioError || 'Phát âm'}>
            <Button
              size="small"
              shape="circle"
              loading={audioLoading}
              icon={<SoundOutlined />}
              onClick={play}
              disabled={!!audioError}
            />
          </Tooltip>
        )}

        {/* Save */}
        <Tooltip title={saved ? 'Bỏ lưu' : 'Lưu từ'}>
          <Button
            size="small"
            shape="circle"
            loading={saving}
            icon={saved ? <StarFilled /> : <StarOutlined />}
            onClick={toggleSave}
          />
        </Tooltip>
      </div>

      {/* ===== Word ===== */}
      <div className="space-y-1 pr-14">
        <h3 className="text-lg font-semibold">{word}</h3>

        {pronunciation && (
          <div className="text-sm text-gray-500 italic">{pronunciation}</div>
        )}
      </div>

      {/* ===== Meaning ===== */}
      <p className="mt-3 text-gray-700 line-clamp-2">{meaning}</p>

      {/* ===== Meta ===== */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {partOfSpeech && <Tag>{partOfSpeech}</Tag>}
        {/* {level && <Tag color="blue">{level}</Tag>} */}
      </div>
    </div>
  )
}

export default memo(VocabularyCard)
