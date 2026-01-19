import { Modal, Button, Tag, Divider, Spin } from 'antd'
import {
  StarOutlined,
  SoundOutlined,
  BookOutlined,
} from '@ant-design/icons'

import { useVocabulary } from '../../hooks/useVocabulary.js'
import { useVocabularySave } from '../../hooks/useVocabularySave.js'
import { useAudioPlayer } from '../../hooks/useAudioPlayer.js'

const VocabularyModal = ({
  open,
  vocabId,
  vocabSlug,
  initialVocab,
  onClose,
  onSavedChange
}) => {
  const hasInitial = Boolean(initialVocab)
  const { vocab, loading, error } = useVocabulary({
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
  } = useVocabularySave({
    vocabId: data?._id,
    initialSaved: data?.isSaved,
    onSavedChange
  })

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnHidden
    >
      {loading && (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      )}

      {error && !initialVocab && (
        <div className="text-center text-red-500 py-8">
          Không thể tải từ vựng
        </div>
      )}

      {data && (
        <div className="space-y-5">
          {/* ===== HEADER ===== */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {data.word}
                {data.audioUrl && (
                  <Button
                    type="text"
                    icon={<SoundOutlined />}
                    onClick={audio.toggle}
                    loading={audio.isLoading}
                  />
                )}
              </h2>

              {data.pronunciation && (
                <div className="italic text-gray-500">
                  /{data.pronunciation}/
                </div>
              )}

              {data.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={data.imageUrl}
                    alt={data.word}
                    className="max-h-48 rounded-lg object-contain"
                  />
                </div>
              )}
            </div>

            <Button
              type={saved ? 'default' : 'primary'}
              icon={<StarOutlined />}
              loading={saving}
              onClick={toggleSave}
            >
              {saved ? 'Bỏ lưu' : 'Lưu từ'}
            </Button>
          </div>

          {/* ===== META ===== */}
          <div className="flex flex-wrap gap-2">
            <Tag color="green">{data.level}</Tag>
            <Tag>{data.partOfSpeech}</Tag>

            {data.userVocabulary?.status && (
              <Tag
                icon={<BookOutlined />}
                color={
                  data.userVocabulary.status === 'mastered' ? 'green' : 'gold'
                }
              >
                {data.userVocabulary.status.toUpperCase()}
              </Tag>
            )}
          </div>

          {/* ===== MEANING ===== */}
          <div>
            <h4 className="font-semibold">Nghĩa</h4>
            <p>{data.meaning}</p>
          </div>

          {/* ===== EXAMPLE ===== */}
          {data.example && (
            <div>
              <h4 className="font-semibold">Ví dụ</h4>
              <p className="italic">{data.example}</p>
              {data.exampleTranslation && (
                <p className="text-sm text-gray-500">
                  {data.exampleTranslation}
                </p>
              )}
            </div>
          )}

          <Divider />

          {/* ===== SYNONYMS / ANTONYMS ===== */}
          {(data.synonyms?.length > 0 || data.antonyms?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.synonyms?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Synonyms</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.synonyms.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {data.antonyms?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Antonyms</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.antonyms.map((a) => (
                      <Tag key={a}>{a}</Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* {data.relatedWords?.length > 0 && (
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
          )} */}

          {/* ===== REVIEW INFO ===== */}
          {/* {data.userVocabulary && (
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
          )} */}
        </div>
      )}
    </Modal>
  )
}

export default VocabularyModal
