import ExerciseItem from './ExerciseItem.jsx'

const LessonExercises = ({ exercises = [] }) => {
  if (!exercises.length) return null

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Luyện tập</h3>

      {exercises.map((ex, index) => (
        <ExerciseItem key={ex._id} exercise={ex} index={index} />
      ))}
    </section>
  )
}

export default LessonExercises
