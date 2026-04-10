import { useEffect, useRef } from 'react'
import video from '../../assets/Monster Energy Zero Ultra Spec Commercial.mp4'

import styles from './styles.module.sass'
import { useTranslation } from 'react-i18next'

/** Не отматывать последние X таймлайна (затемнение в конце) */
const END_TRIM_RATIO = 0.12

/**
 * Чуть плотнее обновляем кадр: при коротком треке (3× экран) на пиксель приходится больше времени ролика.
 */
const SEEK_THRESHOLD_SEC = 0.028

export default function TasteSection() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const trackRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const video = videoRef.current
    const track = trackRef.current
    if (!video || !track) return

    let rafId = 0
    let pending = false

    const syncVideoToScroll = () => {
      pending = false
      if (!video.duration || !Number.isFinite(video.duration)) return

      const usableDuration = video.duration * (1 - END_TRIM_RATIO)
      if (usableDuration <= 0.05) return

      const vh = window.innerHeight
      const scrollable = track.offsetHeight - vh
      if (scrollable <= 0) return

      const rect = track.getBoundingClientRect()
      const scrolled = Math.min(scrollable, Math.max(0, -rect.top))
      const p = scrolled / scrollable
      const targetTime = Math.min(usableDuration - 0.001, p * usableDuration)

      if (Math.abs(video.currentTime - targetTime) > SEEK_THRESHOLD_SEC) {
        video.currentTime = targetTime
      }
    }

    const onScroll = () => {
      if (pending) return
      pending = true
      rafId = window.requestAnimationFrame(syncVideoToScroll)
    }

    const onMeta = () => {
      onScroll()
    }

    const onResize = () => {
      onScroll()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    video.addEventListener('loadedmetadata', onMeta)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      video.removeEventListener('loadedmetadata', onMeta)
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      className={styles.tasteSection}
      ref={trackRef}
    >
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.video}
          src={video}
          muted
          playsInline
          preload="auto"
          aria-label="Видео: вкус продукта"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.block}>
          <h2>{t('taste.title')}</h2>
          <h3>{t('taste.body')}</h3>
        </div>

        <div className={styles.block}>
          <h2>{t('position.title')}</h2>
          <h3>{t('position.body')}</h3>
        </div>

        <div className={styles.block}>
          <h2>{t('buyers.title')}</h2>
          <h3>{t('buyers.body')}</h3>
        </div>
      </div>
    </section>
  )
}
