/**
 * Sound effects, synthesised with the Web Audio API rather than loaded from
 * files: nothing to download, nothing to license, and each tick can vary a
 * little so the shuffle doesn't sound like a loop.
 */

const MASTER_VOLUME = 0.35

let context: AudioContext | null = null
let master: GainNode | null = null
let muted = false

export function setMuted(value: boolean) {
  muted = value
}

/**
 * Browsers only allow sound once the visitor has interacted with the page,
 * so the audio context is created lazily. Every sound here follows a
 * click, which satisfies that.
 */
function output() {
  if (!context || !master) {
    context = new AudioContext()
    master = context.createGain()
    master.gain.value = MASTER_VOLUME
    master.connect(context.destination)
  }
  if (context.state === 'suspended') void context.resume()

  return { context, master }
}

/**
 * One struck note. A near-instant attack and an exponential fade is what
 * makes it read as a tap or a bell rather than a beep.
 */
function note(
  frequency: number,
  startsIn: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
) {
  const { context, master } = output()
  const start = context.currentTime + startsIn

  const oscillator = context.createOscillator()
  const envelope = context.createGain()

  oscillator.type = type
  oscillator.frequency.value = frequency

  envelope.gain.setValueAtTime(0.0001, start)
  envelope.gain.exponentialRampToValueAtTime(volume, start + 0.005)
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  oscillator.connect(envelope).connect(master)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.05)
}

/** One click of the shuffle, pitched a little differently each time. */
export function playTick() {
  if (muted) return
  note(1100 + Math.random() * 500, 0, 0.05, 0.25, 'triangle')
}

/** A rising E major arpeggio for when the card lands. */
export function playReveal() {
  if (muted) return
  const notes = [659.25, 830.61, 987.77, 1318.51]
  notes.forEach((frequency, i) => note(frequency, i * 0.07, 0.7 - i * 0.05, 0.22))
}

/** Two falling notes when a request fails. */
export function playError() {
  if (muted) return
  note(392, 0, 0.25, 0.2, 'triangle')
  note(311.13, 0.14, 0.35, 0.2, 'triangle')
}
