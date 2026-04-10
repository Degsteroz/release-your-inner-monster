import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useDisplaySizes } from '../../hooks/useDisplaySizes'

import track from '../../assets/linkin-park_figure-09.mp3'
import speaker from '../../assets/speaker.svg'
import speakerOff from '../../assets/speaker-cross.svg'

import { VolumeGauge } from './VolumeGauge.tsx'

import styles from './styles.module.sass'

const DEFAULT_VOLUME = 0.2

export default function AudioSwitcher() {
  const { t } = useTranslation()
  const { isMobile } = useDisplaySizes()
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  /** На телефонах автозапуск часто запрещён — показываем подсказку, пока не будет жеста */
  const [needsTapForSound, setNeedsTapForSound] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = muted ? 0 : volume
  }, [muted, volume])

  const tryPlay = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    const p = el.play()
    if (p !== undefined) {
      void p
        .then(() => {
          if (isMobile) setNeedsTapForSound(false)
        })
        .catch(() => {
          if (isMobile) setNeedsTapForSound(true)
        })
    }
  }, [isMobile])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = DEFAULT_VOLUME
    if (!isMobile) {
      void el.play()
      return
    }
    void el
      .play()
      .then(() => setNeedsTapForSound(false))
      .catch(() => setNeedsTapForSound(true))
  }, [isMobile])

  const handleMuteClick = () => {
    const el = audioRef.current
    if (!el) return
    if (needsTapForSound && isMobile) {
      void el
        .play()
        .then(() => setNeedsTapForSound(false))
        .catch(() => {})
      return
    }
    tryPlay()
    setMuted((m) => !m)
  }

  const handleVolumeChange = useCallback(
    (v: number) => {
      setVolume(v / 5)
      if (v > 0 && muted) setMuted(false)
    },
    [muted],
  )

  const handleMobileVolumeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      tryPlay()
      const v = Number(e.target.value)
      setVolume(v)
      if (v > 0 && muted) setMuted(false)
    },
    [muted, tryPlay],
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
      {isMobile ? (
        <div className={styles.mobileRow}>
          <input
            type="range"
            className={styles.mobileRange}
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleMobileVolumeInput}
            aria-label={t('audio.volume')}
          />
        </div>
      ) : (
        <VolumeGauge
          value={volume * 5}
          onChange={handleVolumeChange}
        />
      )}
      <div className={styles.muteCluster}>
        {needsTapForSound && isMobile ? (
          <p
            id="audio-tap-hint"
            className={styles.tapHint}
            role="status"
            aria-live="polite"
          >
            {t('audio.tapForSound')}
          </p>
        ) : null}
        <button
          type="button"
          className={`${styles.muteButton} ${needsTapForSound && isMobile ? styles.muteButtonPulse : ''}`}
          onClick={handleMuteClick}
          aria-pressed={silent}
          aria-describedby={needsTapForSound && isMobile ? 'audio-tap-hint' : undefined}
        >
          <img
            src={silent ? speakerOff : speaker}
            className={styles.svg}
            alt=""
          />
        </button>
      </div>
    </div>
  )
}
