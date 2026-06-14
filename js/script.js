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

/* ═══════════════════════════════════════════════
   v3.1 — Boot sequence & scroll-triggered reveals
   ═══════════════════════════════════════════════ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Generic character-by-character typer ─────────
function typeText(el, text, speed, done) {
  let i = 0;
  el.textContent = '';
  const t = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(t);
      if (done) done();
    }
  }, speed);
}

// ── Boot sequence (first visit per session) ──────
function runBootSequence() {
  const html    = document.documentElement;
  const cmdText = document.getElementById('hero-cmd-text');
  const cursor  = document.getElementById('hero-cmd-cursor');
  const output  = document.getElementById('hero-output');
  const panel   = document.getElementById('hero-panel');

  // Not booting (repeat visit / reduced motion / storage blocked) → ensure visible, bail
  if (!html.classList.contains('booting') || !cmdText || !output) {
    html.classList.remove('booting');
    return;
  }

  try { sessionStorage.setItem('os_booted', '1'); } catch (e) {}

  // Safety net: whatever happens, everything is visible after 4s
  const failsafe = setTimeout(() => {
    html.classList.remove('booting');
    output.style.visibility = 'visible';
    output.querySelectorAll('.boot-el').forEach(el => el.classList.add('on'));
  }, 4000);

  // Build the reveal sequence: pixel art → fastfetch rows → trailing prompt → photo
  const seq  = [];
  const kids = Array.from(output.children);          // [pixel art, info col, photo]
  const art  = kids[0], info = kids[1], photo = kids[2];
  if (art) seq.push([art]);
  if (info) {
    Array.from(info.children).forEach(child => {
      if (child.classList.contains('grid')) {
        const spans = Array.from(child.children);
        for (let i = 0; i < spans.length; i += 2) {
          seq.push(spans.slice(i, i + 2));           // label + value as one "line"
        }
      } else {
        seq.push([child]);
      }
    });
  }
  if (photo) seq.push([photo]);

  // Pre-hide every line, then make the container itself visible
  seq.flat().forEach(el => el.classList.add('boot-el'));
  output.style.visibility = 'visible';

  // Type the command, then cascade the output
  cmdText.style.visibility = 'visible';
  if (cursor) cursor.classList.remove('hidden');

  setTimeout(() => {
    typeText(cmdText, 'fastfetch', 65, () => {
      setTimeout(() => {
        if (cursor) cursor.classList.add('hidden');
        if (panel)  panel.classList.add('crt-flicker');
        html.classList.remove('booting');
        seq.forEach((line, i) => {
          setTimeout(() => line.forEach(el => el.classList.add('on')), i * 55);
        });
        clearTimeout(failsafe);
      }, 250);
    });
  }, 400);
}
runBootSequence();

// ── Scroll-triggered "command execution" ─────────
function initScrollReveals() {
  if (REDUCED_MOTION || !('IntersectionObserver' in window)) return;

  document.querySelectorAll('main > section').forEach(section => {
    const cmdEl = section.querySelector('.section-cmd span:not(.prompt)');
    if (!cmdEl) return;                              // hero has no section-cmd — boot owns it

    const targets = Array.from(section.children)
      .filter(c => !c.classList.contains('section-cmd'));
    targets.forEach(t => t.classList.add('reveal'));

    const cmdFull = cmdEl.textContent;
    cmdEl.textContent = '';

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        cmdEl.classList.add('cmd-typing');
        typeText(cmdEl, cmdFull, 26, () => {
          cmdEl.classList.remove('cmd-typing');
          targets.forEach((t, i) =>
            setTimeout(() => t.classList.add('visible'), i * 90));
        });
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    io.observe(section);
  });
}
initScrollReveals();


// ════════════════════════════════════════════════
// RACK STACKER — datacenter stacking game
// ════════════════════════════════════════════════
(function () {
  const canvas = document.getElementById('rack-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = canvas.width, H = canvas.height;
  const UNIT_H = 26;            // pixel height of one rack unit
  const BASE_W = 150;           // starting unit width
  const SPEED_BASE = 2.2;       // px/frame at start
  const ADMIN_SCORE = 12;       // BEAT_THE_ADMIN target

  const scoreEl  = document.getElementById('rack-score');
  const bestEl   = document.getElementById('rack-best');
  const comboEl  = document.getElementById('rack-combo');
  const startOv  = document.getElementById('rack-start');
  const overOv   = document.getElementById('rack-over');
  const finalEl  = document.getElementById('rack-final');
  const beatEl   = document.getElementById('rack-beat');
  const verdictEl= document.getElementById('rack-over').querySelector('#rack-verdict');

  let best = 0;
  try { best = parseInt(localStorage.getItem('rack_best') || '0', 10) || 0; } catch (e) {}
  bestEl.textContent = best;

  let stack, current, score, speed, dir, state, raf, shake;
  let combo, bestCombo, mult;        // perfect-streak combo system
  // state: 'idle' | 'sliding' | 'dropping' | 'over'

  // Server-unit colours cycle for visual variety
  const HUES = ['#22C55E', '#3B82F6', '#06B6D4', '#8B5CF6', '#EAB308'];
  const PERFECT_REGROW = 14;         // px width recovered on a perfect drop
  const BONUS_GOLD = '#f4c542';      // colour of the bonus "blade server"

  function reset() {
    score = 0;
    speed = SPEED_BASE;
    shake = 0;
    combo = 0; bestCombo = 0; mult = 1;
    stack = [{ x: (W - BASE_W) / 2, w: BASE_W, hue: HUES[0] }];
    spawn();
    scoreEl.textContent = '0';
    if (comboEl) comboEl.textContent = '';
    state = 'sliding';
  }

  function spawn() {
    const top = stack[stack.length - 1];
    dir = Math.random() < 0.5 ? 1 : -1;
    // ~12% chance of a bonus golden blade server (worth 3x, glows)
    const bonus = stack.length > 2 && Math.random() < 0.12;
    current = {
      x: dir === 1 ? -top.w : W,
      w: top.w,
      hue: bonus ? BONUS_GOLD : HUES[stack.length % HUES.length],
      bonus
    };
  }

  // y-position (top-left) of the Nth unit from bottom (0 = base)
  function unitY(indexFromBottom) {
    return H - UNIT_H - indexFromBottom * UNIT_H;
  }

  function drop() {
    if (state !== 'sliding') return;
    const top = stack[stack.length - 1];
    const overlapL = Math.max(current.x, top.x);
    const overlapR = Math.min(current.x + current.w, top.x + top.w);
    const overlap  = overlapR - overlapL;

    if (overlap <= 0) {            // total miss → game over
      gameOver(false);
      return;
    }

    const perfect = Math.abs(current.x - top.x) < 4;
    if (perfect) {
      current.x = top.x;                          // snap
      // reward streak: grow width back a touch, raise multiplier
      combo++;
      bestCombo = Math.max(bestCombo, combo);
      mult = 1 + Math.floor(combo / 3);           // x2 at 3 perfects, x3 at 6...
      current.w = Math.min(current.w + PERFECT_REGROW, BASE_W);
      flashPerfect();
    } else {
      current.x = overlapL;
      current.w = overlap;                        // slice overhang
      combo = 0; mult = 1;                        // streak broken
    }

    stack.push({ x: current.x, w: current.w, hue: current.hue });

    // scoring: base 1, ×combo multiplier, ×3 for a bonus blade
    let gain = 1 * mult * (current.bonus ? 3 : 1);
    score += gain;
    scoreEl.textContent = score;
    if (comboEl) comboEl.textContent = combo >= 2 ? `x${mult} · ${combo} PERFECT` : '';
    if (current.bonus) logMsg(`rack_stacker: <span style="color:${BONUS_GOLD}">BLADE SERVER</span> bonus +${gain}`, 'success');
    shake = perfect ? 6 : 3;

    if (score >= ADMIN_SCORE && score - gain < ADMIN_SCORE)
      logMsg('rack_stacker: passed the ADMIN baseline (12U) &mdash; impressive', 'success');

    speed = SPEED_BASE + stack.length * 0.16;     // ramp by height, not score
    spawn();
    state = 'sliding';
  }

  let perfectFlash = 0;
  function flashPerfect() { perfectFlash = 12; }

  function gameOver(deployed) {
    state = 'over';
    cancelAnimationFrame(raf);
    finalEl.textContent = score;

    if (score > best) {
      best = score;
      bestEl.textContent = best;
      try { localStorage.setItem('rack_best', String(best)); } catch (e) {}
    }

    // Verdict + funny IT-flavoured copy gated on score
    let verdict, beat;
    if (score >= 20)      { verdict = 'SENIOR_INFRA_ENGINEER'; beat = 'Flawless. Change management would be proud.'; }
    else if (score >= ADMIN_SCORE) { verdict = 'ADMIN_BEATEN';   beat = `You beat the admin (${ADMIN_SCORE}U). Respect.`; }
    else if (score >= 6)  { verdict = 'RACK_DEPLOYED';           beat = `${ADMIN_SCORE - score}U short of the admin. Try again.`; }
    else if (score >= 1)  { verdict = 'CABLE_MANAGEMENT_NIGHTMARE'; beat = 'That rack is a fire hazard. Restack.'; }
    else                  { verdict = 'TICKET_ESCALATED';        beat = 'Dropped the very first unit. Bold.'; }

    verdictEl.textContent = verdict;
    beatEl.textContent = bestCombo >= 3 ? `${beat}  (best streak: ${bestCombo} perfect)` : beat;
    if (comboEl) comboEl.textContent = '';
    overOv.classList.remove('hidden');
    overOv.classList.add('flex');
    logMsg(`rack_stacker: run ended &mdash; ${score}U deployed`, score >= ADMIN_SCORE ? 'success' : 'info');
  }

  function loop() {
    // update
    if (state === 'sliding') {
      current.x += dir * speed;
      const top = stack[stack.length - 1];
      // bounce within a generous bound so it's always catchable
      if (current.x + current.w > W + 40) dir = -1;
      if (current.x < -40) dir = 1;
    }
    if (perfectFlash > 0) perfectFlash--;
    if (shake > 0) shake--;

    // draw
    ctx.clearRect(0, 0, W, H);
    const sx = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const sy = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    ctx.save();
    ctx.translate(sx, sy);

    // rack rails (subtle side posts)
    ctx.strokeStyle = 'rgba(139,148,158,0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 12; i++) {
      const y = H - i * UNIT_H;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // camera: if stack is tall, shift everything down so top stays visible
    const visibleRows = Math.floor(H / UNIT_H) - 2;
    const offset = Math.max(0, stack.length - visibleRows) * UNIT_H;

    // stacked units
    for (let i = 0; i < stack.length; i++) {
      drawUnit(stack[i], unitY(i) + offset);
    }
    // moving unit
    if (state === 'sliding') {
      drawUnit(current, unitY(stack.length) + offset, true);
    }

    // perfect flash text
    if (perfectFlash > 0) {
      ctx.fillStyle = `rgba(34,197,94,${perfectFlash / 12})`;
      ctx.font = 'bold 14px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PERFECT', W / 2, unitY(stack.length - 1) + offset - 8);
    }

    ctx.restore();
    if (state !== 'over') raf = requestAnimationFrame(loop);
  }

  function drawUnit(u, y, moving) {
    // bonus blade servers glow
    if (u.bonus) {
      ctx.save();
      ctx.shadowColor = u.hue;
      ctx.shadowBlur = moving ? 16 : 8;
    }
    // body
    ctx.fillStyle = moving ? u.hue : u.hue + 'cc';
    ctx.fillRect(u.x, y, u.w, UNIT_H - 3);
    // face detail: slots + LED
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    for (let v = u.x + 8; v < u.x + u.w - 8; v += 12) {
      ctx.fillRect(v, y + 6, 6, UNIT_H - 15);
    }
    ctx.fillStyle = u.bonus ? '#fff7d6' : (moving ? '#fff' : '#9be59b');
    ctx.fillRect(u.x + u.w - 7, y + 5, 3, 3);   // status LED
    // outline
    ctx.strokeStyle = u.bonus ? 'rgba(244,197,66,0.7)' : 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(u.x + 0.5, y + 0.5, u.w - 1, UNIT_H - 4);
    if (u.bonus) ctx.restore();
  }

  // ── input ──
  function handleDrop() {
    if (state === 'sliding') drop();
  }
  canvas.addEventListener('click', handleDrop);
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && state === 'sliding') { e.preventDefault(); drop(); }
  });

  function startGame() {
    startOv.classList.add('hidden');
    overOv.classList.add('hidden');
    overOv.classList.remove('flex');
    reset();
    logMsg('rack_stacker: deployment started', 'info');
    cancelAnimationFrame(raf);
    loop();
  }

  document.getElementById('rack-start-btn').addEventListener('click', startGame);
  document.getElementById('rack-again').addEventListener('click', startGame);
  document.getElementById('rack-quit').addEventListener('click', () => {
    overOv.classList.add('hidden');
    overOv.classList.remove('flex');
    startOv.classList.remove('hidden');
    state = 'idle';
    ctx.clearRect(0, 0, W, H);
  });
})();


// ════════════════════════════════════════════════
// FLOOR_OPS — a day on the boardroom floor
// Boss-satisfaction model · walking execs · fullscreen
// ════════════════════════════════════════════════
(function () {
  const stage = document.getElementById('floor-stage');
  if (!stage) return;

  // ── DOM refs ──
  const shell   = document.getElementById('floor-shell');
  const clockEl = document.getElementById('fo-clock');
  const scoreEl = document.getElementById('fo-score');
  const bestEl  = document.getElementById('fo-best');
  const bossBar = document.getElementById('fo-boss-bar');
  const bossPct = document.getElementById('fo-boss-pct');
  const moodFace= document.getElementById('fo-mood-face');
  const startOv = document.getElementById('floor-start');
  const overOv  = document.getElementById('floor-over');
  const verdictEl = document.getElementById('floor-verdict');
  const overTitle = document.getElementById('floor-over-title');
  const finalEl = document.getElementById('floor-final');
  const flavorEl= document.getElementById('floor-flavor');
  const fsBtn   = document.getElementById('fo-fullscreen');
  const fsIcon  = document.getElementById('fo-fs-icon');
  const fsLabel = document.getElementById('fo-fs-label');

  // ── Tunables (relaxed but real challenge) ──
  const DAY_LENGTH   = 120000;  // ms for a full 9am→5pm shift (longer = calmer)
  const ADMIN_SCORE  = 600;
  const DISPATCH_MS  = 1500;    // time to walk over + fix
  const RESOLVE_BASE = 14;      // points per fix
  const EVENT_BOOST  = 46;      // event health restored per stabilise
  const BOSS_START   = 80;      // starting boss mood
  const BOSS_HIT_IGNORE = 9;    // mood lost when a fault is left too long
  const BOSS_HIT_EVENT  = 12;   // mood lost if the live event dies down
  const BOSS_GAIN_FIX   = 5;    // mood gained per good fix
  const BOSS_GAIN_EVENT = 4;    // mood gained per event save

  // ── Floor layout (% of stage) ──
  const LAYOUT = [
    { id:'reception', label:'RECEPTION', sub:'lobby',  x:1.5, y:6,  w:18,   h:88, spawn:true },
    { id:'br1', label:'BR-1', sub:'board room', x:21.5, y:6,  w:24.5, h:34, faultable:true },
    { id:'br2', label:'BR-2', sub:'board room', x:48,   y:6,  w:24.5, h:34, faultable:true },
    { id:'br3', label:'BR-3', sub:'board room', x:74,   y:6,  w:24.5, h:34, faultable:true },
    { id:'event', label:'LIVE EVENT HALL', sub:'keynote in progress', x:21.5, y:44, w:77, h:50, event:true },
  ];
  const CENTERS = {};
  LAYOUT.forEach(r => CENTERS[r.id] = { x: r.x + r.w/2, y: r.y + r.h/2 });
  const FIXER_ORIGIN = { x: 10, y: 92 };   // you walk in from by reception (desk removed)

  // ── Funny content ──
  const AV_FAULTS = [
    'HDMI shrugged, no signal', 'Teams call has no audio (again)',
    'Projector showing a desktop of 400 icons', 'Exec can\u2019t find the \u201Cany\u201D key',
    'Someone joined Teams from the ceiling speaker', 'Clicker controlling the wrong screen',
    'Wireless mic doing dial-up noises', 'Screen mirroring mirrored the wrong laptop',
    'VC camera pointed at the ceiling', 'Slides stuck on the title for 20 min',
    'Caps Lock crisis in the board pack', 'Zoom and Teams open, fighting to the death',
  ];
  const HOSP_REQUESTS = [
    'Flat white for the CFO', 'Table needs a tea refresh',
    'Oat milk emergency \u2014 stat', 'Biscuits ran out mid-meeting',
    'Decaf, but make it look like real coffee', 'Pot of English Breakfast for table 3',
    'Iced latte, in this weather', 'Sparkling water, somehow room temp',
    'More pastries, the partners are circling', 'Someone ordered a babyccino (?)',
    'Long black, \u201Cnot too long though\u201D', 'Green tea for the wellness exec',
  ];
  const EVENT_CRISES = [
    'Mic feedback during the CEO\u2019s big line', 'Keynote feed froze on a yawn',
    'Backing track started playing show tunes', 'Confidence monitor went full blue-screen',
    'Stage lights flickering like a nightclub', 'Livestream buffering in front of investors',
    'Someone\u2019s phone is AirPlaying holiday photos to the main screen',
    'Wrong slide deck \u2014 it\u2019s the Christmas party one',
  ];
  const ARRIVALS = [
    'two execs strolled in arguing about a deck',
    'the CFO wants \u201Cjust a quick AV check\u201D (it\u2019s never quick)',
    'coffee cart rolled past, smelling amazing',
    'legal team seated, already on three laptops',
    'someone\u2019s brought pastries to BR-1',
    'the CEO walked in 9 minutes early, of course',
    'an investor is asking where the HDMI cable went',
    'a partner is trying to AirPlay from the lift',
    'a director just asked if the wifi password \u201Cchanged again\u201D',
    'someone booked BR-3 but went to BR-2, classic',
  ];

  // ── State ──
  let roomEls = {}, faultableIds = [];
  let state = 'idle';
  let dayTime, score, best, eventHealth, boss;
  let faults, eventCrisis, dispatch, spawnTimer, arrivalTimer, occupancy, eventCrisisFx;
  let lastFrame, raf;

  try { best = parseInt(localStorage.getItem('floor_best')||'0',10)||0; } catch(e){ best=0; }
  bestEl.textContent = best;

  // ── Build floor ──
  function buildFloor() {
    LAYOUT.forEach(r => {
      const el = document.createElement('div');
      el.className = 'fo-room';
      el.style.left=r.x+'%'; el.style.top=r.y+'%'; el.style.width=r.w+'%'; el.style.height=r.h+'%';
      el.innerHTML = `<div class="fo-label">${r.label}</div><div class="fo-sub">${r.sub}</div>`;
      if (r.faultable || r.event) {
        el.classList.add('fo-clickable');
        el.addEventListener('click', () => onRoomClick(r.id));
      }
      if (r.event) {
        const wrap = document.createElement('div');
        wrap.className = 'fo-event-bar-wrap';
        wrap.innerHTML = '<div class="fo-event-bar" id="fo-event-bar"></div>';
        el.appendChild(wrap);
      }
      stage.appendChild(el);
      roomEls[r.id] = el;
      if (r.faultable) faultableIds.push(r.id);
    });
  }

  // ── Helpers ──
  function fmtClock(p) {
    const totalMin = Math.floor(p*8*60);
    let h = 9 + Math.floor(totalMin/60);
    const m = totalMin%60;
    const ap = h>=12?'PM':'AM';
    let hh = h>12?h-12:h;
    return `${hh}:${String(m).padStart(2,'0')} ${ap}`;
  }
  function roomLabel(id){ return LAYOUT.find(r=>r.id===id).label; }

  function floatPts(id, txt, bad) {
    const f = document.createElement('div');
    f.className = 'fo-float' + (bad?' bad':'');
    f.textContent = txt;
    f.style.left = CENTERS[id].x+'%'; f.style.top = CENTERS[id].y+'%';
    stage.appendChild(f);
    setTimeout(()=>f.remove(), 1000);
  }
  function shake(){ stage.classList.add('fo-shake'); setTimeout(()=>stage.classList.remove('fo-shake'),300); }

  // ── Walking exec sprite ──
  function makeSprite(cls) {
    const s = document.createElement('div');
    s.className = 'fo-exec' + (cls?(' '+cls):'');
    s.innerHTML = '<div class="fo-bob"><div class="fo-head"></div><div class="fo-body"></div></div>'
                + '<div class="fo-leg l"></div><div class="fo-leg r"></div>';
    return s;
  }

  function sendExec() {
    if (state!=='playing') return;
    const targetId = faultableIds[Math.floor(Math.random()*faultableIds.length)];
    const dot = makeSprite();
    const hue = ['#3B82F6','#6366F1','#0EA5E9','#8B5CF6'][Math.floor(Math.random()*4)];
    dot.style.setProperty('--suit', hue);
    dot.style.setProperty('--walk', '2.4s');
    dot.style.left = CENTERS.reception.x+'%';
    dot.style.top  = CENTERS.reception.y+'%';
    stage.appendChild(dot);
    requestAnimationFrame(()=>{ dot.style.left = CENTERS[targetId].x+'%'; dot.style.top = CENTERS[targetId].y+'%'; });
    setTimeout(()=>{ dot.classList.add('arrived'); addOccupant(targetId, hue); }, 2400);
    setTimeout(()=>{ dot.style.opacity='0'; }, 2700);
    setTimeout(()=>dot.remove(), 3200);
    if (Math.random()<0.75) logMsg('floor_ops: '+ARRIVALS[Math.floor(Math.random()*ARRIVALS.length)], 'info');
  }

  function addOccupant(id, hue) {
    occupancy[id]=(occupancy[id]||0)+1;
    const el = roomEls[id]; if(!el) return;
    let occ = el.querySelector('.fo-occ');
    if(!occ){ occ=document.createElement('div'); occ.className='fo-occ'; el.appendChild(occ); }
    if(occ.children.length<5){ const i=document.createElement('i'); if(hue)i.style.setProperty('--suit',hue); occ.appendChild(i); }
  }

  // walking "you" sprite to a room being serviced
  function dispatchFixer(id) {
    const f = makeSprite('fixer');
    f.style.setProperty('--walk', (DISPATCH_MS/1000*0.85)+'s');
    f.style.left = FIXER_ORIGIN.x+'%'; f.style.top = FIXER_ORIGIN.y+'%';
    stage.appendChild(f);
    requestAnimationFrame(()=>{ f.style.left = CENTERS[id].x+'%'; f.style.top = CENTERS[id].y+'%'; });
    return f;
  }

  // ── Faults ──
  // a coffee order that morphs into an AV fault in the same room
  const FOLLOWUP_AV = [
    'caffeinated and confident \u2014 now the HDMI won\u2019t connect',
    'sipped the latte, immediately broke the projector',
    'one flat white later, Teams audio is gone',
    'coffee in hand, clicker stopped working',
    'fully caffeinated, now fighting the screen mirror',
    'post-coffee energy went straight into unplugging something',
  ];
  function scheduleFollowUp(id) {
    if (state !== 'playing') return;
    if (faults[id] || (dispatch && dispatch.id === id)) return;   // room busy/occupied already
    const p = dayTime/DAY_LENGTH;
    const max = 8500 - p*3300;
    const flavor = FOLLOWUP_AV[Math.floor(Math.random()*FOLLOWUP_AV.length)];
    faults[id] = { type: flavor, t:max, max, kind:'av' };
    paintRoom(id);
    logMsg(`floor_ops: <span style="color:#ffb4ab">[BROKE]</span> ${roomLabel(id)} &mdash; ${flavor}`, 'error');
  }

  function spawnFault() {
    if (state!=='playing') return;
    const free = faultableIds.filter(id => !faults[id] && (!dispatch||dispatch.id!==id));
    if (!free.length) return;
    const weighted = free.flatMap(id => Array((occupancy[id]||0)+1).fill(id));
    const id = weighted[Math.floor(Math.random()*weighted.length)];
    const p = dayTime/DAY_LENGTH;
    const max = 8500 - p*3300;     // 8.5s early → ~5.2s late
    const hosp = Math.random() < 0.45;   // ~45% hospitality, ~55% AV
    const type = hosp ? HOSP_REQUESTS[Math.floor(Math.random()*HOSP_REQUESTS.length)]
                      : AV_FAULTS[Math.floor(Math.random()*AV_FAULTS.length)];
    faults[id] = { type, t:max, max, kind: hosp ? 'hosp' : 'av' };
    paintRoom(id);
    const tag = hosp ? '<span style="color:#f5d97a">[ORDER]</span>' : '<span style="color:#ffb4ab">[BROKE]</span>';
    logMsg(`floor_ops: ${tag} ${roomLabel(id)} &mdash; ${type}`, hosp ? 'info' : 'error');
  }

  function triggerEventCrisis() {
    if (eventCrisis) return;
    eventCrisis = true;
    eventHealth = Math.max(0, eventHealth-18);
    roomEls.event.classList.add('event-crit');
    shake();
    const c = EVENT_CRISES[Math.floor(Math.random()*EVENT_CRISES.length)];
    logMsg(`floor_ops: <span style="color:#ffb4ab">[EVENT]</span> ${c}! &mdash; tap the hall`, 'error');
    clearTimeout(eventCrisisFx);
    eventCrisisFx = setTimeout(()=>{ eventCrisis=false; roomEls.event.classList.remove('event-crit'); }, 1600);
  }

  function paintRoom(id) {
    const el = roomEls[id];
    el.classList.add(faults[id].kind === 'hosp' ? 'request' : 'fault');
    if(!el.querySelector('.fo-ring')){ const r=document.createElement('div'); r.className='fo-ring'; el.appendChild(r); }
    let ft = el.querySelector('.fo-fault-text');
    if(!ft){ ft=document.createElement('div'); ft.className='fo-fault-text'; el.appendChild(ft); }
    ft.textContent = (faults[id].kind === 'hosp' ? '\u2615 ' : '') + faults[id].type;
  }

  // ── Boss mood ──
  function setBoss(v) {
    boss = Math.max(0, Math.min(100, v));
    bossBar.style.width = boss+'%';
    bossPct.textContent = Math.round(boss);
    bossBar.style.background = boss>=55 ? '#22C55E' : boss>=30 ? '#EAB308' : '#ba1a1a';
    moodFace.textContent = boss>=70 ? 'sentiment_very_satisfied'
                         : boss>=45 ? 'sentiment_satisfied'
                         : boss>=25 ? 'sentiment_dissatisfied'
                         : 'sentiment_very_dissatisfied';
    moodFace.style.color = boss>=55 ? '#22C55E' : boss>=30 ? '#EAB308' : '#ffb4ab';
  }

  // ── Interaction ──
  function onRoomClick(id) {
    if (state!=='playing' || dispatch) return;
    if (id==='event') {
      dispatch = { id, t:DISPATCH_MS, event:true, sprite:dispatchFixer('event') };
      roomEls.event.classList.add('resolving');
      addProgress('event');
      return;
    }
    if (!faults[id]) return;
    dispatch = { id, t:DISPATCH_MS, kind:faults[id].kind, sprite:dispatchFixer(id) };
    delete faults[id];
    const el = roomEls[id];
    el.classList.remove('fault','request'); el.classList.add('resolving');
    const ring=el.querySelector('.fo-ring'); if(ring)ring.remove();
    const ft=el.querySelector('.fo-fault-text'); if(ft)ft.remove();
    addProgress(id);
  }

  function addProgress(id) {
    const el = roomEls[id];
    let bar = el.querySelector('.fo-progress');
    if(!bar){ bar=document.createElement('div'); bar.className='fo-progress'; el.appendChild(bar); }
    bar.style.setProperty('--p','0%');
  }

  function updateEventBar() {
    const bar = document.getElementById('fo-event-bar'); if(!bar) return;
    bar.style.width = eventHealth+'%';
    bar.classList.toggle('warn', eventHealth<55 && eventHealth>=28);
    bar.classList.toggle('crit', eventHealth<28);
  }

  // ── Main loop ──
  function frame(now) {
    if (state!=='playing') return;
    const dt = Math.min(now-lastFrame, 100);
    lastFrame = now; dayTime += dt;
    const p = dayTime/DAY_LENGTH;
    clockEl.textContent = fmtClock(Math.min(p,1));

    // fault timers
    for (const id of Object.keys(faults)) {
      faults[id].t -= dt;
      const el = roomEls[id];
      const ring = el.querySelector('.fo-ring');
      if (ring) ring.style.setProperty('--p', Math.max(0, faults[id].t/faults[id].max));
      if (faults[id].t <= 0) {
        const wasHosp = faults[id].kind === 'hosp';
        delete faults[id];
        el.classList.remove('fault','request');
        const r=el.querySelector('.fo-ring'); if(r)r.remove();
        const ft=el.querySelector('.fo-fault-text'); if(ft)ft.remove();
        setBoss(boss - BOSS_HIT_IGNORE);
        floatPts(id, '\u2639 boss', true);
        shake();
        const msg = wasHosp ? `${roomLabel(id)} is still waiting on their order` : `${roomLabel(id)} left broken too long`;
        logMsg(`floor_ops: <span style="color:#ffb4ab">[GRR]</span> ${msg} &mdash; boss noticed`, 'error');
        if (boss <= 0) return endDay('boss');
      }
    }

    // dispatch progress
    if (dispatch) {
      dispatch.t -= dt;
      const el = roomEls[dispatch.id];
      const bar = el.querySelector('.fo-progress');
      if (bar) bar.style.setProperty('--p', (1-dispatch.t/DISPATCH_MS)*100+'%');
      if (dispatch.t <= 0) {
        el.classList.remove('resolving');
        const b=el.querySelector('.fo-progress'); if(b)b.remove();
        if (dispatch.sprite){ dispatch.sprite.style.opacity='0'; const sp=dispatch.sprite; setTimeout(()=>sp.remove(),400); }
        if (dispatch.event) {
          eventHealth = Math.min(100, eventHealth+EVENT_BOOST);
          if (eventCrisis){ eventCrisis=false; clearTimeout(eventCrisisFx); roomEls.event.classList.remove('event-crit'); }
          score += 12; setBoss(boss + BOSS_GAIN_EVENT);
          floatPts('event','+12');
          logMsg('floor_ops: <span style="color:#22C55E">live feed saved</span> \u2014 nice', 'success');
        } else {
          score += RESOLVE_BASE; setBoss(boss + BOSS_GAIN_FIX);
          floatPts(dispatch.id, '+'+RESOLVE_BASE);
          const done = dispatch.kind === 'hosp'
            ? `<span style="color:#f5d97a">[SERVED]</span> ${roomLabel(dispatch.id)}`
            : `<span style="color:#22C55E">[FIXED]</span> ${roomLabel(dispatch.id)}`;
          logMsg(`floor_ops: ${done}`, 'success');
          // comedic combo: caffeinated execs immediately break the AV (~50% after a coffee)
          if (dispatch.kind === 'hosp' && Math.random() < 0.5) {
            const rid = dispatch.id;
            setTimeout(() => scheduleFollowUp(rid), 1200 + Math.random()*1500);
          }
        }
        scoreEl.textContent = score;
        dispatch = null;
      }
    }

    // event decay (gentle) + crisis roll
    eventHealth = Math.max(0, eventHealth - (0.022 + p*0.03) * (dt/16.7));
    updateEventBar();
    if (eventHealth <= 0) {
      // event dies → boss hit + reset to a recoverable level (not instant loss)
      setBoss(boss - BOSS_HIT_EVENT);
      eventHealth = 35;
      shake();
      logMsg('floor_ops: <span style="color:#ffb4ab">[OUCH]</span> the live feed dropped \u2014 boss winced', 'error');
      if (boss <= 0) return endDay('boss');
    }
    if (!eventCrisis && Math.random() < (0.0009 + p*0.0016)*(dt/16.7)) triggerEventCrisis();

    // spawns (calmer)
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnFault();
      spawnTimer = (4600 - p*2950) * (0.82 + Math.random()*0.36); // calm morning ~4.6s → afternoon rush ~1.65s
    }
    arrivalTimer -= dt;
    if (arrivalTimer <= 0){ sendExec(); arrivalTimer = 3200 + Math.random()*3200; }

    if (dayTime >= DAY_LENGTH) return endDay('survived');
    raf = requestAnimationFrame(frame);
  }

  // ── Lifecycle ──
  function startGame() {
    faultableIds.forEach(id => {
      const el = roomEls[id];
      el.classList.remove('fault','request','resolving','event-crit');
      el.querySelectorAll('.fo-ring,.fo-fault-text,.fo-progress,.fo-occ').forEach(n=>n.remove());
    });
    roomEls.event.classList.remove('resolving','event-crit');
    roomEls.event.querySelectorAll('.fo-progress').forEach(n=>n.remove());
    stage.querySelectorAll('.fo-exec').forEach(n=>n.remove());

    dayTime=0; score=0; eventHealth=100; faults={}; eventCrisis=false;
    dispatch=null; occupancy={}; spawnTimer=2600; arrivalTimer=1400;
    setBoss(BOSS_START);
    scoreEl.textContent='0'; clockEl.textContent='9:00 AM'; updateEventBar();
    startOv.classList.add('hidden'); overOv.classList.add('hidden');
    state='playing';
    logMsg('floor_ops: <span style="color:#22C55E">shift started \u2014 9:00 AM, coffee in hand</span>', 'success');
    lastFrame = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }

  function endDay(reason) {
    state='over'; cancelAnimationFrame(raf); dispatch=null;
    stage.querySelectorAll('.fo-exec').forEach(n=>n.remove());
    if (score>best){ best=score; bestEl.textContent=best; try{localStorage.setItem('floor_best',String(best));}catch(e){} }
    finalEl.textContent = score;

    let verdict, title, flavor;
    if (reason==='boss') {
      verdict='SEEN_IN_THE_LIFT'; title='The Boss Wants a Word';
      flavor='Mood hit zero. You\u2019re getting a calendar invite titled \u201Cquick chat\u201D. Never good.';
    } else if (score>=ADMIN_SCORE && boss>=70) {
      verdict='FLOOR_LEGEND'; title='Flawless Day';
      flavor=`${score} pts &amp; the boss is beaming \u2014 you beat the admin (${ADMIN_SCORE}). Nobody saw a single thing break.`;
    } else if (boss>=55) {
      verdict='SOLID_SHIFT'; title='Made It to 5 PM';
      flavor='Good day on the floor. The execs have no idea how close some of those were.';
    } else if (boss>=30) {
      verdict='SURVIVED_IT'; title='Clocked Out';
      flavor='You made it, but the boss is giving you That Look. Tomorrow, get there earlier.';
    } else {
      verdict='ROUGH_ONE'; title='Long Day';
      flavor='Survived on vibes and apologies. The retro is going to be spicy.';
    }
    verdictEl.textContent=verdict; overTitle.textContent=title; flavorEl.innerHTML=flavor;
    overOv.classList.remove('hidden');
    logMsg(`floor_ops: shift ended \u2014 ${score} pts, boss at ${Math.round(boss)}% [${verdict}]`, boss>=55?'success':'info');
  }

  function quit() {
    state='idle'; cancelAnimationFrame(raf);
    stage.querySelectorAll('.fo-exec').forEach(n=>n.remove());
    overOv.classList.add('hidden'); startOv.classList.remove('hidden');
  }

  // ── Fullscreen / bigscreen ──
  function toggleBig() {
    const big = shell.classList.toggle('fo-big');
    fsIcon.textContent = big ? 'fullscreen_exit' : 'fullscreen';
    if (fsLabel) fsLabel.textContent = big ? 'EXIT' : 'BIGGER';
    document.body.style.overflow = big ? 'hidden' : '';   // stop background scroll on iOS
  }

  // ── Wire up ──
  buildFloor();
  setBoss(BOSS_START);
  document.getElementById('floor-start-btn').addEventListener('click', startGame);
  document.getElementById('floor-again').addEventListener('click', startGame);
  document.getElementById('floor-quit').addEventListener('click', quit);
  fsBtn.addEventListener('click', toggleBig);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && shell.classList.contains('fo-big')) toggleBig(); });
})();


// ════════════════════════════════════════════════
// HERO TERMINAL CUBE (Three.js) — replaces pixel art
// Falls back to pixel Aa art if WebGL/Three is unavailable.
// ════════════════════════════════════════════════
(function () {
  const wrap = document.getElementById('hero-cube');
  const canvas = document.getElementById('hero-cube-canvas');
  const fallback = document.getElementById('hero-cube-fallback');
  if (!wrap || !canvas) return;

  function showFallback() {
    if (canvas) canvas.style.display = 'none';
    if (fallback) { fallback.classList.remove('hidden'); fallback.classList.add('flex'); }
  }

  // WebGL support check
  function webglOK() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Three.js may still be loading (deferred). Wait for it, then init — or fall back.
  function whenReady(attempt) {
    if (typeof THREE !== 'undefined') return init();
    if (attempt > 40) return showFallback();          // ~4s grace then give up gracefully
    setTimeout(() => whenReady(attempt + 1), 100);
  }

  if (!webglOK()) { showFallback(); return; }
  // kick off once the page has loaded (so the deferred Three.js script is in)
  if (document.readyState === 'complete') whenReady(0);
  else window.addEventListener('load', () => whenReady(0));

  function init() {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) { return showFallback(); }

    const SIZE = 200;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(SIZE, SIZE, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // ── Build a terminal-window texture for a cube face ──
    function faceTexture(drawFn) {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d');
      // panel bg
      g.fillStyle = '#0b0e0d';
      g.fillRect(0, 0, 256, 256);
      // subtle inner border
      g.strokeStyle = 'rgba(34,197,94,0.35)';
      g.lineWidth = 4;
      g.strokeRect(8, 8, 240, 240);
      // window title bar
      g.fillStyle = 'rgba(34,197,94,0.10)';
      g.fillRect(8, 8, 240, 34);
      const dots = ['#ff5f56', '#ffbd2e', '#27c93f'];
      dots.forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.arc(28 + i * 18, 25, 5, 0, Math.PI * 2); g.fill(); });
      g.fillStyle = 'rgba(139,148,158,0.8)';
      g.font = '13px "JetBrains Mono", monospace';
      g.textAlign = 'right';
      g.fillText('aayush_os', 240, 30);
      g.textAlign = 'left';
      drawFn(g);
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      return tex;
    }

    const green = '#22C55E', dim = '#7ee2a8', mut = '#8B949E';
    const faces = [
      // +X
      faceTexture(g => { g.fillStyle = green; g.font = 'bold 30px "JetBrains Mono",monospace';
        g.fillText('root@', 26, 96); g.fillText('aayush', 26, 132);
        g.fillStyle = dim; g.font = '20px "JetBrains Mono",monospace'; g.fillText(':~$ _', 26, 176); }),
      // -X
      faceTexture(g => { g.fillStyle = green; g.font = 'bold 104px "JetBrains Mono",monospace';
        g.fillText('Aa', 60, 178); }),
      // +Y
      faceTexture(g => { g.fillStyle = dim; g.font = '17px "JetBrains Mono",monospace';
        const rows = [['OS', 'AAYUSH_OS'], ['SHELL', 'zsh'], ['ROLE', 'AV / IT'], ['STACK', 'M365·Azure']];
        rows.forEach((r, i) => { g.fillStyle = green; g.fillText(r[0], 26, 86 + i * 30);
          g.fillStyle = mut; g.fillText(': ' + r[1], 120, 86 + i * 30); }); }),
      // -Y
      faceTexture(g => { g.fillStyle = green; g.font = 'bold 64px "JetBrains Mono",monospace';
        g.fillText('</>', 56, 150); g.font = '18px "JetBrains Mono",monospace';
        g.fillStyle = dim; g.fillText('build · ship · fix', 40, 190); }),
      // +Z
      faceTexture(g => { g.fillStyle = green; g.font = '16px "JetBrains Mono",monospace';
        const lines = ['> whoami', 'aayush acharya', '> uptime', 'always learning', '> _'];
        lines.forEach((l, i) => g.fillText(l, 24, 80 + i * 26)); }),
      // -Z
      faceTexture(g => { g.fillStyle = green; g.font = 'bold 22px "JetBrains Mono",monospace';
        g.fillText('AAYUSH', 60, 110); g.fillText('_ACHARYA', 40, 140);
        g.fillStyle = dim; g.font = '16px "JetBrains Mono",monospace'; g.fillText('_OS', 100, 168); }),
    ];

    const materials = faces.map(t => new THREE.MeshBasicMaterial({ map: t }));
    const cube = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), materials);
    scene.add(cube);

    // glowing green wireframe edges
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.22, 2.22, 2.22)),
      new THREE.LineBasicMaterial({ color: 0x22C55E, transparent: true, opacity: 0.9 })
    );
    cube.add(edges);

    cube.rotation.set(-0.5, 0.6, 0);

    // ── Grab-and-drag rotation with inertia ──
    let dragging = false, lastX = 0, lastY = 0;
    let velX = 0, velY = 0;          // angular velocity (radians/frame)
    let idleSpin = reduceMotion ? 0 : 0.0035;
    let lastInteract = 0;

    function pointerDown(e) {
      dragging = true;
      const p = e.touches ? e.touches[0] : e;
      lastX = p.clientX; lastY = p.clientY;
      velX = velY = 0;
      wrap.style.cursor = 'grabbing';
      lastInteract = Date.now();
    }
    function pointerMove(e) {
      if (!dragging) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - lastX, dy = p.clientY - lastY;
      lastX = p.clientX; lastY = p.clientY;
      // drag maps to rotation; record as velocity for inertia
      velY = dx * 0.008;
      velX = dy * 0.008;
      cube.rotation.y += velY;
      cube.rotation.x += velX;
      lastInteract = Date.now();
      if (e.cancelable) e.preventDefault();
    }
    function pointerUp() {
      if (!dragging) return;
      dragging = false;
      wrap.style.cursor = 'grab';
    }

    wrap.style.cursor = 'grab';
    canvas.addEventListener('mousedown', pointerDown);
    window.addEventListener('mousemove', pointerMove, { passive: false });
    window.addEventListener('mouseup', pointerUp);
    canvas.addEventListener('touchstart', pointerDown, { passive: false });
    window.addEventListener('touchmove', pointerMove, { passive: false });
    window.addEventListener('touchend', pointerUp);

    // pause when off-screen or tab hidden (perf)
    let visible = true, running = true, raf;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && running) loop(); })
        .observe(wrap);
    }
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden; if (running && visible) loop();
    });

    function loop() {
      if (!running || !visible) return;
      raf = requestAnimationFrame(loop);

      if (!dragging) {
        // apply inertia from the throw
        cube.rotation.y += velY;
        cube.rotation.x += velX;
        velX *= 0.94; velY *= 0.94;                 // friction
        if (Math.abs(velX) < 0.0002) velX = 0;
        if (Math.abs(velY) < 0.0002) velY = 0;
        // resume gentle auto-spin only after a short idle (so it doesn't fight the user)
        const idle = Date.now() - lastInteract > 1500;
        if (idle && velX === 0 && velY === 0) {
          cube.rotation.y += idleSpin;
          cube.rotation.x += idleSpin * 0.3;
          // ease x back toward a pleasant tilt
          cube.rotation.x += (-0.5 - cube.rotation.x) * 0.01;
        }
      }
      renderer.render(scene, camera);
    }
    loop();
  }
})();