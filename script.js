/**
 * ⚡ CHAOS KEYBOARD SCRIPT ⚡
 * High-octane generative canvas physics, dynamic CSS DOM mayhem,
 * Web Audio synthesizer, glitch filters, screen shakes, and interactive keyboard.
 */

// --- Audio Synth Engine (Web Audio API) ---
class ChaosAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChaoticBlip(char) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const code = char.charCodeAt(0) || 65;
    // Map character code to microtonal frequency & random octave
    const baseFreq = 80 + ((code * 37) % 800);
    const modFreq = baseFreq * (0.5 + Math.random() * 2);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const waveTypes = ['sawtooth', 'square', 'triangle'];
    osc.type = waveTypes[Math.floor(Math.random() * waveTypes.length)];
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(modFreq, this.ctx.currentTime + 0.18);

    filter.type = Math.random() > 0.5 ? 'lowpass' : 'bandpass';
    filter.frequency.setValueAtTime(800 + Math.random() * 2500, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.23);
  }

  playNukeSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.9);
  }
}

    // Canvas Chaos Particle & Laser Grid Physics System
class ChaosCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.lightningArcs = [];
    this.splatters = [];
    this.laserLines = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addExplosion(x, y, count = 28, baseColor = '#ff007f') {
    const palette = ['#ff007f', '#00f0ff', '#39ff14', '#ffe600', '#b026ff', '#ff5500', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 14;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const size = 3 + Math.random() * 12;
      const type = Math.random() > 0.4 ? 'circle' : (Math.random() > 0.5 ? 'spark' : 'poly');

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color,
        type,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3,
        alpha: 1,
        life: 0.015 + Math.random() * 0.025,
        gravity: 0.18 + Math.random() * 0.2
      });
    }

    // Add chaotic splatters on canvas
    if (Math.random() > 0.3) {
      this.splatters.push({
        x,
        y,
        radius: 15 + Math.random() * 45,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.8,
        decay: 0.01 + Math.random() * 0.015,
        drips: Array.from({ length: 4 }, () => ({
          dx: (Math.random() - 0.5) * 40,
          dy: 10 + Math.random() * 60,
          r: 2 + Math.random() * 6
        }))
      });
    }

    // Add multiple canvas laser beam slices across the screen
    this.addScreenLaserSlices(x, y);

    // Occasional neon lightning bolt across screen
    if (Math.random() > 0.3) {
      this.addLightning(x, y);
    }
  }

  addScreenLaserSlices(x, y) {
    const palette = ['#ff007f', '#00f0ff', '#39ff14', '#ffe600', '#ffffff', '#ff3300', '#00ffff'];
    const count = 3 + Math.floor(Math.random() * 5); // 3 to 7 full-screen lasers

    for (let i = 0; i < count; i++) {
      const isHorizontal = Math.random() > 0.5;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const lineWidth = 1.5 + Math.random() * 4.5;

      let x1, y1, x2, y2;
      const type = Math.floor(Math.random() * 3);

      if (type === 0) {
        // Horizontal cut all the way through the screen
        const targetY = (Math.random() > 0.4) ? y + (Math.random() - 0.5) * 120 : Math.random() * this.canvas.height;
        x1 = 0;
        y1 = targetY;
        x2 = this.canvas.width;
        y2 = targetY + (Math.random() - 0.5) * 40;
      } else if (type === 1) {
        // Vertical cut all the way through the screen
        const targetX = (Math.random() > 0.4) ? x + (Math.random() - 0.5) * 120 : Math.random() * this.canvas.width;
        x1 = targetX;
        y1 = 0;
        x2 = targetX + (Math.random() - 0.5) * 40;
        y2 = this.canvas.height;
      } else {
        // Wild diagonal screen-cutting laser
        const angle = Math.random() * Math.PI * 2;
        const len = Math.max(this.canvas.width, this.canvas.height) * 1.5;
        x1 = x - Math.cos(angle) * len;
        y1 = y - Math.sin(angle) * len;
        x2 = x + Math.cos(angle) * len;
        y2 = y + Math.sin(angle) * len;
      }

      this.laserLines.push({
        x1, y1, x2, y2,
        color,
        lineWidth,
        alpha: 1,
        decay: 0.05 + Math.random() * 0.04
      });
    }
  }

  addLightning(startX, startY) {
    const endX = Math.random() * this.canvas.width;
    const endY = Math.random() * this.canvas.height;
    const segments = 12;
    const points = [{ x: startX, y: startY }];

    let currX = startX;
    let currY = startY;
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const targetX = startX + (endX - startX) * t;
      const targetY = startY + (endY - startY) * t;
      const jitter = (1 - t) * 70;
      currX = targetX + (Math.random() - 0.5) * jitter;
      currY = targetY + (Math.random() - 0.5) * jitter;
      points.push({ x: currX, y: currY });
    }
    points.push({ x: endX, y: endY });

    const colors = ['#00f0ff', '#39ff14', '#ffe600', '#ff007f', '#ffffff'];
    this.lightningArcs.push({
      points,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.08
    });
  }

  clear() {
    this.particles = [];
    this.lightningArcs = [];
    this.splatters = [];
    this.laserLines = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw full-screen cutting lasers
    for (let i = this.laserLines.length - 1; i >= 0; i--) {
      const line = this.laserLines[i];
      line.alpha -= line.decay;
      if (line.alpha <= 0) {
        this.laserLines.splice(i, 1);
        continue;
      }
      this.ctx.save();
      this.ctx.globalAlpha = line.alpha;
      this.ctx.strokeStyle = line.color;
      this.ctx.lineWidth = line.lineWidth;
      this.ctx.shadowColor = line.color;
      this.ctx.shadowBlur = 18;
      this.ctx.beginPath();
      this.ctx.moveTo(line.x1, line.y1);
      this.ctx.lineTo(line.x2, line.y2);
      this.ctx.stroke();

      // White hot core in center of laser
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = Math.max(1, line.lineWidth * 0.35);
      this.ctx.shadowBlur = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(line.x1, line.y1);
      this.ctx.lineTo(line.x2, line.y2);
      this.ctx.stroke();

      this.ctx.restore();
    }

    // Draw splatters
    for (let i = this.splatters.length - 1; i >= 0; i--) {
      const s = this.splatters[i];
      s.alpha -= s.decay;
      if (s.alpha <= 0) {
        this.splatters.splice(i, 1);
        continue;
      }
      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // splat drips
      for (const d of s.drips) {
        this.ctx.beginPath();
        this.ctx.arc(s.x + d.dx, s.y + d.dy, d.r, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    // Draw lightning arcs
    for (let i = this.lightningArcs.length - 1; i >= 0; i--) {
      const arc = this.lightningArcs[i];
      arc.alpha -= arc.decay;
      if (arc.alpha <= 0) {
        this.lightningArcs.splice(i, 1);
        continue;
      }
      this.ctx.save();
      this.ctx.globalAlpha = arc.alpha;
      this.ctx.strokeStyle = arc.color;
      this.ctx.lineWidth = 3;
      this.ctx.shadowColor = arc.color;
      this.ctx.shadowBlur = 15;
      this.ctx.beginPath();
      for (let j = 0; j < arc.points.length; j++) {
        const pt = arc.points[j];
        if (j === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      }
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.rotation += p.vRot;
      p.alpha -= p.life;

      if (p.alpha <= 0 || p.x < 0 || p.x > this.canvas.width || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.strokeStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      if (p.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'spark') {
        this.ctx.lineWidth = p.size * 0.4;
        this.ctx.beginPath();
        this.ctx.moveTo(-p.size * 2, 0);
        this.ctx.lineTo(p.size * 2, 0);
        this.ctx.stroke();
      } else {
        // Poly / triangle / diamond
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size);
        this.ctx.lineTo(p.size, p.size);
        this.ctx.lineTo(-p.size, p.size);
        this.ctx.closePath();
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    requestAnimationFrame(this.animate);
  }
}

// --- Main Chaos Keyboard Controller ---
class ChaosKeyboardApp {
  constructor() {
    this.audio = new ChaosAudio();
    this.canvas = new ChaosCanvas(document.getElementById('chaos-canvas'));
    this.overlay = document.getElementById('chaos-overlay');
    this.streamContainer = document.getElementById('live-text-stream');
    this.keyboardContainer = document.getElementById('keyboard');
    this.screenWrapper = document.getElementById('screen-wrapper');

    // Stats
    this.chaosMeterEl = document.getElementById('chaos-meter');
    this.keystrokeCountEl = document.getElementById('keystroke-count');
    this.comboCountEl = document.getElementById('combo-count');

    this.keystrokes = 0;
    this.chaosLevel = 0;
    this.combo = 0;
    this.lastTypeTime = Date.now();
    this.autoSmashing = false;
    this.autoInterval = null;

    // Word & Meme generator dictionaries
    this.chaosWords = [
      '⚡KABOOM⚡', '💥GLITCH💥', 'ERROR_404', 'SYSTEM_PURGE', '🔥MAX_ENTROPY🔥',
      'CORRUPT!', 'CRASH!', 'OVERFLOW', 'VIRUS_ALERT', 'SYNTAX_VOID', 'QUANTUM_LEAP',
      'NULL_POINTER', 'SEGFAULT', 'HA_HA_HA', 'TERMINAL_DEATH', 'BEAST_MODE'
    ];

    this.asciiArts = [
      "  (╯°□°)╯︵ ┻━┻  ",
      "  [⚠ CORRUPTED ⚠] ",
      "   (ノಠ益ಠ)ノ彡┻━┻  ",
      "  { 0101010101 }  ",
      "  ☠ MALWARE_V9 ☠  ",
      "  ★ OVERLOAD ★    "
    ];

    this.colors = [
      '#ff007f', '#00f0ff', '#39ff14', '#ffe600', '#b026ff', '#ff5500', '#00ffcc', '#ff0033'
    ];

    this.initKeyboard();
    this.bindEvents();
    this.startDecayLoop();
  }

  initKeyboard() {
    // Standard keyboard layout rows
    const layout = [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK'],
      ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
      ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'],
      ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'DEL'],
      ['CTRL', 'ALT', 'SPACE', 'ALT', 'ESC']
    ];

    this.keyMap = new Map();

    layout.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'kb-row';

      row.forEach(keyText => {
        const btn = document.createElement('button');
        btn.className = 'key';
        btn.dataset.key = keyText.toLowerCase();

        // Specific sizes
        if (keyText === 'SPACE') {
          btn.classList.add('key-space');
        } else if (['BACK', 'TAB', 'CAPS', 'ENTER', 'SHIFT'].includes(keyText)) {
          btn.classList.add('key-wide-1');
        } else if (['CTRL', 'ALT', 'ESC', 'DEL'].includes(keyText)) {
          btn.classList.add('key-wide-2');
        }

        btn.textContent = keyText;

        // Click / Touch event
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.triggerChaos(keyText === 'SPACE' ? ' ' : keyText);
          this.highlightKey(btn);
        });

        rowEl.appendChild(btn);
        this.keyMap.set(keyText.toLowerCase(), btn);
      });

      this.keyboardContainer.appendChild(rowEl);
    });
  }

  highlightKey(btn) {
    if (!btn) return;
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 140);
  }

  bindEvents() {
    // Global keyboard listener
    window.addEventListener('keydown', (e) => {
      // Prevent browser default on Space, Tab, Backspace to keep page intact
      if (['Space', 'Tab', 'Backspace', 'Enter'].includes(e.code)) {
        e.preventDefault();
      }

      let key = e.key;
      let searchKey = key.toLowerCase();
      if (key === ' ') {
        key = 'SPACE';
        searchKey = 'space';
      } else if (key === 'Backspace') {
        key = 'BACK';
        searchKey = 'back';
      } else if (key === 'Enter') {
        key = 'ENTER';
        searchKey = 'enter';
      } else if (key === 'Tab') {
        key = 'TAB';
        searchKey = 'tab';
      } else if (key === 'Shift') {
        key = 'SHIFT';
        searchKey = 'shift';
      } else if (key === 'Escape') {
        key = 'ESC';
        searchKey = 'esc';
      }

      const btn = this.keyMap.get(searchKey);
      if (btn) this.highlightKey(btn);

      this.triggerChaos(key);
    });

    // Control buttons
    const audioBtn = document.getElementById('toggle-audio-btn');
    audioBtn.addEventListener('click', () => {
      this.audio.enabled = !this.audio.enabled;
      audioBtn.querySelector('.label').textContent = `AUDIO SYNTH: ${this.audio.enabled ? 'ON' : 'OFF'}`;
      audioBtn.style.borderColor = this.audio.enabled ? 'var(--neon-lime)' : 'gray';
    });

    const nukeBtn = document.getElementById('nuke-btn');
    nukeBtn.addEventListener('click', () => {
      this.nukeScreen();
    });

    const autoBtn = document.getElementById('auto-chaos-btn');
    autoBtn.addEventListener('click', () => {
      this.toggleAutoSmash(autoBtn);
    });
  }

  triggerChaos(char) {
    const now = Date.now();
    if (now - this.lastTypeTime < 500) {
      this.combo++;
    } else {
      this.combo = 1;
    }
    this.lastTypeTime = now;
    this.keystrokes++;

    this.chaosLevel = Math.min(100, this.chaosLevel + 6);
    this.updateHUD();

    // Sound
    this.audio.playChaoticBlip(char);

    // 1. Terminal stream text
    this.appendToTerminal(char);

    // 2. Compute randomized origin or target around screen
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    // 3. Canvas particle, splatter, and laser explosion
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.canvas.addExplosion(x, y, 20 + Math.min(this.combo, 40), color);

    // 4. Spawn high-intensity DOM lines & screen tear cuts across the whole display
    this.spawnScreenLinesAndSlices(x, y, color);

    // 5. Spawn flying chaotic typography / words
    this.spawnFlyingText(char, x, y);

    // 6. Spawn geometric glitch shapes & icons
    this.spawnChaosShapes(x, y);

    // 7. Shake & distort DOM
    this.shakeScreen();

    // 8. Random ASCII or glitch meme alert
    if (Math.random() > 0.65 || this.combo % 7 === 0) {
      this.spawnAsciiOrMeme(x, y);
    }

    // 9. Screen Flash on high combo
    if (this.combo > 4 && Math.random() > 0.35) {
      this.flashScreen(color);
    }
  }

  spawnScreenLinesAndSlices(originX, originY, baseColor) {
    // 1. Full-width horizontal laser line
    const hLine = document.createElement('div');
    hLine.className = 'chaos-line-h';
    hLine.style.top = `${originY}px`;
    hLine.style.height = `${2 + Math.random() * 5}px`;
    hLine.style.background = `linear-gradient(90deg, transparent, ${baseColor}, #ffffff, ${baseColor}, transparent)`;
    hLine.style.boxShadow = `0 0 20px ${baseColor}, 0 0 40px ${baseColor}`;
    hLine.style.setProperty('--drift-y', `${(Math.random() - 0.5) * 80}px`);
    this.overlay.appendChild(hLine);
    setTimeout(() => hLine.remove(), 450);

    // 2. Full-height vertical laser line
    const vLine = document.createElement('div');
    vLine.className = 'chaos-line-v';
    vLine.style.left = `${originX}px`;
    vLine.style.width = `${2 + Math.random() * 5}px`;
    vLine.style.background = `linear-gradient(180deg, transparent, ${baseColor}, #ffffff, ${baseColor}, transparent)`;
    vLine.style.boxShadow = `0 0 20px ${baseColor}, 0 0 40px ${baseColor}`;
    vLine.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 80}px`);
    this.overlay.appendChild(vLine);
    setTimeout(() => vLine.remove(), 450);

    // 3. Diagonal razor slashes cutting across screen
    const slashCount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < slashCount; i++) {
      const slash = document.createElement('div');
      slash.className = 'chaos-diagonal-slash';
      const angle = (Math.random() - 0.5) * 160;
      const slashColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      slash.style.left = `${originX}px`;
      slash.style.top = `${originY}px`;
      slash.style.height = `${2 + Math.random() * 4}px`;
      slash.style.background = `linear-gradient(90deg, transparent 10%, ${slashColor} 30%, #fff 50%, ${slashColor} 70%, transparent 90%)`;
      slash.style.boxShadow = `0 0 25px ${slashColor}`;
      slash.style.setProperty('--angle', `${angle}deg`);
      slash.style.setProperty('--drift-y', `${(Math.random() - 0.5) * 60}px`);
      this.overlay.appendChild(slash);
      setTimeout(() => slash.remove(), 500);
    }

    // 4. Cyber screen tear / CRT horizontal slice displacement
    if (Math.random() > 0.3) {
      const tear = document.createElement('div');
      tear.className = 'screen-tear-slice';
      tear.style.top = `${Math.random() * window.innerHeight}px`;
      tear.style.height = `${15 + Math.random() * 55}px`;
      tear.style.setProperty('--shift-x', `${(Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 60)}px`);
      document.body.appendChild(tear);
      setTimeout(() => tear.remove(), 360);
    }
  }

  appendToTerminal(char) {
    const span = document.createElement('span');
    span.className = 'stream-char';
    span.textContent = char.length === 1 ? char : `[${char}]`;
    const randColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    span.style.color = randColor;
    span.style.textShadow = `0 0 10px ${randColor}`;
    span.style.transform = `rotate(${(Math.random() - 0.5) * 20}deg) scale(${0.8 + Math.random() * 0.5})`;

    this.streamContainer.appendChild(span);

    // Keep terminal buffer clean
    while (this.streamContainer.childNodes.length > 35) {
      this.streamContainer.removeChild(this.streamContainer.firstChild);
    }
  }

  spawnFlyingText(char, originX, originY) {
    const textEl = document.createElement('div');
    textEl.className = 'chaos-flying-text';

    // Random choice: the typed letter blown up, or a chaos exclamation
    const isMemeWord = Math.random() > 0.6;
    textEl.textContent = isMemeWord 
      ? this.chaosWords[Math.floor(Math.random() * this.chaosWords.length)]
      : (char.length === 1 ? char.repeat(1 + Math.floor(Math.random() * 4)) : char);

    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const fontSize = isMemeWord ? (22 + Math.random() * 45) : (35 + Math.random() * 75);

    textEl.style.color = color;
    textEl.style.fontSize = `${fontSize}px`;
    textEl.style.textShadow = `0 0 20px ${color}, 2px 2px 0px #fff, -2px -2px 0px #000`;
    textEl.style.left = `${originX}px`;
    textEl.style.top = `${originY}px`;

    // Movement vectors
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 350;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const rotStart = (Math.random() - 0.5) * 60;
    const rotEnd = rotStart + (Math.random() - 0.5) * 180;
    const scaleEnd = 1.2 + Math.random() * 1.5;

    textEl.style.setProperty('--dx', `${dx}px`);
    textEl.style.setProperty('--dy', `${dy}px`);
    textEl.style.setProperty('--rot-start', `${rotStart}deg`);
    textEl.style.setProperty('--rot-end', `${rotEnd}deg`);
    textEl.style.setProperty('--scale-end', scaleEnd);

    this.overlay.appendChild(textEl);
    setTimeout(() => textEl.remove(), 1200);
  }

  spawnChaosShapes(originX, originY) {
    const shapes = ['▲', '◆', '✖', '★', '⚡', '⬤', '⬡', '✦'];
    const count = 2 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      const shapeEl = document.createElement('div');
      shapeEl.className = 'chaos-shape';
      shapeEl.textContent = shapes[Math.floor(Math.random() * shapes.length)];

      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const size = 20 + Math.random() * 60;

      shapeEl.style.color = color;
      shapeEl.style.fontSize = `${size}px`;
      shapeEl.style.textShadow = `0 0 15px ${color}`;
      shapeEl.style.left = `${originX}px`;
      shapeEl.style.top = `${originY}px`;

      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 300;
      shapeEl.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      shapeEl.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      shapeEl.style.setProperty('--target-scale', (0.5 + Math.random() * 1.5).toString());
      shapeEl.style.setProperty('--target-rot', `${(Math.random() - 0.5) * 720}deg`);

      this.overlay.appendChild(shapeEl);
      setTimeout(() => shapeEl.remove(), 1500);
    }
  }

  spawnAsciiOrMeme(originX, originY) {
    const asciiEl = document.createElement('div');
    asciiEl.className = 'chaos-ascii-box';
    asciiEl.textContent = this.asciiArts[Math.floor(Math.random() * this.asciiArts.length)];

    // Clamp coordinates inside window
    const clampedX = Math.max(80, Math.min(window.innerWidth - 180, originX));
    const clampedY = Math.max(80, Math.min(window.innerHeight - 150, originY));

    asciiEl.style.left = `${clampedX}px`;
    asciiEl.style.top = `${clampedY}px`;

    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    asciiEl.style.borderColor = color;
    asciiEl.style.color = color;
    asciiEl.style.boxShadow = `0 0 25px ${color}`;

    this.overlay.appendChild(asciiEl);
    setTimeout(() => asciiEl.remove(), 1800);
  }

  flashScreen(color) {
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    flash.style.background = color;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 260);
  }

  shakeScreen() {
    const intensity = Math.min(25, 4 + this.chaosLevel * 0.2);
    const shakeX = (Math.random() - 0.5) * intensity;
    const shakeY = (Math.random() - 0.5) * intensity;
    const rot = (Math.random() - 0.5) * (intensity * 0.12);

    document.body.style.transform = `translate(${shakeX}px, ${shakeY}px) rotate(${rot}deg)`;
    this.screenWrapper.style.transform = `scale(${1 + (Math.random() - 0.5) * 0.05}) rotate(${-rot * 1.5}deg)`;

    // Color distortion class based on chaos level
    document.body.classList.remove('body-distort-1', 'body-distort-2', 'body-distort-3');
    if (this.chaosLevel > 70) {
      document.body.classList.add('body-distort-3');
    } else if (this.chaosLevel > 40) {
      document.body.classList.add('body-distort-2');
    } else if (this.chaosLevel > 20) {
      document.body.classList.add('body-distort-1');
    }

    setTimeout(() => {
      document.body.style.transform = 'none';
      this.screenWrapper.style.transform = 'none';
    }, 80);
  }

  updateHUD() {
    this.chaosMeterEl.textContent = `${Math.round(this.chaosLevel)}%`;
    this.keystrokeCountEl.textContent = this.keystrokes;
    this.comboCountEl.textContent = `${this.combo}x`;
  }

  startDecayLoop() {
    // Gradually cool down chaos level if idle
    setInterval(() => {
      const timeSinceType = Date.now() - this.lastTypeTime;
      if (timeSinceType > 600 && this.chaosLevel > 0) {
        this.chaosLevel = Math.max(0, this.chaosLevel - 2);
        this.updateHUD();
        if (this.chaosLevel < 20) {
          document.body.classList.remove('body-distort-1', 'body-distort-2', 'body-distort-3');
        }
      }
      if (timeSinceType > 1200 && this.combo > 0) {
        this.combo = 0;
        this.updateHUD();
      }
    }, 120);
  }

  nukeScreen() {
    this.audio.playNukeSound();
    this.flashScreen('#ffffff');

    // Canvas mega burst
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        this.canvas.addExplosion(x, y, 70, '#ffffff');
        this.canvas.addLightning(window.innerWidth / 2, window.innerHeight / 2);
      }, i * 60);
    }

    // Clear overlay elements
    this.overlay.innerHTML = '';
    this.streamContainer.innerHTML = '<span style="color:#ff0055;font-weight:900;">[SYSTEM WIPED / ALL PARTICLES DETONATED]</span>';

    this.chaosLevel = 100;
    this.updateHUD();
    this.shakeScreen();

    setTimeout(() => {
      this.canvas.clear();
      this.chaosLevel = 0;
      this.combo = 0;
      this.updateHUD();
      document.body.classList.remove('body-distort-1', 'body-distort-2', 'body-distort-3');
    }, 1000);
  }

  toggleAutoSmash(btn) {
    this.autoSmashing = !this.autoSmashing;
    if (this.autoSmashing) {
      btn.querySelector('.label').textContent = 'STOP SMASH';
      btn.style.borderColor = 'var(--neon-pink)';
      const testChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      this.autoInterval = setInterval(() => {
        const char = testChars[Math.floor(Math.random() * testChars.length)];
        const keyBtn = this.keyMap.get(char.toLowerCase());
        if (keyBtn) this.highlightKey(keyBtn);
        this.triggerChaos(char);
      }, 90);
    } else {
      btn.querySelector('.label').textContent = 'AUTO SMASH';
      btn.style.borderColor = '';
      clearInterval(this.autoInterval);
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new ChaosKeyboardApp();
});
