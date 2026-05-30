import { Mic, Square, Play, Send, Trash2, Sparkles } from 'lucide-react'
import Waveform from '../../components/Waveform'
import Button from '../../components/Button'
import styles from './IntentNote.module.css'

/**
 * Sprint 1 = static views you can click through.
 * state: 'empty' | 'ready' | 'recording' | 'playback' | 'sent'
 * Live timers, animation, and store wiring arrive in Sprint 2.
 */
export default function IntentNote({ state, summary, onChange }) {
  switch (state) {
    case 'empty':
      return <Empty onStart={() => onChange('ready')} />
    case 'ready':
      return <Ready onRecord={() => onChange('recording')} />
    case 'recording':
      return <Recording onStop={() => onChange('playback')} />
    case 'playback':
      return (
        <Playback
          onDiscard={() => onChange('empty')}
          onSend={() => onChange('sent')}
        />
      )
    case 'sent':
      return <Sent summary={summary} />
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

function Recording({ onStop }) {
  return (
    <section className={`${styles.card} ${styles.recording}`}>
      <div className={styles.recHeader}>
        <span className={styles.recLabel}>
          <span className={styles.recDot} /> Recording
        </span>
        <span className={styles.recTime}>0:13</span>
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

function Playback({ onDiscard, onSend }) {
  return (
    <section className={styles.card}>
      <span className={styles.cardLabel}>Intent Note</span>
      <div className={styles.player}>
        <button className={styles.playBtn} aria-label="Play preview">
          <Play size={16} strokeWidth={2.5} fill="currentColor" />
        </button>
        <Waveform tone="indigo" />
        <span className={styles.dur}>0:07</span>
      </div>
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

function Sent({ summary }) {
  return (
    <section className={styles.card}>
      <span className={styles.cardLabel}>Intent Note</span>
      <div className={`${styles.player} ${styles.playerSent}`}>
        <button className={styles.playBtn} aria-label="Play note">
          <Play size={16} strokeWidth={2.5} fill="currentColor" />
        </button>
        <Waveform tone="indigo" />
        <span className={styles.dur}>0:07</span>
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryLabel}>
          <Sparkles size={14} strokeWidth={2.5} /> AI Summary
        </span>
        <p className={styles.summaryText}>{summary}</p>
      </div>
    </section>
  )
}
