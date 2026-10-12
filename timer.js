/* Study timer: Pomodoro, countdown timer and stopwatch in one floating panel.
   State lives in localStorage with absolute end times, so a running timer
   keeps going when you switch pages or reload. */
(function(){
  const KEY="bunpou-timer-v1";
  const PHASES={focus:{jp:"集中",en:"Focus"},short:{jp:"小休憩",en:"Short break"},long:{jp:"長休憩",en:"Long break"}};
  const def={open:false,tab:"pomo",
    pomo:{phase:"focus",count:0,running:false,endAt:0,left:25*60,focus:25,short:5,long:15,every:4},
    timer:{dur:10*60,running:false,endAt:0,left:10*60},
    sw:{running:false,startAt:0,acc:0,laps:[]}};
  let S;
  try{S=Object.assign(structuredClone(def),JSON.parse(localStorage.getItem(KEY)||"{}"));
      for(const k of ["pomo","timer","sw"]) S[k]=Object.assign(structuredClone(def[k]),S[k]||{});}
  catch(e){S=structuredClone(def)}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
  const now=()=>Date.now();
  const fmt=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;
    return (h?h+":"+String(m).padStart(2,"0"):String(m).padStart(2,"0"))+":"+String(x).padStart(2,"0")};
  const fmtMs=ms=>{const t=Math.floor(ms/100);const d=t%10,s=Math.floor(t/10);return fmt(s)+"."+d};
  const pomoLeft=()=>S.pomo.running?(S.pomo.endAt-now())/1000:S.pomo.left;
  const timerLeft=()=>S.timer.running?(S.timer.endAt-now())/1000:S.timer.left;
  const swElapsed=()=>S.sw.acc+(S.sw.running?now()-S.sw.startAt:0);

  // chime: three soft tones (WebAudio; allowed after the user pressed Start)
  let ctx;
  function chime(){
    try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      [0,0.35,0.7].forEach((t,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();
        o.type="sine";o.frequency.value=[880,660,880][i];o.connect(g);g.connect(ctx.destination);
        const st=ctx.currentTime+t;g.gain.setValueAtTime(0.0001,st);g.gain.exponentialRampToValueAtTime(0.25,st+0.02);
        g.gain.exponentialRampToValueAtTime(0.0001,st+0.3);o.start(st);o.stop(st+0.32);});
    }catch(e){}
  }

  // ---------- DOM ----------
  const btn=document.createElement("button");
  btn.className="tmr-btn";btn.type="button";btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-controls","tmr-panel");
  btn.innerHTML='<span>タイマー</span><span class="t"></span>';
  const panel=document.createElement("div");
  panel.className="tmr-panel";panel.id="tmr-panel";panel.setAttribute("role","dialog");panel.setAttribute("aria-label","Study timer");panel.hidden=true;
  panel.innerHTML=`
  <div class="tmr-tabs" role="tablist">
    <button role="tab" data-t="pomo" id="tmr-t-pomo">ポモドーロ</button>
    <button role="tab" data-t="timer" id="tmr-t-timer">タイマー</button>
    <button role="tab" data-t="sw" id="tmr-t-sw">ストップウォッチ</button>
  </div>
  <div class="tmr-body" data-p="pomo">
    <div class="tmr-phase"><span id="tmr-ph">集中</span><small id="tmr-phen">Focus</small></div>
    <div class="tmr-time" id="tmr-pt">25:00</div>
    <div class="tmr-dots" id="tmr-dots" aria-label="Focus sessions in this round"></div>
    <div class="tmr-row"><button class="main" id="tmr-pgo">Start</button><button id="tmr-pskip">Skip</button><button id="tmr-preset">Reset</button></div>
    <div class="tmr-set">
      <label>Focus · min<input type="number" id="tmr-sf" min="1" max="180"></label>
      <label>Short · min<input type="number" id="tmr-ss" min="1" max="60"></label>
      <label>Long · min<input type="number" id="tmr-sl" min="1" max="90"></label>
    </div>
  </div>
  <div class="tmr-body" data-p="timer" hidden>
    <div class="tmr-phase"><span>タイマー</span><small>Countdown</small></div>
    <div class="tmr-time" id="tmr-tt">10:00</div>
    <div class="tmr-row" id="tmr-pres">
      <button class="pre" data-m="5">5</button><button class="pre" data-m="10">10</button><button class="pre" data-m="15">15</button>
      <button class="pre" data-m="30">30</button><button class="pre" data-m="45">45</button><button class="pre" data-m="60">60</button>
    </div>
    <div class="tmr-row"><label>Custom<input type="number" id="tmr-tc" min="1" max="600" placeholder="min"></label></div>
    <div class="tmr-row"><button class="main" id="tmr-tgo">Start</button><button id="tmr-treset">Reset</button></div>
  </div>
  <div class="tmr-body" data-p="sw" hidden>
    <div class="tmr-phase"><span>ストップウォッチ</span><small>Stopwatch</small></div>
    <div class="tmr-time" id="tmr-st">00:00.0</div>
    <div class="tmr-row"><button class="main" id="tmr-sgo">Start</button><button id="tmr-slap">Lap</button><button id="tmr-sreset">Reset</button></div>
    <ul class="tmr-laps" id="tmr-laps"></ul>
  </div>`;
  document.body.append(panel,btn);
  const $=id=>panel.querySelector("#"+id);
  const setHTML=(el,h)=>{if(el._h!==h){el.innerHTML=h;el._h=h}};
  const setText=(el,t)=>{if(el.textContent!==t)el.textContent=t};

  // ---------- Pomodoro ----------
  function pomoLen(ph){return (ph==="focus"?S.pomo.focus:ph==="short"?S.pomo.short:S.pomo.long)*60}
  function pomoNext(){
    if(S.pomo.phase==="focus"){S.pomo.count++; S.pomo.phase=(S.pomo.count%S.pomo.every===0)?"long":"short";}
    else{ if(S.pomo.phase==="long") S.pomo.count=0; S.pomo.phase="focus"; }
    S.pomo.running=false; S.pomo.left=pomoLen(S.pomo.phase);
  }
  $("tmr-pgo").onclick=()=>{const p=S.pomo; if(p.running){p.left=pomoLeft();p.running=false}else{p.endAt=now()+p.left*1000;p.running=true;chimePrime()} save();draw()};
  $("tmr-pskip").onclick=()=>{pomoNext();save();draw()};
  $("tmr-preset").onclick=()=>{S.pomo.running=false;S.pomo.phase="focus";S.pomo.count=0;S.pomo.left=pomoLen("focus");save();draw()};
  [["tmr-sf","focus"],["tmr-ss","short"],["tmr-sl","long"]].forEach(([id,k])=>{
    const el=$(id); el.value=S.pomo[k];
    el.addEventListener("change",()=>{const v=Math.min(+el.max,Math.max(1,parseInt(el.value)||S.pomo[k])); el.value=v; S.pomo[k]=v;
      if(!S.pomo.running&&S.pomo.phase===k) S.pomo.left=v*60; save();draw();});
  });

  // ---------- Countdown ----------
  function setTimer(min){S.timer.running=false;S.timer.dur=min*60;S.timer.left=min*60;save();draw()}
  $("tmr-pres").addEventListener("click",e=>{const b=e.target.closest("[data-m]");if(b){$("tmr-tc").value="";setTimer(+b.dataset.m)}});
  $("tmr-tc").addEventListener("change",e=>{const v=parseInt(e.target.value);if(v>0)setTimer(Math.min(600,v))});
  $("tmr-tgo").onclick=()=>{const t=S.timer; if(t.running){t.left=timerLeft();t.running=false}else{if(t.left<=0)t.left=t.dur;t.endAt=now()+t.left*1000;t.running=true;chimePrime()} save();draw()};
  $("tmr-treset").onclick=()=>{S.timer.running=false;S.timer.left=S.timer.dur;save();draw()};

  // ---------- Stopwatch ----------
  $("tmr-sgo").onclick=()=>{const w=S.sw; if(w.running){w.acc=swElapsed();w.running=false}else{w.startAt=now();w.running=true} save();draw()};
  $("tmr-slap").onclick=()=>{if(!S.sw.running&&!S.sw.acc)return;S.sw.laps.unshift(swElapsed());S.sw.laps=S.sw.laps.slice(0,50);save();draw()};
  $("tmr-sreset").onclick=()=>{S.sw={running:false,startAt:0,acc:0,laps:[]};save();draw()};

  // unlock audio on the first Start so the end chime can play later
  function chimePrime(){try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();ctx.resume&&ctx.resume()}catch(e){}}

  // ---------- open / tabs ----------
  function setOpen(o){S.open=o;panel.hidden=!o;btn.setAttribute("aria-expanded",String(o));save()}
  btn.onclick=()=>setOpen(!S.open);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&S.open){setOpen(false);btn.focus()}});
  panel.querySelector(".tmr-tabs").addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(b){S.tab=b.dataset.t;save();draw()}});

  // ---------- render loop ----------
  const baseTitle=document.title;
  function draw(){
    // finished?
    if(S.pomo.running&&pomoLeft()<=0){chime();pomoNext();save()}
    if(S.timer.running&&timerLeft()<=0){chime();S.timer.running=false;S.timer.left=0;save()}

    panel.querySelectorAll(".tmr-tabs [data-t]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.t===S.tab)));
    panel.querySelectorAll(".tmr-body").forEach(p=>p.hidden=p.dataset.p!==S.tab);

    const ph=PHASES[S.pomo.phase];
    $("tmr-ph").textContent=ph.jp; $("tmr-phen").textContent=ph.en;
    $("tmr-pt").textContent=fmt(pomoLeft());
    $("tmr-pgo").textContent=S.pomo.running?"Pause":"Start";
    const done=S.pomo.count%S.pomo.every||(S.pomo.phase==="long"?S.pomo.every:0);
    setHTML($("tmr-dots"),Array.from({length:S.pomo.every},(_,i)=>`<i class="${i<done?"on":""}"></i>`).join(""));

    $("tmr-tt").textContent=fmt(timerLeft());
    $("tmr-tgo").textContent=S.timer.running?"Pause":(S.timer.left>0&&S.timer.left<S.timer.dur?"Resume":"Start");
    panel.querySelectorAll("#tmr-pres [data-m]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.m*60===S.timer.dur)));

    $("tmr-st").textContent=fmtMs(swElapsed());
    $("tmr-sgo").textContent=S.sw.running?"Pause":(S.sw.acc?"Resume":"Start");
    setHTML($("tmr-laps"),S.sw.laps.map((l,i)=>`<li><span>Lap ${S.sw.laps.length-i}</span><span>${fmtMs(l)}</span></li>`).join(""));

    // badge on the floating button + tab title: whichever is running
    let badge="";
    if(S.pomo.running) badge=fmt(pomoLeft());
    else if(S.timer.running) badge=fmt(timerLeft());
    else if(S.sw.running) badge=fmt(swElapsed()/1000);
    btn.querySelector(".t").textContent=badge;
    document.title=badge?`${badge} · ${baseTitle}`:baseTitle;
  }
  setOpen(!!S.open);
  draw();
  setInterval(draw,200);
})();
