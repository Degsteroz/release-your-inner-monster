import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useDisplaySizes } from '../../hooks/useDisplaySizes'

import video from '../../assets/Monster Energy Zero Ultra Spec Commercial.mp4'

import styles from './styles.module.sass'

const END_TRIM_RATIO = 0.12
const SEEK_THRESHOLD_SEC = 0.028

function TasteSectionDesktop() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const trackRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const videoEl = videoRef.current
    const track = trackRef.current
    if (!videoEl || !track) return

    let rafId = 0
    let pending = false

    const syncVideoToScroll = () => {
      pending = false
      if (!videoEl.duration || !Number.isFinite(videoEl.duration)) return

      const usableDuration = videoEl.duration * (1 - END_TRIM_RATIO)
      if (usableDuration <= 0.05) return

      const vh = window.innerHeight
      const scrollable = track.offsetHeight - vh
      if (scrollable <= 0) return

      const rect = track.getBoundingClientRect()
      const scrolled = Math.min(scrollable, Math.max(0, -rect.top))
      const p = scrolled / scrollable
      const targetTime = Math.min(usableDuration - 0.001, p * usableDuration)

      if (Math.abs(videoEl.currentTime - targetTime) > SEEK_THRESHOLD_SEC) {
        videoEl.currentTime = targetTime
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
    videoEl.addEventListener('loadedmetadata', onMeta)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      videoEl.removeEventListener('loadedmetadata', onMeta)
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
          aria-label={t('taste.title')}
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

function TasteSectionMobile() {
  const { t } = useTranslation()

  return (
    <section
      className={styles.tasteSectionMobile}
      aria-label={t('taste.title')}
    >
      <div className={styles.mobileVideoStickyWrap}>
        <video
          className={styles.mobileVideo}
          src={video}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          aria-label={t('taste.title')}
        />
      </div>

      <div className={styles.mobileCopy}>
        <article className={styles.mobileBlock}>
          <h2 className={styles.mobileHeading}>{t('taste.title')}</h2>
          <p className={styles.mobileBody}>{t('taste.body')}</p>
        </article>
        <article className={styles.mobileBlock}>
          <h2 className={styles.mobileHeading}>{t('position.title')}</h2>
          <p className={styles.mobileBody}>{t('position.body')}</p>
        </article>
        <article className={styles.mobileBlock}>
          <h2 className={styles.mobileHeading}>{t('buyers.title')}</h2>
          <p className={styles.mobileBody}>{t('buyers.body')}</p>
        </article>
      </div>
    </section>
  )
}

export default function TasteSection() {
  const { isMobile } = useDisplaySizes()
  if (isMobile) return <TasteSectionMobile />
  return <TasteSectionDesktop />
}
