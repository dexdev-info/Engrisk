import { useEffect, useRef } from 'react'

export const useDebounce = (value, delay, callback) => {
  const callbackRef = useRef(callback)

  // giữ callback mới nhất
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const id = setTimeout(() => {
      callbackRef.current(value)
    }, delay)

    return () => clearTimeout(id)
  }, [value, delay])
}
