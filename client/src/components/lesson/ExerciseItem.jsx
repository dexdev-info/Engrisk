import React from 'react'
import ExerciseMultipleChoice from './ExerciseMultipleChoice.jsx'
import ExerciseFillBlank from './ExerciseFillBlank.jsx'
import ExerciseFeedback from './ExerciseFeedback.jsx'
import { useExercise } from '../../hooks/useExercise.js'

const ExerciseItem = ({ exercise, index }) => {
  const { answer, setAnswer, result, submitting, submit } = useExercise({
    exerciseId: exercise._id
  })

  const isFinished = !!result

  return (
    // STYLE FIX 1: Container tách biệt rõ ràng
    // - shadow-sm: Đổ bóng nhẹ để nổi khối
    // - border border-gray-100: Viền mờ định hình
    // - mb-6: Cách nhau ra, không dính chùm
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      
      {/* 1. Question Header */}
      <div className="flex gap-4 mb-5">
        <span className="flex-shrink-0 w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
          {index + 1}
        </span>
        
        <h3 className="text-lg font-semibold text-gray-800 leading-snug pt-0.5">
          {exercise.question}
        </h3>
      </div>

      {/* 2. Content Area */}
      <div className="pl-12">
        {exercise.type === 'multiple_choice' && (
          <ExerciseMultipleChoice
            options={exercise.options}
            value={answer}
            onChange={setAnswer}
            disabled={isFinished || submitting}
          />
        )}

        {exercise.type === 'fill_blank' && (
          <ExerciseFillBlank 
            value={answer} 
            onChange={setAnswer} 
            disabled={isFinished || submitting}
          />
        )}

        {/* 3. Action Button */}
        <div className="mt-5">
          {!isFinished ? (
            <button
              onClick={submit}
              disabled={!answer || submitting}
              className="
                px-6 py-2.5 rounded-lg 
                bg-gray-500 text-white font-medium text-sm
                shadow-sm
                hover:bg-gray-600 hover:shadow-md hover:-translate-y-0.5
                active:bg-gray-800 active:scale-95
                disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0
                transition-all duration-200 ease-out
              "
            >
              {submitting ? 'Đang chấm...' : 'Trả lời'}
            </button>
          ) : (
            <ExerciseFeedback result={result} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ExerciseItem