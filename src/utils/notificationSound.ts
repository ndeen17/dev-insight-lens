/**
 * Notification Sound Utility
 * Generates a pleasant chime using the Web Audio API.
 * No external audio files required — fully synthesized in-browser.
 */

let audioContext: AudioContext | null = null;
let userHasInteracted = false;

// Track user interaction to satisfy browser autoplay policies
const markInteracted = () => {
  userHasInteracted = true;
  // Remove listeners after first interaction
  window.removeEventListener('click', markInteracted);
  window.removeEventListener('keydown', markInteracted);
  window.removeEventListener('touchstart', markInteracted);
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', markInteracted);
  window.addEventListener('keydown', markInteracted);
  window.addEventListener('touchstart', markInteracted);
}

function getAudioContext(): AudioContext | null {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  // Resume suspended context (required by some browsers)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

/**
 * Play a short, pleasant two-tone chime.
 * Sounds like a soft bell — appropriate for notifications.
 */
export function playNotificationSound(): void {
  if (!userHasInteracted) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Two-note chime: E5 → G5 (pleasant major third)
  const frequencies = [659.25, 783.99];
  const durations = [0.12, 0.18];

  frequencies.forEach((freq, i) => {
    const startTime = now + i * 0.12;

    // Oscillator — sine wave for a soft bell tone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Gain envelope — quick attack, smooth decay
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.01); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + durations[i] + 0.25); // Smooth decay

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + durations[i] + 0.3);
  });
}

/**
 * Sound preference management (persisted in localStorage)
 */
const STORAGE_KEY = 'artemis_notification_sound';

export function getSoundEnabled(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === 'true'; // Default: enabled
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // localStorage unavailable — silently fail
  }
}
