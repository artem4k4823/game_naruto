// Naruto 3D Action Game - Procedural Ninja Web Audio Synthesizer with Master & Music Volume Controls
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;

    let savedVol = 0.6;
    let savedBgm = 0.7;
    try {
      if (typeof localStorage !== 'undefined') {
        const v = localStorage.getItem('naruto_volume');
        if (v !== null) savedVol = parseFloat(v);
        const b = localStorage.getItem('naruto_bgm_volume');
        if (b !== null) savedBgm = parseFloat(b);
      }
    } catch (e) {}

    this.volume = isNaN(savedVol) ? 0.6 : Math.max(0, Math.min(1, savedVol));
    this.bgmVolume = isNaN(savedBgm) ? 0.7 : Math.max(0, Math.min(1, savedBgm));
    this.isMuted = false;
    this.rasenganOsc = null;
    this.rasenganGain = null;
    this.bgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);

      // BGM Gain node
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmVolume;
      this.bgmGain.connect(this.masterGain);

      // SFX Gain node
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 1.0;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('naruto_volume', this.volume.toString());
      }
    } catch (e) {}
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
  }

  setBgmVolume(val) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('naruto_bgm_volume', this.bgmVolume.toString());
      }
    } catch (e) {}
    this.init();
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(this.bgmVolume, this.ctx.currentTime, 0.02);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
    if (this.isMuted) {
      this.stopRasengan();
    }
    return !this.isMuted;
  }

  getOutput() {
    this.init();
    return this.sfxGain || this.masterGain || this.ctx.destination;
  }

  getBGMOutput() {
    this.init();
    return this.bgmGain || this.masterGain || this.ctx.destination;
  }

  playHandSeal() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.getOutput());

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playSmokePoof() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.35);
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.getOutput());

    noise.start(now);
    noise.stop(now + 0.4);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(oscGain);
    oscGain.connect(this.getOutput());
    osc.start(now);
    osc.stop(now + 0.25);
  }

  startRasengan() {
    if (this.isMuted || this.rasenganOsc) return;
    this.init();
    const now = this.ctx.currentTime;

    this.rasenganOsc = this.ctx.createOscillator();
    this.rasenganGain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    this.rasenganOsc.type = 'sawtooth';
    this.rasenganOsc.frequency.setValueAtTime(260, now);
    this.rasenganOsc.frequency.exponentialRampToValueAtTime(580, now + 0.8);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(24, now);
    lfoGain.gain.setValueAtTime(40, now);
    lfo.connect(this.rasenganOsc.frequency);

    this.rasenganGain.gain.setValueAtTime(0.2, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;

    this.rasenganOsc.connect(filter);
    filter.connect(this.rasenganGain);
    this.rasenganGain.connect(this.getOutput());

    lfo.start(now);
    this.rasenganOsc.start(now);
    this.rasenganLfo = lfo;
  }

  stopRasengan() {
    if (this.rasenganOsc) {
      try {
        const now = this.ctx.currentTime;
        this.rasenganGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        this.rasenganOsc.stop(now + 0.1);
        if (this.rasenganLfo) this.rasenganLfo.stop(now + 0.1);
      } catch (e) {}
      this.rasenganOsc = null;
      this.rasenganLfo = null;
      this.rasenganGain = null;
    }
  }

  playRasenganDetonate() {
    this.stopRasengan();
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.7);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.getOutput());
    osc.start(now);
    osc.stop(now + 0.8);
  }

  playShurikenThrow() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.getOutput());
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playShurikenHit() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.getOutput());
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playHit(isFinisher = false) {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isFinisher ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(isFinisher ? 180 : 140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + (isFinisher ? 0.3 : 0.18));

    gain.gain.setValueAtTime(isFinisher ? 0.65 : 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinisher ? 0.3 : 0.18));

    osc.connect(gain);
    gain.connect(this.getOutput());
    osc.start(now);
    osc.stop(now + (isFinisher ? 0.3 : 0.18));
  }

  playDash() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.getOutput());
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playKyuubiRoar() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.5);
    osc.frequency.exponentialRampToValueAtTime(50, now + 1.2);

    gain.gain.setValueAtTime(0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.getOutput());
    osc.start(now);
    osc.stop(now + 1.2);
  }

  playPickup() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(this.getOutput());
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.2);
    });
  }

  startBGM() {
    if (this.isMuted || this.bgmPlaying) return;
    this.init();
    this.bgmPlaying = true;

    const scale = [220, 246.94, 261.63, 329.63, 349.23, 440, 493.88, 523.25];
    let step = 0;

    const tick = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      const now = this.ctx.currentTime;

      if (step % 4 === 0 || step % 16 === 10) {
        const drum = this.ctx.createOscillator();
        const drumGain = this.ctx.createGain();
        drum.type = 'triangle';
        drum.frequency.setValueAtTime(110, now);
        drum.frequency.exponentialRampToValueAtTime(35, now + 0.18);
        drumGain.gain.setValueAtTime(0.35, now);
        drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        drum.connect(drumGain);
        drumGain.connect(this.getBGMOutput());
        drum.start(now);
        drum.stop(now + 0.2);
      }

      if (step % 2 === 0 && Math.random() > 0.3) {
        const note = scale[Math.floor(Math.random() * scale.length)];
        const flute = this.ctx.createOscillator();
        const fluteGain = this.ctx.createGain();
        flute.type = 'sine';
        flute.frequency.setValueAtTime(note, now);
        fluteGain.gain.setValueAtTime(0.08, now);
        fluteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        flute.connect(fluteGain);
        fluteGain.connect(this.getBGMOutput());
        flute.start(now);
        flute.stop(now + 0.35);
      }

      step = (step + 1) % 32;
      this.bgmTimer = setTimeout(tick, 140);
    };

    tick();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new SoundEngine();
