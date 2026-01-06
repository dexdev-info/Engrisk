import { Modal, Button } from 'antd'
import { StarOutlined } from '@ant-design/icons'
import { useVocabularySave } from '../../hooks/useVocabularySave.js'

const VocabularyModal = ({ vocab, onClose }) => {
  const { saved, loading, toggleSave } = useVocabularySave({
    vocabId: vocab._id,
    initialSaved: vocab.isSaved
  })

  return (
    <Modal open onCancel={onClose} footer={null} destroyOnHidden>
      <h3 className="text-xl font-semibold">{vocab.word}</h3>
      <p className="italic text-gray-500">{vocab.pronunciation}</p>

      <p className="mt-3">{vocab.meaning}</p>

      {vocab.example && (
        <div className="mt-3 text-sm text-gray-600">
          <strong>Ví dụ:</strong> {vocab.example}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button
          type={saved ? 'default' : 'primary'}
          icon={<StarOutlined />}
          loading={loading}
          onClick={toggleSave}
        >
          {saved ? 'Bỏ lưu' : 'Lưu từ'}
        </Button>
      </div>
    </Modal>
  )
}

export default VocabularyModal
