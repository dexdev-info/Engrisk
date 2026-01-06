// components/vocabulary/ReviewCard.jsx
import { Button } from 'antd'
import { useState } from 'react'
import { vocabularyService } from '../../services/vocabularyService.js'

const ReviewCard = ({ vocab, onNext }) => {
  const [showAnswer, setShowAnswer] = useState(false)

  const submitReview = async (isCorrect) => {
    await vocabularyService.review(vocab._id, isCorrect)
    onNext()
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl">
      <div className="text-center text-2xl font-bold mb-4">{vocab.word}</div>

      {!showAnswer ? (
        <Button onClick={() => setShowAnswer(true)}>Hiện nghĩa</Button>
      ) : (
        <>
          <p className="mt-4">{vocab.meaning}</p>
          <div className="flex gap-4 justify-center mt-6">
            <Button danger onClick={() => submitReview(false)}>
              Chưa nhớ
            </Button>
            <Button type="primary" onClick={() => submitReview(true)}>
              Nhớ rồi
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default ReviewCard
