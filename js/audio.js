/**
 * NEON PIXEL ACADEMY // 8-BIT / 16-BIT CHIPTUNE, LO-FI SYNTH, RAIN & VINYL AUDIO ENGINE
 * Pure Web Audio API synthesis (zero external MP3 dependencies).
 */

class RetroSoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.ambientPlaying = false;
    this.ambientInterval = null;
    this.ambientStep = 0;

    // Rain & Vinyl Mode states
    this.rainPlaying = false;
    this.rainNodes = null;

    this.vinylPlaying = false;
    this.vinylNodes = null;
    this.vinylPopInterval = null;
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

  playTypeBlip(charIndex = 0) {
    const pitches = [680, 740, 810, 720, 860, 780];
    const freq = pitches[charIndex % pitches.length];
    this.playTone(freq, 'square', 0.032, 0.045, 0);
  }

  playFlip() {
    this.playTone(440, 'triangle', 0.06, 0.08, 0);
    this.playTone(659.25, 'sine', 0.09, 0.08, 0.04);
  }

  playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    notes.forEach((n, idx) => {
      this.playTone(n, 'square', 0.11, 0.08, idx * 0.065);
    });
  }

  playSOS() {
    this.playTone(783.99, 'sawtooth', 0.09, 0.07, 0);
    this.playTone(987.77, 'square', 0.09, 0.07, 0.09);
    this.playTone(1174.66, 'square', 0.16, 0.08, 0.18);
  }

  playError() {
    this.playTone(220, 'sawtooth', 0.14, 0.08, 0);
    this.playTone(164.81, 'sawtooth', 0.2, 0.08, 0.1);
  }

  /* ========================================================================
     1. LO-FI SYNTHWAVE AMBIENT CHORDS
     ======================================================================== */
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

  /* ========================================================================
     2. COZY RAIN MODE AUDIO SYNTHESIS (Soft Filtered Pink/White Rain Patter)
     ======================================================================== */
  toggleRainAudio() {
    this.init();
    if (this.rainPlaying) {
      this.stopRainAudio();
      return false;
    } else {
      this.startRainAudio();
      return true;
    }
  }

  startRainAudio() {
    if (!this.ctx) return;
    this.stopRainAudio();
    this.rainPlaying = true;

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink-ish noise for soothing rain texture
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1150, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + 0.6);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(0);
    this.rainNodes = { source: whiteNoise, gain };
  }

  stopRainAudio() {
    this.rainPlaying = false;
    if (this.rainNodes) {
      try {
        this.rainNodes.source.stop();
        this.rainNodes.source.disconnect();
      } catch (e) {}
      this.rainNodes = null;
    }
  }

  /* ========================================================================
     3. WARM LO-FI VINYL CRACKLE & RECORD POP SYNTHESIS
     ======================================================================== */
  toggleVinylAudio() {
    this.init();
    if (this.vinylPlaying) {
      this.stopVinylAudio();
      return false;
    } else {
      this.startVinylAudio();
      return true;
    }
  }

  startVinylAudio() {
    if (!this.ctx) return;
    this.stopVinylAudio();
    this.vinylPlaying = true;

    // Gentle warm vinyl surface hiss + dust crackle
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Sparse micro-crackles + warm floor
      const r = Math.random();
      data[i] = r > 0.9965 ? (Math.random() * 2 - 1) * 0.45 : (Math.random() * 2 - 1) * 0.018;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2400, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.9, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);

    source.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.ctx.destination);
    source.start(0);
    this.vinylNodes = { source, gain };

    // Occasional warm analog vinyl needle pop
    this.vinylPopInterval = setInterval(() => {
      if (!this.vinylPlaying || !this.ctx) return;
      if (Math.random() < 0.65) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180 + Math.random() * 420, now);
        popGain.gain.setValueAtTime(0.035, now);
        popGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.018);
        osc.connect(popGain);
        popGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.02);
      }
    }, 320);
  }

  stopVinylAudio() {
    this.vinylPlaying = false;
    if (this.vinylNodes) {
      try {
        this.vinylNodes.source.stop();
        this.vinylNodes.source.disconnect();
      } catch (e) {}
      this.vinylNodes = null;
    }
    if (this.vinylPopInterval) {
      clearInterval(this.vinylPopInterval);
      this.vinylPopInterval = null;
    }
  }
}

window.soundEngine = new RetroSoundEngine();
