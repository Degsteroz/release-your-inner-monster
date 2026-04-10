import { useEffect, useState } from 'react'

/** Совпадает с `$bp-md` в `src/styles/_variables.scss` */
export const MOBILE_BREAKPOINT_PX = 768

function queryMobile() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches
}

/**
 * Брейкпоинты вьюпорта. На мобилках тяжёлые эффекты (скролл→видео и т.п.) заменяются упрощёнными вариантами.
 */
export function useDisplaySizes() {
  const [isMobile, setIsMobile] = useState(queryMobile)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return { isMobile }
}
