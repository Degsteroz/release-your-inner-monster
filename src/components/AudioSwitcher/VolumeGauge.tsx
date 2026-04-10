import { useCallback, type KeyboardEvent, type PointerEvent } from 'react'

import styles from './styles.module.sass'

type Props = {
  value: number
  onChange: (volume: number) => void
  disabled?: boolean
}

const CX = 60
const CY = 52
const R = 44
const NEEDLE_LEN = R - 6

function angleFromVolume(v: number) {
  return Math.PI * (1 - Math.max(0, Math.min(1, v)))
}

function needleEnd(v: number) {
  const a = angleFromVolume(v)
  return {
    x: CX + NEEDLE_LEN * Math.cos(a),
    y: CY - NEEDLE_LEN * Math.sin(a),
  }
}

function volumeFromPointer(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return null
  const p = pt.matrixTransform(ctm.inverse())
  const dx = p.x - CX
  const dy = -(p.y - CY)
  const angle = Math.atan2(dy, dx)
  if (angle < 0) {
    return dx < 0 ? 0 : 1
  }
  return (Math.PI - angle) / Math.PI
}

const RED_ZONE_START = 0.8

/** Дуга между уровнями громкости vLo → vHi (0…1, слева направо) */
function describeArcBetweenVolumes(cx: number, cy: number, r: number, vLo: number, vHi: number) {
  const lo = Math.max(0, Math.min(1, vLo))
  const hi = Math.max(0, Math.min(1, vHi))
  if (hi <= lo) return ''
  const start = Math.PI * (1 - lo)
  const end = Math.PI * (1 - hi)
  const x1 = cx + r * Math.cos(start)
  const y1 = cy - r * Math.sin(start)
  const x2 = cx + r * Math.cos(end)
  const y2 = cy - r * Math.sin(end)
  const delta = start - end
  const large = delta >= Math.PI - 1e-9 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export function VolumeGauge({ value, onChange, disabled }: Props) {
  const end = needleEnd(value)
  const v = Math.max(0, Math.min(1, value))

  const bgGrayPath = describeArcBetweenVolumes(CX, CY, R, 0, RED_ZONE_START)
  const bgRedPath = describeArcBetweenVolumes(CX, CY, R, RED_ZONE_START, 1)

  const fillDarkPath =
    v > 0 ? describeArcBetweenVolumes(CX, CY, R, 0, Math.min(v, RED_ZONE_START)) : ''
  const fillRedPath =
    v > RED_ZONE_START ? describeArcBetweenVolumes(CX, CY, R, RED_ZONE_START, v) : ''

  const applyPointer = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      if (disabled) return
      const v = volumeFromPointer(e.currentTarget, e.clientX, e.clientY)
      if (v !== null) onChange(Math.max(0, Math.min(1, v)))
    },
    [disabled, onChange],
  )

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    applyPointer(e)
  }

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return
    applyPointer(e)
  }

  const onPointerUp = (e: PointerEvent<SVGSVGElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const pct = Math.round(value * 100)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const step = e.shiftKey ? 0.1 : 0.05
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(Math.max(0, value - step))
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(Math.min(1, value + step))
    }
    if (e.key === 'Home') {
      e.preventDefault()
      onChange(0)
    }
    if (e.key === 'End') {
      e.preventDefault()
      onChange(1)
    }
  }

  return (
    <div
      className={styles.gaugeWrap}
      tabIndex={disabled ? -1 : 0}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Громкость"
      aria-disabled={Boolean(disabled)}
      onKeyDown={onKeyDown}
    >
      <svg
        className={styles.gaugeSvg}
        viewBox="0 0 120 64"
        role="presentation"
        aria-hidden
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <path
          className={styles.gaugeArcBg}
          d={bgGrayPath}
          fill="none"
        />
        <path
          className={styles.gaugeArcBgRed}
          d={bgRedPath}
          fill="none"
        />
        {fillDarkPath ? (
          <path
            className={styles.gaugeArcFill}
            d={fillDarkPath}
            fill="none"
          />
        ) : null}
        {fillRedPath ? (
          <path
            className={styles.gaugeArcFillRed}
            d={fillRedPath}
            fill="none"
          />
        ) : null}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const a = angleFromVolume(t)
          const x1 = CX + (R - 2) * Math.cos(a)
          const y1 = CY - (R - 2) * Math.sin(a)
          const x2 = CX + (R - 8) * Math.cos(a)
          const y2 = CY - (R - 8) * Math.sin(a)
          return (
            <line
              key={t}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className={styles.gaugeTick}
            />
          )
        })}
        <line
          x1={CX}
          y1={CY}
          x2={end.x}
          y2={end.y}
          className={styles.gaugeNeedle}
        />
        <circle
          cx={CX}
          cy={CY}
          r={4}
          className={styles.gaugeHub}
        />
      </svg>
    </div>
  )
}
