import LanguageSwitcher from '../../components/LanguageSwitcher.tsx'
import AudioSwitcher from '../../components/AudioSwitcher/AudioSwitcher.tsx'

import styles from './styles.module.sass'

export default function Switchers() {
  return (
    <div className={styles.switchers}>
      <AudioSwitcher />
      <LanguageSwitcher />
    </div>
  )
}
