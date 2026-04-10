import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import track from '../../assets/linkin-park_figure-09.mp3'
import { useDisplaySizes } from '../../hooks/useDisplaySizes'
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
  const [needsUserGestureForSound, setNeedsUserGestureForSound] = useState(false)
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
        .then(() => setNeedsUserGestureForSound(false))
        .catch(() => setNeedsUserGestureForSound(true))
    }
  }, [])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = DEFAULT_VOLUME
    void el
      .play()
      .then(() => setNeedsUserGestureForSound(false))
      .catch(() => setNeedsUserGestureForSound(true))
  }, [isMobile])

  const handleMuteClick = () => {
    const el = audioRef.current
    if (!el) return
    if (needsUserGestureForSound) {
      void el
        .play()
        .then(() => setNeedsUserGestureForSound(false))
        .catch(() => {})
      return
    }
    tryPlay()
    setMuted((m) => !m)
  }

  const handleVolumeChange = useCallback(
    (v: number) => {
      tryPlay()
      setVolume(v / 5)
      if (v > 0 && muted) setMuted(false)
    },
    [muted, tryPlay],
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
    <div className={`${styles.audioSwitcher} ${needsUserGestureForSound ? styles.withHint : ''}`}>
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
        {needsUserGestureForSound ? (
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
          className={`${styles.muteButton} ${needsUserGestureForSound ? styles.muteButtonPulse : ''}`}
          onClick={handleMuteClick}
          aria-pressed={silent}
          aria-describedby={needsUserGestureForSound ? 'audio-tap-hint' : undefined}
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
