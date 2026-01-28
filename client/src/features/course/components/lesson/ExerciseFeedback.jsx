import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleOutlined
} from '@ant-design/icons'

const ExerciseFeedback = ({ result }) => {
  if (!result) return null
  const { isCorrect, correctAnswer, explanation } = result

  return (
    <div
      className={`
        mt-3 py-3 px-4 rounded-md text-sm animate-fade-in
        border-l-2 flex flex-col gap-2
        ${
          isCorrect
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-red-500 bg-red-50/50'
        }
      `}
    >
      {/* 1. Status Row */}
      <div className="flex items-center gap-2">
        {isCorrect ? (
          <CheckCircleFilled className="text-emerald-600" />
        ) : (
          <CloseCircleFilled className="text-red-500" />
        )}

        <span
          className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}
        >
          {isCorrect ? 'Chính xác!' : 'Chưa đúng'}
        </span>
      </div>

      {/* 2. Correct Answer (Chỉ hiện khi sai) */}
      {!isCorrect && (
        <div className="ml-6 text-gray-900">
          Đáp án đúng:
          <span className="ml-2 font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-gray-200 text-red-600">
            {correctAnswer}
          </span>
        </div>
      )}

      {/* 3. Explanation (Nếu có) */}
      {explanation && (
        <div className="ml-6 pt-2 border-t border-gray-200/50 flex gap-2 items-start text-gray-600">
          <InfoCircleOutlined className="mt-0.5 text-xs opacity-70" />
          <p className="font-serif italic m-0 leading-relaxed opacity-90">
            {explanation}
          </p>
        </div>
      )}
    </div>
  )
}

export default ExerciseFeedback
