import { useState, useCallback } from 'react'
import { exerciseService } from '../services/exerciseService.js'

export const useExercise = ({ exerciseId }) => {
  const [answer, setAnswer] = useState(null)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = useCallback(async () => {
    if (submitting || answer == null) return

    setSubmitting(true)
    try {
      const res = await exerciseService.submit({
        exerciseId,
        userAnswer: answer
      })
      setResult(res.data)
    } finally {
      setSubmitting(false)
    }
  }, [answer, submitting, exerciseId])

  return {
    answer,
    setAnswer,
    result,
    submitting,
    submit
  }
}
