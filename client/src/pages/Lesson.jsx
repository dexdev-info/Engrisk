import { useParams, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useLesson } from '../hooks/useLesson.js'

import LessonHeader from '../components/lesson/LessonHeader.jsx'
import LessonContent from '../components/lesson/LessonContent.jsx'
import LessonVocabulary from '../components/lesson/LessonVocabulary.jsx'
import LessonExercises from '../components/lesson/LessonExercises.jsx'
import LessonNotes from '../components/lesson/LessonNotes.jsx'
import LessonFooter from '../components/lesson/LessonFooter.jsx'

const LessonPage = () => {
  const { lessonSlug } = useParams()
  const { data, loading, setData } = useLesson(lessonSlug)

  if (loading) return <Spin fullscreen />
  // if (!data) return <Navigate to="/404" />

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10">
      <LessonHeader lesson={data.lesson} progress={data.userProgress} />

      <LessonContent lesson={data.lesson} />

      <LessonVocabulary
        key={data.lesson._id}
        vocabularies={data.lesson.vocabularies}
      />

      <LessonExercises exercises={data.exercises} />

      <LessonNotes
        key={data.lesson._id}
        lessonId={data.lesson._id}
        initialNotes={data.userProgress?.notes}
      />

      <LessonFooter
        lessonId={data.lesson._id}
        navigation={data.navigation}
        isCompleted={data.userProgress?.isCompleted}
        onCompleted={() =>
          setData((prev) => ({
            ...prev,
            userProgress: {
              ...prev.userProgress,
              isCompleted: true
            }
          }))
        }
      />
    </div>
  )
}

export default LessonPage
