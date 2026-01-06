import ExerciseMultipleChoice from './ExerciseMultipleChoice.jsx'
import ExerciseFillBlank from './ExerciseFillBlank.jsx'
import ExerciseFeedback from './ExerciseFeedback.jsx'
import { useExercise } from '../../hooks/useExercise.js'

const ExerciseItem = ({ exercise, index }) => {
  const { answer, setAnswer, result, submitting, submit } = useExercise({
    exerciseId: exercise._id
  })

  return (
    <div className="border rounded-xl p-5 space-y-4 bg-white">
      <div className="font-medium">
        Câu {index + 1}: {exercise.question}
      </div>

      {!result && exercise.type === 'multiple_choice' && (
        <ExerciseMultipleChoice
          options={exercise.options}
          value={answer}
          onChange={setAnswer}
        />
      )}

      {!result && exercise.type === 'fill_blank' && (
        <ExerciseFillBlank value={answer} onChange={setAnswer} />
      )}

      {!result && (
        <button
          onClick={submit}
          disabled={answer == null || submitting}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          Kiểm tra
        </button>
      )}

      {result && <ExerciseFeedback result={result} />}
    </div>
  )
}

export default ExerciseItem
