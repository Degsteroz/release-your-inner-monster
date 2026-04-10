import { useTranslation } from 'react-i18next'

import styles from './LanguageSwitcher.module.sass'

const LANGS = ['ru', 'en'] as const

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation('translation', {
    keyPrefix: 'langSwitcher',
  })

  return (
    <div
      className={styles.switcher}
      role="group"
      aria-label={t('label')}
    >
      {LANGS.map((lng) => {
        const active =
          i18n.resolvedLanguage === lng || i18n.resolvedLanguage?.startsWith(`${lng}-`)

        return (
          <button
            key={lng}
            type="button"
            className={active ? `${styles.btn} ${styles.btnActive}` : styles.btn}
            onClick={() => void i18n.changeLanguage(lng)}
            aria-pressed={active}
          >
            {t(lng)}
          </button>
        )
      })}
    </div>
  )
}
