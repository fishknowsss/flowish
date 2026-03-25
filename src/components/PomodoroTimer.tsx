import { useCallback, useEffect, useRef, useState } from 'react'

import { PauseIcon, PlayIcon, ResetIcon } from './Icon'

interface PomodoroTimerProps {
  defaultMinutes: number
  soundEnabled: boolean
}

type TimerState = 'idle' | 'running' | 'paused'

const CIRCUMFERENCE = 2 * Math.PI * 11

export function PomodoroTimer({ defaultMinutes, soundEnabled }: PomodoroTimerProps) {
  const initialSeconds = defaultMinutes * 60
  const [seconds, setSeconds] = useState(initialSeconds)
  const [runningTotal, setRunningTotal] = useState(initialSeconds)
  const [state, setState] = useState<TimerState>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const playDoneSound = useCallback(() => {
    if (!soundEnabled) return
    const AudioContextCtor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextCtor) return

    const ctx = new AudioContextCtor()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 880
    gain.gain.value = 0.0001
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
    osc.stop(ctx.currentTime + 0.6)
    osc.addEventListener('ended', () => void ctx.close())
  }, [soundEnabled])

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearTimer()
            setState('idle')
            playDoneSound()
            return runningTotal
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearTimer()
    }

    return clearTimer
  }, [state, clearTimer, playDoneSound, runningTotal])

  const handleToggle = () => {
    if (state === 'idle') {
      const nextTotal = defaultMinutes * 60
      setRunningTotal(nextTotal)
      setSeconds(nextTotal)
      setState('running')
      return
    }

    setState((prev) => (prev === 'running' ? 'paused' : 'running'))
  }

  const handleReset = () => {
    clearTimer()
    setState('idle')
    setSeconds(runningTotal)
  }

  const displaySeconds = state === 'idle' ? defaultMinutes * 60 : seconds
  const totalSeconds = state === 'idle' ? defaultMinutes * 60 : runningTotal
  const minutes = Math.floor(displaySeconds / 60)
  const secs = displaySeconds % 60
  const progress = 1 - displaySeconds / totalSeconds
  const offset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className={`pomodoro-widget ${state === 'running' ? 'active' : ''}`}>
      <div className="pomodoro-ring">
        <svg viewBox="0 0 28 28">
          <circle className="ring-bg" cx="14" cy="14" r="11" />
          <circle
            className="ring-fill"
            cx="14"
            cy="14"
            r="11"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
      </div>
      <span>
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
      <button
        className="icon-button pomodoro-btn"
        type="button"
        onClick={handleToggle}
        aria-label={state === 'running' ? 'Pause Pomodoro timer' : 'Start Pomodoro timer'}
      >
        {state === 'running' ? <PauseIcon width={12} height={12} /> : <PlayIcon width={12} height={12} />}
      </button>
      {state !== 'idle' ? (
        <button
          className="icon-button pomodoro-btn"
          type="button"
          onClick={handleReset}
          aria-label="Reset Pomodoro timer"
        >
          <ResetIcon width={12} height={12} />
        </button>
      ) : null}
    </div>
  )
}
