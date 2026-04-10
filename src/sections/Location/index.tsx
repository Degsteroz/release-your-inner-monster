import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import fridge from '../../assets/fridge.webp'
import styles from './styles.module.sass'

/** Триггер, когда верхний край секции дошёл до горизонтали 50% вьюпорта (коснулся или пересёк). */
function sectionTopTouchedViewportMid(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  const midY = window.innerHeight / 2
  return r.top <= midY
}

const STAGGER_MS = 610

export default function Location() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const triggeredRef = useRef(false)
  const [textPlaying, setTextPlaying] = useState(false)

  const checkTrigger = useCallback(() => {
    const section = sectionRef.current
    if (!section || triggeredRef.current) return
    if (sectionTopTouchedViewportMid(section)) {
      triggeredRef.current = true
      setTextPlaying(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = sectionRef.current
    if (!root) return

    let raf = 0
    const schedule = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        checkTrigger()
      })
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    const ro = new ResizeObserver(schedule)
    ro.observe(root)

    schedule()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [checkTrigger])

  const textBlocks = [
    <h2>{t('availability.title')}</h2>,
    <h3>{t('availability.subtitle')}</h3>,
    <p>{t('availability.body')}</p>,
    <h3>{t('availability.tagline')}</h3>,
  ]

  return (
    <section
      ref={sectionRef}
      className={styles.location}
    >
      <div className={styles.imageWrapper}>
        <img
          src={fridge}
          className={styles.image}
          alt=""
        />
      </div>
      <div className={`${styles.textBlock} ${textPlaying ? styles.textPlaying : ''}`}>
        {textBlocks.map((block, index) => (
          <div
            className={styles.textReveal}
            style={textPlaying ? { animationDelay: `${index * STAGGER_MS}ms` } : undefined}
            key={index}
          >
            {block}
          </div>
        ))}
      </div>
    </section>
  )
}
