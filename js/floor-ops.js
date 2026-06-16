(function(){
  const IMG_SRC = "assets/floor.png";
  const cv=document.getElementById('fo2-canvas'); if(!cv) return; const ctx=cv.getContext('2d');
  const IW=1024, IH=572; let dpr=Math.min(window.devicePixelRatio||1,2), scaleF=1;
  const img=new Image();

  function resize(){
    const cssW=Math.min(document.getElementById('fo2-stage').clientWidth, 860);
    scaleF=cssW/IW; const cssH=IH*scaleF;
    cv.style.width=cssW+'px'; cv.style.height=cssH+'px';
    cv.width=cssW*dpr; cv.height=cssH*dpr; ctx.setTransform(scaleF*dpr,0,0,scaleF*dpr,0,0);
  }

  // ── rooms in image coords ──
  const ROOMS={
    br1:{x:198,y:42,w:235,h:165,cx:315,cy:122,label:'BR-1'},
    br2:{x:448,y:42,w:205,h:165,cx:550,cy:122,label:'BR-2'},
    br3:{x:676,y:42,w:214,h:165,cx:783,cy:122,label:'BR-3'},
    event:{x:382,y:320,w:505,h:188,cx:545,cy:430,label:'LIVE EVENT HALL'},
  };
  const FAULTABLE=['br1','br2','br3'];
  const BASE={x:250,y:430}, HALLY=262;

  // seated people around each boardroom table + a few in the event hall (decorative, code-drawn)
  const SHIRTS=['#d8534f','#3b82f6','#e0a13a','#5fa86b','#9b6dd0','#cf6f9c'];
  const SEATS=[];
  [ROOMS.br1,ROOMS.br2,ROOMS.br3].forEach((r,ri)=>{
    const tx=r.cx, ty=r.cy;
    [[-30,-6],[-12,-18],[12,-18],[30,-6],[-12,16],[12,16]].forEach((o,i)=>{
      SEATS.push({x:tx+o[0], y:ty+o[1], shirt:SHIRTS[(ri*2+i)%SHIRTS.length]});
    });
  });
  for(let row=0;row<3;row++) for(let s=0;s<5;s++){
    if((row+s)%2) continue;
    SEATS.push({x:520+s*30, y:425+row*22, shirt:SHIRTS[(row+s)%SHIRTS.length]});
  }

  // ambient walkers: spawn at reception, stroll down the hallway, peel into a room
  const walkers=[];
  function walkerPath(){
    const start={x:215,y:430}, hall={x:300,y:HALLY};
    const target = Math.random()<0.7
      ? (()=>{ const r=ROOMS[FAULTABLE[Math.floor(Math.random()*3)]]; return [{x:r.cx,y:HALLY},{x:r.cx,y:r.cy}]; })()
      : (()=>{ const x=460+Math.random()*180; return [{x,y:HALLY},{x,y:430}]; })();
    return [start,hall,...target];
  }
  function spawnWalker(delay){ walkers.push({path:walkerPath(),seg:0,p:0,
    speed:0.00055+Math.random()*0.0004, shirt:SHIRTS[Math.floor(Math.random()*SHIRTS.length)],
    wait:delay||0, bob:Math.random()*6}); }
  for(let i=0;i<4;i++) spawnWalker(i*1400);
  function updateWalkers(dt){ walkers.forEach(w=>{
    if(w.wait>0){ w.wait-=dt; return; }
    const a=w.path[w.seg], b=w.path[w.seg+1];
    if(!b){ w.path=walkerPath(); w.seg=0; w.p=0; w.wait=1500+Math.random()*3000; return; }
    const d=Math.hypot(b.x-a.x,b.y-a.y); w.p+=(w.speed*dt)/(d||1);
    if(w.p>=1){ w.p=0; w.seg++; }
  }); }

  // ── content ──
  const AV=['HDMI shrugged, no signal','Teams call has no audio (again)','Projector showing 400 desktop icons',
    'Exec can\u2019t find the \u201Cany\u201D key','Joined Teams from the ceiling speaker','Clicker controlling the wrong screen',
    'Wireless mic doing dial-up noises','Screen-mirrored the wrong laptop','VC camera pointed at the ceiling',
    'Slides stuck on the title for 20 min','Caps Lock crisis in the board pack','Zoom and Teams fighting to the death'];
  const HOSP=['Flat white for the CEO','Boiling water, extra hot... like their personality','Oat milk emergency \u2014 stat',
    'Biscuits ran out mid-meeting','Decaf, but make it look real','Pot of English Breakfast for table 3',
    'Iced latte, in this weather','Sparkling water, somehow room temp','More pastries, partners are circling',
    'Someone ordered a babyccino (?)','Long black, \u201Cnot too long though\u201D','Green tea for the wellness exec',
    'Oat milk. No \u2014 almond. No \u2014 oat.','\u201CIs this decaf?\u201D (it is) \u201CTastes off.\u201D',
    'Coffee for 12. They said 4. It\u2019s 12.','Decaf for the exec who\u2019s had four already'];
  const FOLLOW=['caffeinated and confident \u2014 HDMI won\u2019t connect','sipped the latte, broke the projector',
    'one flat white later, Teams audio is gone','coffee in hand, clicker stopped working'];
  const CONFIGS=['Theatre','Classroom','U-shape','Cabaret','Boardroom','Hollow Square','Banquet rounds'];
  const RC=[c=>`flip the hall to ${c} \u2014 guests arrive in 5`,c=>`client wants ${c} now (we JUST set up)`,
    c=>`change to ${c} \u2014 mid-session, room is full`,c=>`reset to ${c}, keynote overran next door`];
  const RC_AGAIN=[c=>`changed their mind \u2014 back to ${c}`,c=>`actually... make it ${c}. Final answer (it won\u2019t be)`,
    c=>`the other partner prefers ${c}. Of course`];

  // ── tuning ──
  const DAY=120000, BOSS_START=80, BOSS_HIT=9, BOSS_FIX=5, RESOLVE=14, DISPATCH=1500, RECON_DISP=2400;

  // ── state ──
  let state='idle', dayTime, score, boss, best=+(localStorage.getItem('fo2_best')||0);
  let faults={}, dispatch=null, eventFeed=100, eventRecon=null, spawnT, reconT, raf, last;
  const els={clock:0};
  ['clock','score','best','boss','bosspct'].forEach(id=>els[id]=document.getElementById('fo2-'+id));
  els.best.textContent=best;

  function log(msg,cls){ const l=document.getElementById('fo2-log');
    l.innerHTML=`<div class="${cls||''}">floor_ops: ${msg}</div>`+l.innerHTML; }
  function clockStr(){ const h9=9+Math.floor(dayTime/DAY*8); const m=Math.floor((dayTime/DAY*8%1)*60);
    const ap=h9>=12?'PM':'AM'; let h=h9>12?h9-12:h9; return `${h}:${String(m).padStart(2,'0')} ${ap}`; }
  function setBoss(v){ boss=Math.max(0,Math.min(100,v)); els.boss.style.width=boss+'%';
    els.bosspct.textContent=Math.round(boss)+'%';
    els.boss.style.background=boss>50?'#22C55E':boss>25?'#EAB308':'#ef4444'; }

  function start(){
    state='playing'; dayTime=0; score=0; faults={}; dispatch=null; eventFeed=100; eventRecon=null;
    spawnT=2400; reconT=15000; setBoss(BOSS_START); els.score.textContent=0;
    document.getElementById('fo2-start').classList.add('hidden');
    document.getElementById('fo2-over').classList.add('hidden');
    last=performance.now(); raf=requestAnimationFrame(frame);
  }
  function end(win){ state='over'; cancelAnimationFrame(raf);
    if(score>best){ best=score; localStorage.setItem('fo2_best',best); els.best.textContent=best; }
    document.getElementById('fo2-verdict').textContent = win?'5 PM \u2014 you made it':'The boss snapped';
    document.getElementById('fo2-result').textContent = `Score ${score}. ${win?'Boss still (mostly) smiling.':'Mood hit zero.'}`;
    document.getElementById('fo2-over').classList.remove('hidden');
  }

  function spawnFault(){
    const free=FAULTABLE.filter(id=>!faults[id] && (!dispatch||dispatch.id!==id));
    if(!free.length) return;
    const id=free[Math.floor(Math.random()*free.length)], p=dayTime/DAY;
    const max=8500-p*3300, hosp=Math.random()<0.45;
    const type=hosp?HOSP[Math.floor(Math.random()*HOSP.length)]:AV[Math.floor(Math.random()*AV.length)];
    faults[id]={type,t:max,max,kind:hosp?'hosp':'av'};
    log(`${hosp?'<span class="err">[ORDER]</span>':'<span class="err">[BROKE]</span>'} ${ROOMS[id].label} &mdash; ${type}`,hosp?'':'err');
  }
  function followUp(id){ if(state!=='playing'||faults[id]||(dispatch&&dispatch.id===id)) return;
    const p=dayTime/DAY,max=8500-p*3300,f=FOLLOW[Math.floor(Math.random()*FOLLOW.length)];
    faults[id]={type:f,t:max,max,kind:'av'}; log(`<span class="err">[BROKE]</span> ${ROOMS[id].label} &mdash; ${f}`,'err'); }
  function spawnRecon(again,cfg){ if(state!=='playing'||eventRecon||(dispatch&&dispatch.id==='event')) return;
    const config=cfg||CONFIGS[Math.floor(Math.random()*CONFIGS.length)];
    const fn=again?RC_AGAIN[Math.floor(Math.random()*RC_AGAIN.length)]:RC[Math.floor(Math.random()*RC.length)];
    const type=fn(config),p=dayTime/DAY,max=10000-p*2500;
    eventRecon={config,type,t:max,max}; log(`<span class="vio">[RECONFIG]</span> LIVE EVENT HALL &mdash; ${type}`,'vio'); }

  function dist(ax,ay,bx,by){ return Math.hypot(bx-ax,by-ay); }
  function onTap(ix,iy){
    if(state!=='playing'||dispatch) return;
    // event hall first
    const e=ROOMS.event;
    if(ix>=e.x&&ix<=e.x+e.w&&iy>=e.y&&iy<=e.y+e.h){
      if(eventRecon){ const config=eventRecon.config; eventRecon=null;
        dispatch={id:'event',kind:'reconfig',config,t:RECON_DISP,max:RECON_DISP}; }
      else { dispatch={id:'event',kind:'feed',t:DISPATCH,max:DISPATCH}; }
      return;
    }
    for(const id of FAULTABLE){ const r=ROOMS[id];
      if(ix>=r.x&&ix<=r.x+r.w&&iy>=r.y&&iy<=r.y+r.h && faults[id]){
        dispatch={id,kind:faults[id].kind,t:DISPATCH,max:DISPATCH}; delete faults[id]; return; } }
  }

  function update(dt){
    dayTime+=dt; els.clock.textContent=clockStr();
    // fault timers
    for(const id in faults){ faults[id].t-=dt;
      if(faults[id].t<=0){ const k=faults[id].kind; delete faults[id]; setBoss(boss-BOSS_HIT);
        log(`<span class="err">[GRR]</span> ${ROOMS[id].label} ${k==='hosp'?'still waiting':'left broken'} \u2014 boss noticed`,'err');
        if(boss<=0) return end(false); } }
    // event feed decay + reconfig timer
    eventFeed=Math.max(0,eventFeed-dt*0.0026*(1+dayTime/DAY));
    if(eventFeed<=0){ eventFeed=35; setBoss(boss-BOSS_HIT); log('<span class="err">[FEED]</span> live feed dropped! \u2014 boss noticed','err'); if(boss<=0) return end(false); }
    if(eventRecon && !(dispatch&&dispatch.id==='event')){ eventRecon.t-=dt;
      if(eventRecon.t<=0){ eventRecon=null; setBoss(boss-BOSS_HIT);
        log('<span class="err">[GRR]</span> hall never got flipped \u2014 wrong layout at start','err'); if(boss<=0) return end(false); } }
    // dispatch (fixer travel+work)
    if(dispatch){ dispatch.t-=dt;
      if(dispatch.t<=0){
        const id=dispatch.id, kind=dispatch.kind;
        if(kind==='feed'){ eventFeed=Math.min(100,eventFeed+30); score+=12; setBoss(boss+4);
          log('<span class="ok">live feed saved</span> \u2014 nice','ok'); }
        else if(kind==='reconfig'){ score+=22; setBoss(boss+8);
          log(`<span class="vio">[FLIPPED]</span> hall reset to ${dispatch.config}. For now.`,'vio');
          if(Math.random()<0.35){ const nc=CONFIGS.filter(c=>c!==dispatch.config)[Math.floor(Math.random()*(CONFIGS.length-1))];
            setTimeout(()=>spawnRecon(true,nc),1800+Math.random()*2200); } }
        else { score+=RESOLVE; setBoss(boss+BOSS_FIX);
          log(`${kind==='hosp'?'<span class="ok">[SERVED]</span>':'<span class="ok">[FIXED]</span>'} ${ROOMS[id].label}`,'ok');
          if(kind==='hosp'&&Math.random()<0.5){ const rid=id; setTimeout(()=>followUp(rid),1200+Math.random()*1500); } }
        els.score.textContent=score; dispatch=null;
      }
    }
    // spawners
    const p=dayTime/DAY;
    spawnT-=dt; if(spawnT<=0){ spawnFault(); spawnT=(4600-p*2950)*(0.82+Math.random()*0.36); }
    reconT-=dt; if(reconT<=0){ if(!eventRecon) spawnRecon(false); reconT=24000+Math.random()*14000; }
    if(dayTime>=DAY) return end(true);
  }

  function shade(hex,d){ const n=parseInt(hex.slice(1),16); let r=(n>>16)+d,g=((n>>8)&255)+d,b=(n&255)+d;
    r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));
    return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1); }
  function drawPerson(x,y,shirt,bob){ const yo=bob||0;
    ctx.fillStyle='rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(x,y+5,4.5,2.5,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=shirt; ctx.strokeStyle=shade(shirt,-40); ctx.lineWidth=1;
    roundRect(x-3.5,y-9-yo,7,11,2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.fillStyle='#c98a5e'; ctx.arc(x,y-12-yo,3.6,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.fillStyle='#2a2118'; ctx.arc(x,y-13.2-yo,3.6,Math.PI,2*Math.PI); ctx.fill(); }

  function roundRect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
  function roomTint(r,col,a){ ctx.save(); ctx.globalAlpha=a; ctx.fillStyle=col;
    roundRect(r.x,r.y,r.w,r.h,6); ctx.fill(); ctx.restore(); }
  function wrapLines(txt, maxW){
    const words=txt.split(' '), lines=[]; let cur='';
    for(const wd of words){ const test=cur?cur+' '+wd:wd;
      if(ctx.measureText(test).width<=maxW || !cur){ cur=test; } else { lines.push(cur); cur=wd; } }
    if(cur) lines.push(cur);
    if(lines.length>2){ lines[1]=lines.slice(1).join(' '); lines.length=2;   // cap at 2 lines
      while(lines[1] && ctx.measureText(lines[1]+'\u2026').width>maxW && lines[1].length>1) lines[1]=lines[1].slice(0,-1);
      lines[1]=lines[1].replace(/\s+$/,'')+'\u2026'; }
    return lines;
  }
  function ticketText(r,txt,col,atTop){
    const maxW=r.w-16; let fs=11;
    ctx.font=fs+'px ui-monospace,monospace';
    let lines=wrapLines(txt,maxW);
    while(lines.length>2 && fs>8){ fs--; ctx.font=fs+'px ui-monospace,monospace'; lines=wrapLines(txt,maxW); }
    const lh=fs+3, boxH=lines.length*lh+6, boxW=Math.min(maxW+12, r.w-6);
    const x=r.cx, y=atTop ? r.y+8 : r.y+r.h-6-boxH;
    ctx.fillStyle='rgba(6,8,7,.85)'; roundRect(x-boxW/2,y,boxW,boxH,4); ctx.fill();
    ctx.fillStyle=col; ctx.textAlign='center'; ctx.textBaseline='middle';
    lines.forEach((ln,i)=> ctx.fillText(ln, x, y+6+i*lh+lh/2-2));
  }
  function ring(cx,cy,frac,col){ ctx.strokeStyle='rgba(0,0,0,.4)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(cx,cy,9,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle=col; ctx.beginPath(); ctx.arc(cx,cy,9,-Math.PI/2,-Math.PI/2+frac*Math.PI*2); ctx.stroke(); }
  function marker(cx,cy,col,t){ const pulse=0.5+0.5*Math.sin(t/300); const y=cy-4*Math.sin(t/400);
    ctx.save(); ctx.globalAlpha=0.5+0.4*pulse; ctx.fillStyle=col;
    ctx.beginPath(); ctx.moveTo(cx,y-9);ctx.lineTo(cx+7,y);ctx.lineTo(cx,y+9);ctx.lineTo(cx-7,y);ctx.closePath();ctx.fill();
    ctx.restore(); ctx.fillStyle='#0a0c0b'; ctx.font='bold 11px ui-monospace,monospace';
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('!',cx,y); }

  function fixerPos(){
    if(!dispatch) return null;
    const r=ROOMS[dispatch.id]; const prog=1-dispatch.t/dispatch.max; const tp=Math.min(prog/0.65,1);
    // path: BASE -> (room.cx, HALLY) -> (room.cx, room.cy)
    const wx=r.cx, wy=HALLY;
    let x,y;
    if(tp<0.5){ const k=tp/0.5; x=BASE.x+(wx-BASE.x)*k; y=BASE.y+(wy-BASE.y)*k; }
    else { const k=(tp-0.5)/0.5; x=wx+(r.cx-wx)*k; y=wy+(r.cy-wy)*k; }
    return {x,y,working:prog>=0.65};
  }

  function render(t){
    ctx.clearRect(0,0,IW,IH);
    if(img.complete) ctx.drawImage(img,0,0,IW,IH);
    // seated people (ambient) + walk-ins
    SEATS.forEach(s=>drawPerson(s.x,s.y,s.shirt,0));
    walkers.forEach(w=>{ if(w.wait>0) return; const a=w.path[w.seg], b=w.path[w.seg+1]; if(!b) return;
      const x=a.x+(b.x-a.x)*w.p, y=a.y+(b.y-a.y)*w.p, bob=Math.abs(Math.sin(t/120+w.bob))*1.4;
      drawPerson(x,y,w.shirt,bob); });
    // room overlays
    for(const id of FAULTABLE){ const r=ROOMS[id], f=faults[id];
      if(dispatch&&dispatch.id===id){ roomTint(r,'#22C55E',0.18); }
      else if(f){ const col=f.kind==='hosp'?'#EAB308':'#ef4444';
        const a=0.14+0.10*(0.5+0.5*Math.sin(t/300)); roomTint(r,col,a);
        ticketText(r,(f.kind==='hosp'?'\u2615 ':'')+f.type, f.kind==='hosp'?'#f5d97a':'#ffb4ab');
        ring(r.x+r.w-16,r.y+16,f.t/f.max,col); marker(r.cx,r.y+24,col,t); } }
    // event hall
    const e=ROOMS.event;
    if(dispatch&&dispatch.id==='event'){ roomTint(e,dispatch.kind==='reconfig'?'#a855f7':'#22C55E',0.16); }
    else if(eventRecon){ roomTint(e,'#a855f7',0.14+0.10*(0.5+0.5*Math.sin(t/300)));
      ticketText(e,'\uD83E\uDE91 '+eventRecon.type,'#e9d5ff',true); ring(e.x+e.w-18,e.y+18,eventRecon.t/eventRecon.max,'#c084fc');
      marker(e.cx,e.y+26,'#a855f7',t); }
    // event feed bar
    ctx.fillStyle='rgba(6,8,7,.7)'; roundRect(e.x+12,e.y+e.h-16,e.w-24,8,3); ctx.fill();
    ctx.fillStyle=eventFeed>50?'#3b82f6':eventFeed>25?'#EAB308':'#ef4444';
    roundRect(e.x+12,e.y+e.h-16,(e.w-24)*eventFeed/100,8,3); ctx.fill();
    // fixer
    const fp=fixerPos();
    if(fp){ ctx.fillStyle='#22C55E'; ctx.strokeStyle='#0a3a1f'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.ellipse(fp.x,fp.y+6,5,3,0,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,.3)'; ctx.fill();
      ctx.fillStyle='#22C55E'; roundRect(fp.x-4,fp.y-10,8,12,2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.fillStyle='#c98a5e'; ctx.arc(fp.x,fp.y-13,4,0,Math.PI*2); ctx.fill(); }
  }

  function frame(t){
    const dt=Math.min(t-last,60); last=t;
    if(state==='playing'){ update(dt); }
    updateWalkers(dt);
    render(t);
    if(state==='playing'||state==='idle') raf=requestAnimationFrame(frame);
  }

  // input
  function evToImg(e){ const rect=cv.getBoundingClientRect();
    const p=e.touches?e.touches[0]:e; return {x:(p.clientX-rect.left)/scaleF, y:(p.clientY-rect.top)/scaleF}; }
  cv.addEventListener('click',e=>{ const q=evToImg(e); onTap(q.x,q.y); });
  cv.addEventListener('touchstart',e=>{ const q=evToImg(e); onTap(q.x,q.y); if(e.cancelable)e.preventDefault(); },{passive:false});
  document.getElementById('fo2-startBtn').addEventListener('click',start);
  document.getElementById('fo2-againBtn').addEventListener('click',start);
  window.addEventListener('resize',resize);

  img.onload=()=>{ resize(); raf=requestAnimationFrame(frame); };
  img.onerror=()=>{ resize(); raf=requestAnimationFrame(frame); };
  img.src=IMG_SRC;
})();
