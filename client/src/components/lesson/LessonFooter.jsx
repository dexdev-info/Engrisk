import { Button } from 'antd'
import { lessonService } from '../../services/lessonService.js'

const LessonFooter = ({
  lessonId,
  navigation,
  courseSlug,
  isCompleted,
  onCompleted
}) => {
  const handleComplete = async () => {
    if (!lessonId) return

    try {
      const res = await lessonService.markComplete({ lessonId })

      onCompleted({
        isCompleted: true,
        courseProgress: res.data.courseProgress,
        nextLesson: res.data.nextLesson
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <footer className="flex justify-between pt-6 border-t">
      {navigation.previous && (
        <Button href={`/learn/${courseSlug}/${navigation.previous.slug}`}>
          ← Bài trước
        </Button>
      )}

      {!isCompleted && (
        <Button type="primary" onClick={handleComplete}>
          Hoàn thành bài học
        </Button>
      )}

      {isCompleted && navigation.next && (
        <Button
          type="primary"
          href={`/learn/${courseSlug}/${navigation.next.slug}`}
        >
          Bài tiếp theo →
        </Button>
      )}
    </footer>
  )
}

export default LessonFooter
