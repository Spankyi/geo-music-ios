// محرك الصوت الاحترافي لنظام iOS (10-Band EQ + Hybrid Karaoke + 8D Orbit + Studio Reverb + Mastering Compressor + Live Spectrum Visualizer)
(function (global) {
  'use strict';

  const EQ_FREQS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const PRESETS = {
    flat:       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mahraganat: [9, 8, 4, 1, -1, 2, 5, 7, 8, 7],
    tarab:      [3, 2, 1, 3, 5, 5, 4, 3, 2, 2],
    bass:       [9, 8, 6, 2, 0, 0, 1, 2, 3, 3],
    pop:        [-1, 2, 5, 6, 4, 0, -1, 2, 4, 5],
    rock:       [6, 4, 2, -2, -1, 2, 5, 6, 7, 7],
    electronic: [7, 6, 2, 0, -2, 2, 1, 4, 7, 8],
    cinema:     [8, 7, 4, 1, -1, 1, 3, 5, 7, 8]
  };

  const THEME_PALETTES = {
    neon:      { p1: [124, 92, 255], p2: [0, 212, 255], p3: [255, 62, 138] },
    aurora:    { p1: [0, 245, 160],  p2: [0, 217, 245], p3: [140, 82, 255] },
    galaxy:    { p1: [184, 69, 255], p2: [255, 71, 163], p3: [0, 210, 255] },
    cyberpunk: { p1: [255, 0, 127],  p2: [0, 240, 255], p3: [252, 238, 10] },
    lava:      { p1: [255, 69, 0],   p2: [255, 174, 0], p3: [255, 0, 85] },
    spotify:   { p1: [29, 185, 84],  p2: [30, 215, 96],  p3: [0, 212, 255] },
    crimson:   { p1: [250, 36, 60],  p2: [255, 107, 129], p3: [255, 170, 0] },
    gold:      { p1: [245, 158, 11], p2: [251, 191, 36], p3: [255, 100, 50] },
    ocean:     { p1: [14, 165, 233], p2: [56, 189, 248], p3: [16, 185, 129] },
    light:     { p1: [99, 102, 241], p2: [14, 165, 233], p3: [236, 72, 153] }
  };

  class StudioAudioEngine {
    constructor(audioEl, nativeAudioEl, bgCanvasEl) {
      this.audio = audioEl;
      this.nativeAudio = nativeAudioEl;
      this.activeSourceType = 'dsp'; // 'dsp' | 'native'
      this.bgCanvas = bgCanvasEl;
      this.ctx = null;
      this.analyser = null;
      this.eqNodes = [];
      this.bassNode = null;
      this.karaokeEnabled = false;
      this.orbit8DEnabled = false;
      this.compressorEnabled = false;
      this.orbitAngle = 0;
      this.vizMode = 'bars';
      this.themeName = 'neon';
      this.glowRGB = [124, 92, 255];
      this.secRGB = [0, 212, 255];
      this.thirdRGB = [255, 62, 138];
      this.beatEnergy = 0;
      this._animating = false;
      this._particles = [];
      this._initParticles();
      this.startVisualizer();
    }

    _initParticles() {
      this._particles = [];
      for (let i = 0; i < 36; i++) {
        this._particles.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0007,
          vy: (Math.random() - 0.5) * 0.0007,
          r: 1.5 + Math.random() * 3.0,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    setThemePalette(themeName) {
      this.themeName = themeName || 'neon';
      const pal = THEME_PALETTES[this.themeName] || THEME_PALETTES.neon;
      this.glowRGB = [...pal.p1];
      this.secRGB = [...pal.p2];
      this.thirdRGB = [...pal.p3];
    }

    setActiveSourceType(type) {
      this.activeSourceType = type === 'native' ? 'native' : 'dsp';
    }

    _createImpulseResponse(durationSec, decay) {
      const rate = this.ctx.sampleRate;
      const length = Math.floor(rate * durationSec);
      const impulse = this.ctx.createBuffer(2, length, rate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);
      for (let i = 0; i < length; i++) {
        const env = Math.pow(1 - i / length, decay);
        left[i] = (Math.random() * 2 - 1) * env;
        right[i] = (Math.random() * 2 - 1) * env;
      }
      return impulse;
    }

    init() {
      try {
        if (this.ctx) {
          if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
          return;
        }
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

        const src = this.ctx.createMediaElementSource(this.audio);

        this.eqNodes = EQ_FREQS.map((freq, idx) => {
          const f = this.ctx.createBiquadFilter();
          f.type = idx === 0 ? 'lowshelf' : idx === EQ_FREQS.length - 1 ? 'highshelf' : 'peaking';
          f.frequency.value = freq;
          f.Q.value = 1.2;
          f.gain.value = 0;
          return f;
        });

        this.bassNode = this.ctx.createBiquadFilter();
        this.bassNode.type = 'lowshelf';
        this.bassNode.frequency.value = 75;
        this.bassNode.gain.value = 0;

        this.splitter = this.ctx.createChannelSplitter(2);
        this.merger = this.ctx.createChannelMerger(2);
        this.spatialDelay = this.ctx.createDelay(0.05);
        this.spatialDelay.delayTime.value = 0;

        this.panner8D = this.ctx.createStereoPanner();
        this.panner8D.pan.value = 0;

        this.reverbConvolver = this.ctx.createConvolver();
        this.reverbConvolver.buffer = this._createImpulseResponse(1.6, 2.5);
        this.reverbWetGain = this.ctx.createGain();
        this.reverbWetGain.gain.value = 0;
        this._reverbConnected = false;

        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.value = -22;
        this.compressor.knee.value = 18;
        this.compressor.ratio.value = 4;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.22;

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 1.0;

        this.normalGain = this.ctx.createGain();
        this.normalGain.gain.value = 1;

        this.karaokeGain = this.ctx.createGain();
        this.karaokeGain.gain.value = 0;

        this.kSplit = this.ctx.createChannelSplitter(2);
        this.kInvR = this.ctx.createGain();
        this.kInvR.gain.value = -1;
        this.kSideSum = this.ctx.createGain();
        this.kSideSum.gain.value = 0.65;

        this.kLowKeep = this.ctx.createBiquadFilter();
        this.kLowKeep.type = 'lowshelf';
        this.kLowKeep.frequency.value = 180;
        this.kLowKeep.gain.value = 5.5;

        this.kVocalCut1 = this.ctx.createBiquadFilter();
        this.kVocalCut1.type = 'peaking';
        this.kVocalCut1.frequency.value = 550;
        this.kVocalCut1.Q.value = 0.9;
        this.kVocalCut1.gain.value = -13;

        this.kVocalCut2 = this.ctx.createBiquadFilter();
        this.kVocalCut2.type = 'peaking';
        this.kVocalCut2.frequency.value = 1450;
        this.kVocalCut2.Q.value = 0.85;
        this.kVocalCut2.gain.value = -15;

        this.kVocalCut3 = this.ctx.createBiquadFilter();
        this.kVocalCut3.type = 'peaking';
        this.kVocalCut3.frequency.value = 2800;
        this.kVocalCut3.Q.value = 1.0;
        this.kVocalCut3.gain.value = -12;

        this.kHighKeep = this.ctx.createBiquadFilter();
        this.kHighKeep.type = 'highshelf';
        this.kHighKeep.frequency.value = 5200;
        this.kHighKeep.gain.value = 4.0;

        this.preFxBus = this.ctx.createGain();
        this.preFxBus.gain.value = 1.0;

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.80;

        let head = src;
        for (const node of this.eqNodes) {
          head.connect(node);
          head = node;
        }
        head.connect(this.bassNode);

        this.bassNode.connect(this.splitter);
        this.splitter.connect(this.merger, 0, 0);
        this.splitter.connect(this.spatialDelay, 1);
        this.spatialDelay.connect(this.merger, 0, 1);
        this.merger.connect(this.normalGain);
        this.normalGain.connect(this.preFxBus);

        this.bassNode.connect(this.kSplit);
        this.kSplit.connect(this.kSideSum, 0);
        this.kSplit.connect(this.kInvR, 1);
        this.kInvR.connect(this.kSideSum);
        this.kSideSum.connect(this.karaokeGain);

        this.bassNode.connect(this.kLowKeep);
        this.kLowKeep.connect(this.kVocalCut1);
        this.kVocalCut1.connect(this.kVocalCut2);
        this.kVocalCut2.connect(this.kVocalCut3);
        this.kVocalCut3.connect(this.kHighKeep);
        this.kHighKeep.connect(this.karaokeGain);

        this.karaokeGain.connect(this.preFxBus);

        this.preFxBus.connect(this.panner8D);
        this.panner8D.connect(this.compressor);

        this.compressor.connect(this.masterGain);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      } catch (e) {
        console.warn('AudioEngine init error:', e);
      }
    }

    setBand(index, db) {
      if (this.eqNodes[index]) this.eqNodes[index].gain.value = Number(db);
    }

    applyPreset(name) {
      const vals = PRESETS[name] || PRESETS.flat;
      vals.forEach((v, i) => this.setBand(i, v));
      return vals;
    }

    setBassBoost(db) {
      if (this.bassNode) this.bassNode.gain.value = Number(db);
    }

    setSpatial3D(amount) {
      if (this.spatialDelay) this.spatialDelay.delayTime.value = (Number(amount) / 100) * 0.018;
    }

    setReverb(amount) {
      this.init();
      const val = Number(amount);
      if (this.reverbWetGain) {
        if (val > 0 && !this._reverbConnected && this.preFxBus && this.reverbConvolver) {
          this.preFxBus.connect(this.reverbConvolver);
          this.reverbConvolver.connect(this.reverbWetGain);
          this.reverbWetGain.connect(this.compressor);
          this._reverbConnected = true;
        }
        this.reverbWetGain.gain.value = (val / 100) * 0.65;
      }
    }

    set8DAudio(enabled) {
      this.init();
      this.orbit8DEnabled = !!enabled;
      if (!enabled && this.panner8D) {
        this.panner8D.pan.value = 0;
      }
    }

    setCompressor(enabled) {
      this.init();
      this.compressorEnabled = !!enabled;
      if (this.masterGain) {
        this.masterGain.gain.value = enabled ? 1.28 : 1.0;
      }
    }

    setKaraoke(enabled) {
      this.init();
      this.karaokeEnabled = !!enabled;
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.normalGain.gain.setTargetAtTime(enabled ? 0.0 : 1.0, now, 0.04);
      this.karaokeGain.gain.setTargetAtTime(enabled ? 1.15 : 0.0, now, 0.04);
    }

    extractArtworkColor() {
      const pal = THEME_PALETTES[this.themeName] || THEME_PALETTES.neon;
      this.glowRGB = [...pal.p1];
      this.secRGB = [...pal.p2];
      this.thirdRGB = [...pal.p3];
    }

    startVisualizer() {
      if (this._animating) return;
      this._animating = true;
      const freqData = new Uint8Array(128);
      const timeData = new Uint8Array(128);
      let tick = 0;

      const draw = () => {
        requestAnimationFrame(draw);
        tick += 0.022;

        const curEl = this.activeSourceType === 'native' ? this.nativeAudio : this.audio;
        const isPlaying = curEl && !curEl.paused;

        if (this.orbit8DEnabled && this.panner8D && this.activeSourceType === 'dsp' && isPlaying) {
          this.orbitAngle += 0.022;
          this.panner8D.pan.value = Math.sin(this.orbitAngle) * 0.88;
        }

        if (document.hidden) return;

        let bassSum = 0;
        let midSum = 0;
        let highSum = 0;
        let hasLiveFft = false;

        if (this.analyser && this.activeSourceType === 'dsp' && isPlaying) {
          this.analyser.getByteFrequencyData(freqData);
          let maxByte = 0;
          for (let i = 0; i < 64; i++) {
            if (freqData[i] > maxByte) maxByte = freqData[i];
          }
          if (maxByte > 2) {
            hasLiveFft = true;
            for (let i = 0; i < 10; i++) bassSum += freqData[i];
            for (let i = 10; i < 45; i++) midSum += freqData[i];
            for (let i = 45; i < 90; i++) highSum += freqData[i];
            bassSum = bassSum / (10 * 255);
            midSum = midSum / (35 * 255);
            highSum = highSum / (45 * 255);
          }
        }

        if (!hasLiveFft) {
          if (isPlaying) {
            // نبض حي متزامن أثناء البث السحابي على iOS Native HLS
            bassSum = 0.25 + Math.abs(Math.sin(tick * 3.4)) * 0.35;
            midSum = 0.22 + Math.abs(Math.cos(tick * 2.7)) * 0.30;
            highSum = 0.18 + Math.abs(Math.sin(tick * 4.5)) * 0.28;
            for (let i = 0; i < 128; i++) {
              freqData[i] = Math.floor(80 + Math.abs(Math.sin(tick * 4.2 + i * 0.35)) * 135);
              timeData[i] = Math.floor(128 + Math.sin(tick * 6 + i * 0.2) * 42);
            }
          } else {
            bassSum = 0.06 + Math.sin(tick * 1.4) * 0.03;
            midSum = 0.05 + Math.cos(tick * 1.1) * 0.025;
            highSum = 0.04;
          }
        }

        this.beatEnergy = this.beatEnergy * 0.78 + bassSum * 0.22;

        document.documentElement.style.setProperty('--beat-energy', this.beatEnergy.toFixed(3));
        document.documentElement.style.setProperty('--mid-energy', midSum.toFixed(3));

        const eqBar1 = document.getElementById('logoEq1');
        const eqBar2 = document.getElementById('logoEq2');
        const eqBar3 = document.getElementById('logoEq3');
        if (eqBar1 && eqBar2 && eqBar3) {
          const h1 = isPlaying ? 6 + bassSum * 18 : 7 + Math.sin(tick * 3) * 3;
          const h2 = isPlaying ? 6 + midSum * 20 : 10 + Math.cos(tick * 3.5) * 4;
          const h3 = isPlaying ? 6 + highSum * 18 : 7 + Math.sin(tick * 4 + 1) * 3;
          eqBar1.setAttribute('height', h1.toFixed(1));
          eqBar1.setAttribute('y', (24 - h1 / 2).toFixed(1));
          eqBar2.setAttribute('height', h2.toFixed(1));
          eqBar2.setAttribute('y', (24 - h2 / 2).toFixed(1));
          eqBar3.setAttribute('height', h3.toFixed(1));
          eqBar3.setAttribute('y', (24 - h3 / 2).toFixed(1));
        }

        if (this.bgCanvas) {
          this._drawReactiveBackground(tick, this.beatEnergy, midSum, isPlaying);
        }

        const targetCanvas = document.getElementById('activeTrackCanvas');
        if (!targetCanvas || !isPlaying) return;
        const g = targetCanvas.getContext('2d');
        const w = (targetCanvas.width = targetCanvas.clientWidth || 340);
        const h = (targetCanvas.height = targetCanvas.clientHeight || 62);
        g.clearRect(0, 0, w, h);

        const [r, gr, b] = this.glowRGB;
        const [r2, g2, b2] = this.secRGB;

        if (this.vizMode === 'bars') {
          const bars = 48;
          const step = w / bars;
          for (let i = 0; i < bars; i++) {
            const val = freqData[i] / 255;
            const bh = Math.max(3, val * (h * 0.86));
            const grad = g.createLinearGradient(0, h, 0, h - bh);
            grad.addColorStop(0, `rgba(${r},${gr},${b},0.16)`);
            grad.addColorStop(1, `rgba(${r2},${g2},${b2},0.52)`);
            g.fillStyle = grad;
            g.beginPath();
            if (g.roundRect) {
              g.roundRect(i * step + 1.5, h - bh, Math.max(2, step - 3), bh, 3);
            } else {
              g.rect(i * step + 1.5, h - bh, Math.max(2, step - 3), bh);
            }
            g.fill();
          }
        } else if (this.vizMode === 'wave') {
          if (hasLiveFft) this.analyser.getByteTimeDomainData(timeData);
          g.lineWidth = 2.2;
          g.strokeStyle = `rgba(${r2},${g2},${b2},0.65)`;
          g.beginPath();
          const slice = w / timeData.length;
          for (let i = 0; i < timeData.length; i++) {
            const y = (timeData[i] / 128.0) * (h / 2);
            i === 0 ? g.moveTo(0, y) : g.lineTo(i * slice, y);
          }
          g.stroke();
        } else if (this.vizMode === 'ring') {
          const cx = w / 2, cy = h / 2, baseR = Math.min(h * 0.25, 16);
          const spikes = 40;
          for (let i = 0; i < spikes; i++) {
            const ang = (i / spikes) * Math.PI * 2 + tick * 0.3;
            const amp = (freqData[i % 40] / 255) * (h * 0.35);
            const x1 = cx + Math.cos(ang) * baseR;
            const y1 = cy + Math.sin(ang) * baseR;
            const x2 = cx + Math.cos(ang) * (baseR + 2 + amp);
            const y2 = cy + Math.sin(ang) * (baseR + 2 + amp);
            g.strokeStyle = i % 2 === 0 ? `rgba(${r},${gr},${b},0.65)` : `rgba(${r2},${g2},${b2},0.65)`;
            g.lineWidth = 2;
            g.beginPath();
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);
            g.stroke();
          }
        }
      };
      draw();
    }

    _drawReactiveBackground(tick, bass, mid, isPlaying) {
      const c = this.bgCanvas;
      const w = (c.width = c.clientWidth || window.innerWidth);
      const h = (c.height = c.clientHeight || window.innerHeight);
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      const [r1, g1, b1] = this.glowRGB;
      const [r2, g2, b2] = this.secRGB;
      const [r3, g3, b3] = this.thirdRGB;

      const speedMul = isPlaying ? 1 + bass * 3.8 : 0.45;

      const orb1X = w * (0.25 + Math.sin(tick * 0.7) * 0.14);
      const orb1Y = h * (0.28 + Math.cos(tick * 0.5) * 0.14);
      const orb1R = Math.max(160, Math.min(w, h) * (0.34 + bass * 0.26));

      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, orb1R);
      grad1.addColorStop(0, `rgba(${r1},${g1},${b1},${(0.16 + bass * 0.24).toFixed(3)})`);
      grad1.addColorStop(1, `rgba(${r1},${g1},${b1},0)`);
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);

      const orb2X = w * (0.75 + Math.cos(tick * 0.6) * 0.14);
      const orb2Y = h * (0.72 + Math.sin(tick * 0.8) * 0.14);
      const orb2R = Math.max(160, Math.min(w, h) * (0.32 + mid * 0.24));

      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, orb2R);
      grad2.addColorStop(0, `rgba(${r2},${g2},${b2},${(0.14 + mid * 0.22).toFixed(3)})`);
      grad2.addColorStop(1, `rgba(${r2},${g2},${b2},0)`);
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      for (let waveIdx = 0; waveIdx < 2; waveIdx++) {
        ctx.beginPath();
        const baseY = h * (waveIdx === 0 ? 0.55 : 0.75);
        const amp = (18 + bass * 68 + mid * 32) * (waveIdx === 0 ? 1 : 0.75);
        for (let x = 0; x <= w; x += 24) {
          const y =
            baseY +
            Math.sin(x * 0.005 + tick * (1.3 + waveIdx * 0.5)) * amp +
            Math.cos(x * 0.01 - tick * 0.9) * (amp * 0.45);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          waveIdx === 0
            ? `rgba(${r2},${g2},${b2},${(0.12 + bass * 0.24).toFixed(3)})`
            : `rgba(${r3},${g3},${b3},${(0.10 + mid * 0.20).toFixed(3)})`;
        ctx.lineWidth = 2 + bass * 3;
        ctx.stroke();
      }

      for (let i = 0; i < this._particles.length; i++) {
        const p = this._particles[i];
        p.x += p.vx * speedMul;
        p.y += p.vy * speedMul;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        const px = p.x * w;
        const py = p.y * h;
        const radius = p.r * (1 + bass * 1.5);
        const alpha = 0.18 + Math.sin(tick * 2 + p.phase) * 0.1 + bass * 0.35;

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? `rgba(${r2},${g2},${b2},${alpha.toFixed(3)})` : `rgba(${r1},${g1},${b1},${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }
  }

  global.StudioAudioEngine = StudioAudioEngine;
  global.EQ_FREQS = EQ_FREQS;
})(window);
