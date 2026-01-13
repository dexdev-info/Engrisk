import { useState, useRef, useEffect, useCallback } from 'react'
import {
  stopActiveAudio,
  setActiveAudio,
  clearActiveAudio
} from '../lib/audioManager.js'
/**
 * Custom hook for audio playback
 * Features:
 * - Auto stop other audios
 * - Preload audio
 * - Play/Pause control
 * - Error handling
 * - Loading state
 */
export const useAudioPlayer = (audioUrl, options = {}) => {
  const { autoStop = true, preload = 'metadata' } = options

  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize audio element
  useEffect(() => {
    if (!audioUrl) return

    // Create audio element
    const audio = new Audio(audioUrl)
    audio.preload = preload
    audioRef.current = audio

    const handleLoadStart = () => setIsLoading(true)

    // Event listeners
    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }

    const handleError = () => {
      setIsLoading(false)
      setError('Failed to load audio')
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    // Cleanup
    return () => {
      audio.pause()
      clearActiveAudio(audio)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audioRef.current = null
    }
  }, [audioUrl, preload])

  // Play audio
  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (autoStop) {
      stopActiveAudio()
      setActiveAudio(audio)
    }

    audio.play().catch(() => {
      setError('Playback failed')
      setIsPlaying(false)
    })
  }, [autoStop])

  // Pause audio
  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  // Stop audio
  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.paused ? play() : pause()
  }, [play, pause])

  return {
    play,
    pause,
    stop,
    toggle,
    isPlaying,
    isLoading,
    error,
  }
}
