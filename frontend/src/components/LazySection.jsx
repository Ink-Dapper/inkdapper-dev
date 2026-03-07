import { useEffect, useRef, useState } from 'react'

const LazySection = ({ children, minHeight = 320, rootMargin = '300px 0px' }) => {
  const placeholderRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 }
    )

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible, rootMargin])

  if (isVisible) {
    return children
  }

  return <div ref={placeholderRef} style={{ minHeight }} aria-hidden="true" />
}

export default LazySection
