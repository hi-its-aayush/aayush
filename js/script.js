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

// ── Uptime counter ───────────────────────────────
function updateUptime() {
  const start     = new Date('2024-02-01');
  const now       = new Date();
  const diff      = now - start;
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years     = Math.floor(totalDays / 365);
  const months    = Math.floor((totalDays % 365) / 30);
  const days      = (totalDays % 365) % 30;
  const hours     = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const el        = document.getElementById('uptime-counter');
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
  el.style.lineHeight = '1.6';
  el.style.color =
    type === 'success' ? '#22C55E' :
    type === 'error'   ? '#ffb4ab' : '#c2c6d6';
  el.innerHTML = `<span style="color:#8B949E">[${time}]</span> ${msg}`;
  termLog.insertBefore(el, termLog.lastElementChild);
  termLog.scrollTop = termLog.scrollHeight;
}

// ════════════════════════════════════════════════
// SPEED GRID
// ════════════════════════════════════════════════
const speedGridEl    = document.getElementById('speed-grid');
const speedTimerEl   = document.getElementById('speed-timer');
const nextTargetEl   = document.getElementById('next-target');
const startSpeedBtn  = document.getElementById('start-speed');
const abortSpeedBtn  = document.getElementById('abort-speed');
const speedResultEl  = document.getElementById('speed-result');
const speedTimeDisp  = document.getElementById('speed-time-display');
const speedPlayAgain = document.getElementById('speed-play-again');
const speedQuit      = document.getElementById('speed-quit');

let speedActive  = false;
let nextNum      = 1;
let timerInt     = null;
let startTime    = null;

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
  // Start timer on first click
  if (!speedActive && val === 1 && nextNum === 1) {
    startSpeedTimer();
  }
  if (!speedActive) return;

  if (val === nextNum) {
    btn.classList.add('hit');
    btn.disabled = true;
    nextNum++;
    if (nextTargetEl) nextTargetEl.textContent = nextNum > 16 ? '–' : nextNum;
    logMsg(`Button ${val} → VALID`, 'success');

    if (nextNum > 16) {
      finishSpeed();
    }
  } else {
    logMsg(`INVALID: expected ${nextNum}, got ${val}`, 'error');
  }
}

function startSpeedTimer() {
  speedActive = true;
  startTime   = Date.now();
  if (abortSpeedBtn) abortSpeedBtn.style.display = 'inline-flex';
  if (startSpeedBtn) startSpeedBtn.textContent = 'RUNNING...';
  timerInt = setInterval(() => {
    if (speedTimerEl)
      speedTimerEl.textContent = `TIME: ${((Date.now() - startTime) / 1000).toFixed(2)}s`;
  }, 50);
}

function finishSpeed() {
  clearInterval(timerInt);
  speedActive = false;
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  if (speedTimerEl) speedTimerEl.textContent = `TIME: ${elapsed}s`;
  if (abortSpeedBtn) abortSpeedBtn.style.display = 'none';
  if (startSpeedBtn) startSpeedBtn.textContent = 'INITIATE';
  if (speedTimeDisp) speedTimeDisp.textContent = `${elapsed}s`;
  if (speedResultEl) speedResultEl.classList.add('show');
  logMsg(`GRID_COMPLETE in ${elapsed}s`, 'success');
}

function resetSpeed() {
  clearInterval(timerInt);
  speedActive = false;
  nextNum     = 1;
  startTime   = null;
  if (speedTimerEl)  speedTimerEl.textContent = 'TIME: 0.00s';
  if (nextTargetEl)  nextTargetEl.textContent = '1';
  if (abortSpeedBtn) abortSpeedBtn.style.display = 'none';
  if (startSpeedBtn) startSpeedBtn.textContent = 'INITIATE';
  if (speedResultEl) speedResultEl.classList.remove('show');
  initSpeedGrid();
}

if (startSpeedBtn) {
  startSpeedBtn.addEventListener('click', () => {
    if (!speedActive) {
      resetSpeed();
      logMsg('Speed Grid ready — click 1 to start timer.', 'info');
    }
  });
}
if (abortSpeedBtn) {
  abortSpeedBtn.addEventListener('click', () => {
    clearInterval(timerInt);
    speedActive = false;
    logMsg('Speed Grid aborted.', 'error');
    if (abortSpeedBtn) abortSpeedBtn.style.display = 'none';
    if (startSpeedBtn) startSpeedBtn.textContent = 'INITIATE';
    resetSpeed();
  });
}
if (speedPlayAgain) speedPlayAgain.addEventListener('click', resetSpeed);
if (speedQuit)      speedQuit.addEventListener('click', () => {
  if (speedResultEl) speedResultEl.classList.remove('show');
});

// ════════════════════════════════════════════════
// MEMORY MATCH
// ════════════════════════════════════════════════
const memGridEl     = document.getElementById('memory-grid');
const memScoreEl    = document.getElementById('mem-score-display');
const memPairsEl    = document.getElementById('mem-pairs');
const resetMemBtn   = document.getElementById('reset-memory');
const memResultEl   = document.getElementById('mem-result');
const memMovesDisp  = document.getElementById('mem-moves-display');
const memPlayAgain  = document.getElementById('mem-play-again');
const memQuit       = document.getElementById('mem-quit');

const ICONS = ['database', 'code', 'terminal', 'router', 'memory', 'cpu', 'shield', 'settings'];
let flipped = [], matched = 0, moves = 0, lockMem = false;

function initMemory() {
  if (!memGridEl) return;
  memGridEl.innerHTML = '';
  const cards = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5);
  matched = 0; moves = 0;
  if (memScoreEl)   memScoreEl.textContent = 'MOVES: 0';
  if (memPairsEl)   memPairsEl.textContent = '0/8';
  if (memResultEl)  memResultEl.classList.remove('show');

  cards.forEach(icon => {
    const card = document.createElement('div');
    card.className    = 'mem-card';
    card.dataset.icon = icon;
    card.innerHTML    = `
      <div class="mem-inner">
        <div class="mem-face mem-face-front">
          <span class="material-symbols-outlined" style="color:#8B949E;opacity:0.3;font-size:1.2rem;">help</span>
        </div>
        <div class="mem-face mem-face-back">
          <span class="material-symbols-outlined" style="color:#adc6ff;font-size:1.3rem;">${icon}</span>
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
      flipped = []; lockMem = false;
      logMsg(`MATCH: [${a.dataset.icon}] verified.`, 'success');
      if (matched === 8) {
        setTimeout(() => {
          if (memMovesDisp) memMovesDisp.textContent = `${moves} moves`;
          if (memResultEl)  memResultEl.classList.add('show');
        }, 400);
        logMsg(`MEMORY_COMPLETE: All pairs in ${moves} moves!`, 'success');
      }
    } else {
      logMsg('MISMATCH: conflict in stack.', 'error');
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        flipped = []; lockMem = false;
      }, 1000);
    }
  }
}

if (resetMemBtn)   resetMemBtn.addEventListener('click', initMemory);
if (memPlayAgain)  memPlayAgain.addEventListener('click', initMemory);
if (memQuit)       memQuit.addEventListener('click', () => {
  if (memResultEl) memResultEl.classList.remove('show');
});

// ── Contact form ─────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'TRANSMITTING...';
    btn.disabled  = true;
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
        logMsg('Contact packet delivered.', 'success');
      } else {
        btn.innerHTML = originalText;
        btn.disabled  = false;
        logMsg('Transmission failed. Try again.', 'error');
      }
    } catch {
      btn.innerHTML = originalText;
      btn.disabled  = false;
      logMsg('Network error.', 'error');
    }
  });
}

// ── Mouse glow ───────────────────────────────────
let glowEl = null;
document.addEventListener('mousemove', (e) => {
  if (!glowEl) {
    glowEl    = document.createElement('div');
    glowEl.id = 'mouse-glow';
    document.body.appendChild(glowEl);
  }
  glowEl.style.left = (e.clientX - 150) + 'px';
  glowEl.style.top  = (e.clientY - 150) + 'px';
});

// ── Init ─────────────────────────────────────────
window.addEventListener('load', () => {
  initSpeedGrid();
  initMemory();
  logMsg('Game environments ready.', 'info');
});