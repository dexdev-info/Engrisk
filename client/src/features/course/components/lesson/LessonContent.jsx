import ReactMarkdown from 'react-markdown'

// Helper function: convert YouTube URL sang embed format
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null
  
  // Extract video ID from different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = (match && match[2].length === 11) ? match[2] : null
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

const LessonContent = ({ lesson }) => {
  if (!lesson) return null

  const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl)

  return (
    <section className="space-y-6">
      {embedUrl && (
        <div className="aspect-video rounded-xl overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
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