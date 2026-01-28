import { useParams, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useLesson } from '@/features/course/hooks/useLesson.js'

import LessonHeader from '@/features/course/components/lesson/LessonHeader.jsx'
import LessonContent from '@/features/course/components/lesson/LessonContent.jsx'
import LessonVocab from '@/features/course/components/lesson/LessonVocab.jsx'
import LessonExercises from '@/features/course/components/lesson/LessonExercises.jsx'
import LessonNotes from '@/features/course/components/lesson/LessonNotes.jsx'
import LessonFooter from '@/features/course/components/lesson/LessonFooter.jsx'

const LessonPage = () => {
  const { courseSlug, lessonSlug } = useParams()
  const { data, loading, setData } = useLesson(lessonSlug)

  if (loading) return <Spin fullscreen />
  // if (!data) return <Navigate to="/404" />

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10">
      <LessonHeader
        lesson={data.lesson}
        progress={data.userProgress}
        navigation={data.navigation}
      />

      <LessonContent lesson={data.lesson} />

      <LessonVocab
        vocabularies={data.lesson.vocabularies}
      />

      <LessonExercises exercises={data.exercises} />

      <LessonNotes
        lessonId={data.lesson._id}
        initialNotes={data.userProgress?.notes}
      />

      <LessonFooter
        lessonId={data.lesson._id}
        navigation={data.navigation}
        courseSlug={courseSlug}
        isCompleted={data.userProgress?.isCompleted}
        onCompleted={({ courseProgress }) =>
          setData((prev) => ({
            ...prev,
            userProgress: {
              ...prev.userProgress,
              isCompleted: true
            },
            navigation: {
              ...prev.navigation
              // optional: giữ nguyên position
            },
            courseProgress
          }))
        }
      />
    </div>
  )
}

export default LessonPage
