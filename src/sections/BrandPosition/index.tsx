import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import image from '../../assets/Rea.webp'
import logo from '../../assets/monsterLogo.webp'
import rea from '../../assets/reaBottom.webp'

import styles from './styles.module.sass'

export default function BrandPosition() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const section = sectionRef.current
    const logoEl = logoRef.current
    if (!section || !logoEl) return

    const apply = (isPast: boolean) => {
      section.classList.toggle(styles.inverted, isPast)
      logoEl.classList.toggle(styles.logoVisible, isPast)
    }

    const update = () => {
      const rect = logoEl.getBoundingClientRect()
      const logoCenterY = rect.top + rect.height / 2
      const viewportMidY = window.innerHeight / 2
      apply(logoCenterY < viewportMidY)
    }

    let raf = 0
    const scheduleUpdate = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    const ro = new ResizeObserver(scheduleUpdate)
    ro.observe(logoEl)

    scheduleUpdate()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.brandPosition}
    >
      <div className={styles.imageWrapper}>
        <img
          src={image}
          className={styles.image}
          alt="Rea"
        />
        <div className={styles.titleBlock}>
          <h4>{t('brandManifesto.eyebrow')}</h4>
          <h2>{t('brandManifesto.title')}</h2>
        </div>
      </div>
      <div className={styles.logoSlot}>
        <img
          ref={logoRef}
          src={logo}
          className={styles.logo}
          alt=""
        />
      </div>
      <div className={styles.textColumn}>
        <p>{t('brandManifesto.description.p1')}</p>
        <p>{t('brandManifesto.description.p2')}</p>
        <p>{t('brandManifesto.description.p3')}</p>

        <h3>{t('brandManifesto.footer')}</h3>
      </div>
      <img
        src={rea}
        className={styles.rea}
        alt=""
      />
    </section>
  )
}
