import { useCallback, useEffect, useRef, useState } from 'react'

// Фоновый трек: временно отключён, файл в репозитории нужен — перед публикацией раскомментировать import и <audio>.
import track from '../../assets/linkin-park_figure-09.mp3'
import speaker from '../../assets/speaker.svg'
import speakerOff from '../../assets/speaker-cross.svg'

import { VolumeGauge } from './VolumeGauge.tsx'
import styles from './styles.module.sass'

const DEFAULT_VOLUME = 0.2

export default function AudioSwitcher() {
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = muted ? 0 : volume
  }, [muted, volume])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = DEFAULT_VOLUME
    void audioRef.current.play()
  }, [])

  const handleMuteClick = () => {
    if (!audioRef.current) return
    void audioRef.current.play()
    setMuted((m) => !m)
  }

  const handleVolumeChange = useCallback(
    (v: number) => {
      setVolume(v / 5)
      if (v > 0 && muted) setMuted(false)
    },
    [muted],
  )

  const silent = muted || volume === 0

  return (
    <div className={styles.audioSwitcher}>
      <audio
        ref={audioRef}
        src={track}
        loop
        preload="auto"
      />
      <VolumeGauge
        value={volume * 5}
        onChange={handleVolumeChange}
      />
      <button
        type="button"
        className={styles.muteButton}
        onClick={handleMuteClick}
        aria-pressed={silent}
      >
        <img
          src={silent ? speakerOff : speaker}
          className={styles.svg}
          alt=""
        />
      </button>
    </div>
  )
}
