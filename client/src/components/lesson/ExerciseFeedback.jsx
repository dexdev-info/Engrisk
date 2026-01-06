const ExerciseFeedback = ({ result }) => {
  return (
    <div
      className={`rounded-lg p-4 ${
        result.isCorrect ? 'bg-green-50' : 'bg-red-50'
      }`}
    >
      <div className="font-semibold mb-1">
        {result.isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng'}
      </div>

      {!result.isCorrect && (
        <div className="text-sm text-gray-700">
          Đáp án đúng: <strong>{result.correctAnswer}</strong>
        </div>
      )}

      {result.explanation && (
        <div className="mt-2 text-sm text-gray-600">{result.explanation}</div>
      )}
    </div>
  )
}

export default ExerciseFeedback
