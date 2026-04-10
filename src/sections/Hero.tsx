import hero from '../assets/hero-monster.webp'
import styles from './styles.module.sass'
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()
  return (
    <section
      id="hero"
      className={styles.hero}
    >
      <div className={styles.textBlock}>
        <h1 id="hero-title">{t('hero.title')}</h1>
        <p>{t('hero.lead')}</p>
      </div>
      <img
        src={hero}
        className={styles.image}
        alt="Hero White Monster"
      />
    </section>
  )
}
