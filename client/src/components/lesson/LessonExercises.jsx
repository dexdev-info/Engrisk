// import ExerciseItem from './ExerciseItem.jsx'

// const LessonExercises = ({ exercises = [] }) => {
//   if (!exercises.length) return null

//   return (
//     <section className="space-y-6">
//       <h3 className="text-lg font-semibold">Luyện tập</h3>

//       {exercises.map((ex, index) => (
//         <ExerciseItem key={ex._id} exercise={ex} index={index} />
//       ))}
//     </section>
//   )
// }

// export default LessonExercises

import { FormOutlined } from '@ant-design/icons'
import ExerciseItem from './ExerciseItem.jsx'

const LessonExercises = ({ exercises = [] }) => {
  if (!exercises.length) return null

  return (
    // Container:
    // - pt-8 border-t: Đường kẻ phân cách tinh tế
    <section className="mt-12 pt-8 border-t border-gray-300 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-8">
        {/* Icon Box: Vuông bo góc nhẹ, nền xám nhạt */}
        <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-xl text-gray-800">
          <FormOutlined />
        </div>

        <div className="flex flex-col">
          {/* Title: Font Serif tạo cảm giác trang trọng */}
          <h3 className="text-2xl font-serif font-bold text-gray-900 leading-none mb-1">
            Luyện tập
          </h3>
          {/* Subtitle: Thông báo số lượng câu hỏi */}
          <p className="text-sm text-gray-500 font-sans">
            Hoàn thành {exercises.length} câu hỏi để nắm vững kiến thức bài học.
          </p>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-8">
        {exercises.map((ex, index) => (
          <ExerciseItem key={ex._id} exercise={ex} index={index} />
        ))}
      </div>

      {/* Footer Note (Optional): Một chút động viên cuối bài */}
      <div className="text-center mt-10 mb-6">
        <p className="text-gray-400 text-sm italic font-serif">
          "Practice makes perfect."
        </p>
      </div>
    </section>
  )
}

export default LessonExercises
