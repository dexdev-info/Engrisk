import ReactMarkdown from 'react-markdown'
import ReactPlayer from 'react-player'

const LessonContent = ({ lesson }) => {
  if (!lesson) return null

  return (
    <section className="space-y-6">
      {lesson.videoUrl && (
        <div className="aspect-video rounded-xl overflow-hidden">
          <ReactPlayer
            url={lesson.videoUrl}
            controls
            width="100%"
            height="100%"
          />
        </div>
      )}

      {lesson.content && (
        <article className="prose max-w-none">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </article>
      )}
    </section>
  )
}

export default LessonContent
