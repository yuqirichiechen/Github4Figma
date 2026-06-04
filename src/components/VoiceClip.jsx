import { useEffect, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import Waveform from './Waveform'
import styles from './VoiceClip.module.css'

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Simulated voice playback: pressing play animates the waveform for the
 * clip's duration, then stops. (Wizard-of-Oz — no real audio.)
 */
export default function VoiceClip({ durationSec = 0, tone = 'indigo' }) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => setPlaying(false), Math.max(durationSec, 1) * 1000)
    return () => clearTimeout(t)
  }, [playing, durationSec])

  return (
    <div className={styles.clip}>
      <button
        className={styles.play}
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? 'Pause voice note' : 'Play voice note'}
      >
        {playing ? (
          <Pause size={13} strokeWidth={2.5} fill="currentColor" />
        ) : (
          <Play size={13} strokeWidth={2.5} fill="currentColor" />
        )}
      </button>
      <Waveform tone={tone} animated={playing} />
      <span className={styles.dur}>{formatTime(durationSec)}</span>
    </div>
  )
}
