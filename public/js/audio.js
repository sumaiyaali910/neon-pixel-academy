/**
 * NEON PIXEL ACADEMY // 8-BIT / 16-BIT CHIPTUNE & AMBIENT LO-FI AUDIO ENGINE
 * Pure Web Audio API synthesis (zero external MP3 dependencies).
 */

class RetroSoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.ambientPlaying = false;
    this.ambientInterval = null;
    this.ambientStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'square', duration = 0.09, volume = 0.08, delay = 0) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playClick() {
    this.playTone(587.33, 'square', 0.055, 0.07, 0);    // D5
    this.playTone(880.00, 'triangle', 0.075, 0.06, 0.03); // A5
  }

  playFlip() {
    this.playTone(440, 'triangle', 0.06, 0.08, 0);
    this.playTone(659.25, 'sine', 0.09, 0.08, 0.04);
  }

  playSuccess() {
    // Classic 8-bit coin/powerup arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    notes.forEach((n, idx) => {
      this.playTone(n, 'square', 0.11, 0.08, idx * 0.065);
    });
  }

  playSOS() {
    // Urgent friendly beacon chime
    this.playTone(783.99, 'sawtooth', 0.09, 0.07, 0);
    this.playTone(987.77, 'square', 0.09, 0.07, 0.09);
    this.playTone(1174.66, 'square', 0.16, 0.08, 0.18);
  }

  playError() {
    this.playTone(220, 'sawtooth', 0.14, 0.08, 0);
    this.playTone(164.81, 'sawtooth', 0.2, 0.08, 0.1);
  }

  toggleAmbient() {
    this.init();
    if (this.ambientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  startAmbient() {
    if (!this.ctx) return;
    this.ambientPlaying = true;
    // Relaxing Dreamy Cyan Arpeggio (Cmaj9 / Am9 chill synthwave progression)
    const chillChordNotes = [
      261.63, 329.63, 392.00, 493.88, // C4 E4 G4 B4
      220.00, 261.63, 329.63, 392.00, // A3 C4 E4 G4
      174.61, 220.00, 261.63, 329.63, // F3 A3 C4 E4
      196.00, 246.94, 293.66, 392.00  // G3 B3 D4 G4
    ];

    this.ambientInterval = setInterval(() => {
      if (!this.ambientPlaying || !this.ctx) return;
      const note = chillChordNotes[this.ambientStep % chillChordNotes.length];
      this.ambientStep++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.032, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    }, 450);
  }

  stopAmbient() {
    this.ambientPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

window.soundEngine = new RetroSoundEngine();
