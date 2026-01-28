import { useEffect, useState, useCallback } from 'react'
import { vocabService } from '../services/vocabService.js'

export const useFlashcardReview = (queue = []) => {
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const current = queue[index]

  const flip = useCallback(() => {
    setIsFlipped((v) => !v)
  }, [])

  const resetFlip = () => setIsFlipped(false)

  const submit = useCallback(
    async (isCorrect) => {
      if (!current || submitting) return

      setSubmitting(true)
      try {
        await vocabService.submitReview({
          userVocabId: current._id,
          isCorrect
        })

        // Reset state cho thẻ tiếp theo
        setIsFlipped(false)
        setIndex((i) => i + 1)
      } catch (err) {
        console.error('Submit review failed', err)
      } finally {
        setSubmitting(false)
      }
    },
    [current, submitting]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (!current) return

      // Space: Flip
      if (e.code === 'Space') {
        e.preventDefault()
        flip()
      }

      // Chỉ cho vote khi đã lật thẻ (tránh bấm nhầm)
      if (!isFlipped) return

      if (e.key === 'ArrowRight') submit(true)
      if (e.key === 'ArrowLeft') submit(false)
      if (e.key === 'Escape') resetFlip()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, isFlipped, flip, submit])

  return {
    current,
    index,
    total: queue.length,
    isFlipped,
    flip,
    submit,
    submitting,
    done: index >= queue.length
  }
}
