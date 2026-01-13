let activeAudio = null

export const stopActiveAudio = () => {
  if (activeAudio && !activeAudio.paused) {
    activeAudio.pause()
  }
}

export const setActiveAudio = (audio) => {
  if (activeAudio && activeAudio !== audio) {
    activeAudio.pause()
  }
  activeAudio = audio
}

export const clearActiveAudio = (audio) => {
  if (activeAudio === audio) {
    activeAudio = null
  }
}
