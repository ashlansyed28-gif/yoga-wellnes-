/**
 * Web Audio API Ambient Sound Generator & Meditation Chimes
 * Generates organic, high-fidelity soundscapes (Rain, Ocean, Forest, Singing Bowl)
 * natively in the browser without requiring external audio assets.
 */

class SoundscapesEngine {
  constructor() {
    this.ctx = null;
    this.currentTrack = null;
    this.activeNodes = [];
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stop() {
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentTrack = null;
  }

  // Play Tibetan Singing Bowl harmonic chime
  playSingingBowl(fundamentalFreq = 216) {
    this.init();
    const now = this.ctx.currentTime;
    const duration = 6.0;

    const freqs = [fundamentalFreq, fundamentalFreq * 2.76, fundamentalFreq * 5.4];
    const gains = [0.4, 0.15, 0.05];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // Soft Ambient Rain
  playRain() {
    this.stop();
    this.init();
    this.currentTrack = 'rain';
    this.isPlaying = true;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    // Pink noise generation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.05;
      b1 = 0.963 * b1 + white * 0.11;
      b2 = 0.75 * b2 + white * 0.45;
      output[i] = (b0 + b1 + b2) * 0.15;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.35, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, gainNode);
  }

  // Ocean Waves
  playOcean() {
    this.stop();
    this.init();
    this.currentTrack = 'ocean';
    this.isPlaying = true;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 450;

    // LFO oscillator modulating volume like rolling ocean tides (period ~ 6 seconds)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.15; // 0.15 Hz = wave crest every ~6.5s

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.25;

    const masterGain = this.ctx.createGain();
    masterGain.gain.value = 0.3;

    lfo.connect(masterGain.gain);
    noise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, lfo, masterGain);
  }

  // Forest Breeze & Leaves
  playForest() {
    this.stop();
    this.init();
    this.currentTrack = 'forest';
    this.isPlaying = true;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1200;
    bandpass.Q.value = 1.2;

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0.28;

    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noise.start();
    this.activeNodes.push(noise, bandpass, gainNode);
  }
}

export const soundscapes = new SoundscapesEngine();
