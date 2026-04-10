import { useTranslation } from 'react-i18next'

import styles from './styles.module.sass'

const TELEGRAM_URL = 'https://t.me/Degster_oz'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.meta}>
          <span className={styles.copyright}>{t('footer.meta.copyright', { year })}</span>
          <a
            className={styles.telegram}
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('footer.meta.telegram')}
          </a>
        </div>

        <h2 className={styles.legalTitle}>{t('footer.legal.title')}</h2>
        <div className={styles.legalBody}>
          <p>{t('footer.legal.nonCommercial')}</p>
          <p>{t('footer.legal.aiDisclosure')}</p>
          <p>{t('footer.legal.intellectualProperty')}</p>
          <p>{t('footer.legal.healthWarning')}</p>
          <p>{t('footer.legal.finalNote')}</p>
        </div>
      </div>
    </footer>
  )
}
