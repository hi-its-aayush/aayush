/* ═══════════════════════════════════════════════
   AAYUSH_ACHARYA_OS — script.js
   ═══════════════════════════════════════════════ */

// ── Mobile menu ──────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('open');
});

function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
}

// ── Uptime counter (IT career start: Feb 2024) ───
function updateUptime() {
  const start = new Date('2024-02-01');
  const now   = new Date();
  const diff  = now - start;

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years     = Math.floor(totalDays / 365);
  const months    = Math.floor((totalDays % 365) / 30);
  const days      = (totalDays % 365) % 30;
  const hours     = Math.floor((diff / (1000 * 60 * 60)) % 24);

  const el = document.getElementById('uptime-counter');
  if (el) el.textContent = `${years}y ${months}m ${days}d ${hours}h`;
}
updateUptime();
setInterval(updateUptime, 60000);

// ── Terminal log helper ──────────────────────────
const termLog = document.getElementById('terminal-log');

function logMsg(msg, type = 'info') {
  if (!termLog) return;
  const time = new Date().toLocaleTimeString([], { hour12: false });
  const el   = document.createElement('div');
  el.style.fontFamily = 'JetBrains Mono, monospace';
  el.style.fontSize   = '11px';
  el.style.color =
    type === 'success' ? '#22C55E' :
    type === 'error'   ? '#ffb4ab' :
    '#c2c6d6';
  el.innerHTML = `<span style="color:#8B949E">[${time}]</span> ${msg}`;
  termLog.insertBefore(el, termLog.lastElementChild);
  termLog.scrollTop = termLog.scrollHeight;
}

// ── Speed Grid ───────────────────────────────────
const speedGridEl   = document.getElementById('speed-grid');
const speedTimerEl  = document.getElementById('speed-timer');
const nextTargetEl  = document.getElementById('next-target');
const startSpeedBtn = document.getElementById('start-speed');

let speedActive = false;
let nextNum     = 1;
let timerInt    = null;

function initSpeedGrid() {
  if (!speedGridEl) return;
  speedGridEl.innerHTML = '';
  const nums = Array.from({ length: 16 }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5);

  nums.forEach(n => {
    const btn = document.createElement('button');
    btn.className   = 'grid-btn';
    btn.textContent = n;
    btn.addEventListener('click', () => handleSpeedClick(n, btn));
    speedGridEl.appendChild(btn);
  });
}

function handleSpeedClick(val, btn) {
  if (!speedActive) return;
  if (val === nextNum) {
    btn.classList.add('hit');
    btn.disabled = true;
    nextNum++;
    if (nextTargetEl) nextTargetEl.textContent = nextNum > 16 ? 'DONE' : nextNum;
    logMsg(`Button ${val} → VALID`, 'success');
    if (nextNum > 16) {
      clearInterval(timerInt);
      speedActive = false;
      logMsg(`GRID_COMPLETE: ${speedTimerEl ? speedTimerEl.textContent : ''}`, 'success');
    }
  } else {
    logMsg(`INVALID: expected ${nextNum}, got ${val}`, 'error');
  }
}

if (startSpeedBtn) {
  startSpeedBtn.addEventListener('click', () => {
    initSpeedGrid();
    nextNum = 1;
    if (nextTargetEl) nextTargetEl.textContent = '1';
    speedActive = true;
    const start = Date.now();
    logMsg('Speed Grid protocol initiated...', 'info');
    timerInt = setInterval(() => {
      if (speedTimerEl)
        speedTimerEl.textContent = `TIME: ${((Date.now() - start) / 1000).toFixed(2)}s`;
    }, 50);
  });
}

// ── Memory Match ─────────────────────────────────
const memGridEl   = document.getElementById('memory-grid');
const memScoreEl  = document.getElementById('mem-score-display');
const memPairsEl  = document.getElementById('mem-pairs');
const resetMemBtn = document.getElementById('reset-memory');

const ICONS = ['database', 'code', 'terminal', 'router', 'memory', 'cpu', 'shield', 'settings'];

let flipped  = [];
let matched  = 0;
let moves    = 0;
let lockMem  = false;

function initMemory() {
  if (!memGridEl) return;
  memGridEl.innerHTML = '';
  const cards = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5);
  matched = 0; moves = 0;
  if (memScoreEl) memScoreEl.textContent = 'MOVES: 0';
  if (memPairsEl) memPairsEl.textContent = '0/8';

  cards.forEach(icon => {
    const card = document.createElement('div');
    card.className    = 'mem-card';
    card.dataset.icon = icon;
    card.innerHTML = `
      <div class="mem-inner">
        <div class="mem-face mem-face-front">
          <span class="material-symbols-outlined" style="color:#8B949E;opacity:0.3;font-size:1.3rem;">help</span>
        </div>
        <div class="mem-face mem-face-back">
          <span class="material-symbols-outlined" style="color:#adc6ff;font-size:1.4rem;">${icon}</span>
        </div>
      </div>`;
    card.addEventListener('click', () => flipMemCard(card));
    memGridEl.appendChild(card);
  });
  logMsg('Memory buffer randomized.', 'info');
}

function flipMemCard(card) {
  if (lockMem || card.classList.contains('matched') || flipped.includes(card)) return;
  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    if (memScoreEl) memScoreEl.textContent = `MOVES: ${moves}`;
    lockMem = true;

    const [a, b] = flipped;
    if (a.dataset.icon === b.dataset.icon) {
      a.classList.add('matched');
      b.classList.add('matched');
      matched++;
      if (memPairsEl) memPairsEl.textContent = `${matched}/8`;
      flipped  = [];
      lockMem  = false;
      logMsg(`MATCH: [${a.dataset.icon}] verified.`, 'success');
      if (matched === 8) logMsg(`MEMORY_COMPLETE: All pairs in ${moves} moves!`, 'success');
    } else {
      logMsg('MISMATCH: conflict in stack.', 'error');
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        flipped = [];
        lockMem = false;
      }, 1000);
    }
  }
}

if (resetMemBtn) resetMemBtn.addEventListener('click', initMemory);

// ── Contact form ─────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'TRANSMITTING...';
    btn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method:  'POST',
        body:    new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        contactForm.reset();
        contactForm.classList.add('hidden');
        if (formSuccess) formSuccess.classList.remove('hidden');
        logMsg('Contact packet delivered successfully.', 'success');
      } else {
        btn.textContent = originalText;
        btn.disabled = false;
        logMsg('Transmission failed. Please try again.', 'error');
      }
    } catch {
      btn.textContent = originalText;
      btn.disabled = false;
      logMsg('Network error. Check connection.', 'error');
    }
  });
}

// ── Mouse glow ───────────────────────────────────
let glowEl = null;

document.addEventListener('mousemove', (e) => {
  if (!glowEl) {
    glowEl = document.createElement('div');
    glowEl.id = 'mouse-glow';
    document.body.appendChild(glowEl);
  }
  glowEl.style.left = (e.clientX - 150) + 'px';
  glowEl.style.top  = (e.clientY - 150) + 'px';
});

// ── Init on load ─────────────────────────────────
window.addEventListener('load', () => {
  initSpeedGrid();
  initMemory();
  logMsg('Game environments ready.', 'info');
});
