import { useEffect, useState } from 'react'
import { Mic, Square, Play, Pause, Send, Trash2, Sparkles } from 'lucide-react'
import Waveform from '../../components/Waveform'
import Button from '../../components/Button'
import styles from './IntentNote.module.css'

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const ss = String(s % 60).padStart(2, '0')
  return `${m}:${ss}`
}

/**
 * Sprint 2 = live, interactive flow.
 * state: 'empty' | 'ready' | 'recording' | 'playback' | 'sent'
 * seconds  = live recording counter
 * duration = captured length, shown in playback / sent
 */
export default function IntentNote({
  state,
  seconds,
  duration,
  summary,
  onChange,
  onSend,
}) {
  switch (state) {
    case 'empty':
      return <Empty onStart={() => onChange('ready')} />
    case 'ready':
      return <Ready onRecord={() => onChange('recording')} />
    case 'recording':
      return <Recording seconds={seconds} onStop={() => onChange('playback')} />
    case 'playback':
      return (
        <Playback
          duration={duration}
          onDiscard={() => onChange('empty')}
          onSend={onSend}
        />
      )
    case 'sent':
      return <Sent duration={duration} summary={summary} />
    default:
      return null
  }
}

function Empty({ onStart }) {
  return (
    <button className={styles.empty} onClick={onStart}>
      <span className={styles.emptyMic}>
        <Mic size={18} strokeWidth={2} />
      </span>
      <span className={styles.emptyLabel}>Add intent note</span>
    </button>
  )
}

function Ready({ onRecord }) {
  return (
    <section className={styles.card}>
      <span className={styles.cardLabel}>Intent Note</span>
      <button className={styles.micBtn} onClick={onRecord} aria-label="Start recording">
        <Mic size={22} strokeWidth={2} />
      </button>
      <span className={styles.hint}>Tap to start recording</span>
    </section>
  )
}

function Recording({ seconds, onStop }) {
  return (
    <section className={`${styles.card} ${styles.recording}`}>
      <div className={styles.recHeader}>
        <span className={styles.recLabel}>
          <span className={styles.recDot} /> Recording
        </span>
        <span className={styles.recTime}>{formatTime(seconds)}</span>
      </div>
      <div className={styles.recWave}>
        <Waveform tone="red" animated />
      </div>
      <Button variant="danger" icon={Square} className={styles.fullBtn} onClick={onStop}>
        Stop
      </Button>
    </section>
  )
}

// Simulated audio: play toggles the animated waveform for `duration` seconds.
function AudioPreview({ duration }) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const ms = Math.max(duration, 1) * 1000
    const t = setTimeout(() => setPlaying(false), ms)
    return () => clearTimeout(t)
  }, [playing, duration])

  return (
    <div className={styles.player}>
      <button
        className={styles.playBtn}
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <Pause size={15} strokeWidth={2.5} fill="currentColor" />
        ) : (
          <Play size={16} strokeWidth={2.5} fill="currentColor" />
        )}
      </button>
      <Waveform tone="indigo" animated={playing} />
      <span className={styles.dur}>{formatTime(duration)}</span>
    </div>
  )
}

function Playback({ duration, onDiscard, onSend }) {
  return (
    <section className={styles.card}>
      <span className={styles.cardLabel}>Intent Note</span>
      <AudioPreview duration={duration} />
      <div className={styles.actions}>
        <Button variant="ghost" icon={Trash2} onClick={onDiscard}>
          Discard
        </Button>
        <Button variant="primary" icon={Send} className={styles.grow} onClick={onSend}>
          Send note
        </Button>
      </div>
    </section>
  )
}

function Sent({ duration, summary }) {
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowSummary(true), 480)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className={styles.card}>
      <span className={styles.cardLabel}>Intent Note</span>
      <AudioPreview duration={duration} />
      {showSummary && (
        <div className={styles.summary}>
          <span className={styles.summaryLabel}>
            <Sparkles size={14} strokeWidth={2.5} /> AI Summary
          </span>
          <p className={styles.summaryText}>{summary}</p>
        </div>
      )}
    </section>
  )
}
