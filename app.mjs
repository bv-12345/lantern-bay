import {quantities,bonds,stories,labels} from './content.mjs';
import {create,count,task,length,toggle,adjust,check,equation} from './model.mjs';
const main=document.querySelector('#main');
let state=create(), screen='home', scaffold='together', feedback='', hintLevel=0, muted=true;
const completed=new Set(), demonstrated=new Set();
let demo=null;
const modeList=['build','bonds','stories','final'];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function speech(text,explicit=false){
  if(muted&&!explicit)return;
  if(!('speechSynthesis' in window))return;
  const voice=window.speechSynthesis.getVoices().find(v=>v.localService&&v.lang.startsWith('en'));
  if(!voice)return; // No remote voices: all essential prompts remain visible.
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.voice=voice;utterance.rate=.85;
  window.speechSynthesis.speak(utterance);
}
function status(text,good=false){
  feedback=text;
  const el=document.querySelector('#feedback');
  if(el){el.className='feedback'+(good?' good':'');el.textContent=text;}
  speech(text);
}
function harbor(){return `<div class="bay-art" role="img" aria-label="A quiet bay with a lighthouse and glowing lanterns"><svg viewBox="0 0 440 460" aria-hidden="true"><circle cx="331" cy="103" r="42" fill="#f2be5c"/><path d="M0 277 Q105 218 215 272 T440 259 V460 H0Z" fill="#8db2a4"/><path d="M0 332 Q105 273 220 320 T440 308 V460 H0Z" fill="#467f78"/><path d="M0 385 Q90 327 218 372 T440 368 V460 H0Z" fill="#245b59"/><path d="M79 324 L106 147 L154 147 L181 324Z" fill="#fff9e9"/><path d="M96 207 H164 L170 245 H90Z" fill="#b85d39"/><path d="M106 147 V120 H154 V147" fill="#254d49"/><path d="M95 121 L130 89 L165 121Z" fill="#b85d39"/><rect x="118" y="127" width="24" height="20" rx="2" fill="#f2be5c"/><path d="M124 324 V288 Q130 276 137 288 V324" fill="#254d49"/><path d="M72 324 H188" stroke="#173f40" stroke-width="8" stroke-linecap="round"/><path d="M220 292 Q285 257 370 276" stroke="#173f40" stroke-width="3" fill="none"/><path d="M237 286 V310 M278 274 V296 M320 271 V294 M355 274 V300" stroke="#173f40" stroke-width="3"/><g fill="#f2be5c" stroke="#765520" stroke-width="2"><rect x="226" y="306" width="22" height="30" rx="9"/><rect x="267" y="292" width="22" height="30" rx="9"/><rect x="309" y="290" width="22" height="30" rx="9"/><rect x="344" y="296" width="22" height="30" rx="9"/></g><path d="M279 172 q12 -12 24 0 M304 155 q12 -12 24 0" fill="none" stroke="#315a54" stroke-width="3" stroke-linecap="round"/><path d="M203 352 H247 M303 363 H359 M93 396 H147" stroke="#b9d1ba" stroke-width="3" stroke-linecap="round"/></svg><div class="art-label">SMALL LIGHTS. BIG DISCOVERIES.</div></div>`;}
function home(){
  main.innerHTML=`<section class="hero"><div><p class="eyebrow">A little number adventure · about ages 5–7</p><h1>Every light<br>has a <em>place.</em></h1><p class="intro">Come down to Lantern Bay.<br>Count a little. Make ten.<br>See what happens next.</p><button class="primary" id="start">Let's explore <span aria-hidden="true">↗</span></button><p class="tiny">8–12 unhurried minutes. A grown-up can join in.</p></div>${harbor()}</section><section class="route" aria-label="Our three stops"><article><span class="number">01</span><div><h2>Fill a frame</h2><p>A place for every light.<br>Even zero belongs here.</p></div></article><article><span class="number">02</span><div><h2>Make ten</h2><p>Two little groups.<br>One whole frame.</p></div></article><article><span class="number">03</span><div><h2>Picture stories</h2><p>Some arrive. Some leave.<br>Find out how many stay.</p></div></article></section>`;
  document.querySelector('#start').onclick=()=>enter(state.mode,state.index);
}
function enter(mode,index=0){
  state=create(mode,index);screen='lesson';feedback='';hintLevel=0;
  demo=!demonstrated.has(mode)&&mode!=='final'?mode:null;
  render();focusHeading();
}
function focusHeading(){const h=document.querySelector('#activity-title');if(h){h.tabIndex=-1;h.focus();}}
function hint(){
  hintLevel++;
  const t=task(state.mode,state.index),n=count(state.slots);
  if(state.mode==='bonds'||state.mode==='final'&&state.index===0){
    status(hintLevel===1?'Try counting the empty spaces. Each one needs one light.':`There are ${10-n} empty spaces now. Add one light to each empty space.`);
  }else if(state.mode==='stories'||state.mode==='final'){
    const subtract=state.mode==='final'||t.op==='−';
    status(hintLevel===1?(subtract?'Start with the first group. Take away one object at a time. Count what stays.':'Start with the first group. Add the new objects one at a time. Count the whole group.'):`Start with ${t.initial}. ${subtract?'Take away':'Add'} ${state.mode==='final'?2:t.b}. Count each object once.`);
  }else{
    status(t.target===0?'Zero means no lights. Leave all ten spaces empty.':hintLevel===1?'Touch each light once as you count. Compare your count with the target.':`The target is ${t.target}. You have ${n}. ${n<t.target?'Add a light, then count again.':'Take away a light, then count again.'}`);
  }
}
function demoHtml(){
  if(!demo)return '';
  const examples={build:['Watch a little example','To show two, put one light in each of two spaces. Count: one, two.','● ●','2 lights'],bonds:['Watch two parts make ten','There are four round lights. Add six star lights. The whole group is ten.','● ● ● ● ✦ ✦ ✦ ✦ ✦ ✦','4 + 6 = 10'],stories:['Watch a picture story','Two lights are here. One more arrives. Count them all: one, two, three.','● ● + ✦','2 + 1 = 3']};
  const [title,text,lights,eq]=examples[demo];
  return `<aside class="demo" aria-label="Demonstration"><h2>${title}</h2><p>${text}</p><div class="demo-lights" aria-hidden="true">${lights}</div><p><strong>${eq}</strong></p><button id="demo-done">Now I try</button></aside>`;
}
function render(){
  if(screen==='home'){home();return;}
  if(screen==='summary'){summary();return;}
  const t=task(state.mode,state.index),n=count(state.slots);
  const locked=state.mode==='bonds'||state.mode==='final'&&state.index===0;
  const done=[...completed].filter(k=>k.startsWith(state.mode+':')).length;
  const preserve=document.activeElement?.id;
  main.innerHTML=`<section class="lesson"><div class="lesson-top"><p class="eyebrow">Our number adventure</p><button id="exit" class="small">Leave activity</button></div><nav class="lesson-nav" aria-label="Activity navigation">${modeList.map((mode,i)=>`<button id="nav-${mode}" ${mode===state.mode?'aria-current="step"':''}>${i+1}. ${labels[mode]}</button>`).join('')}</nav><div class="workspace"><section class="instruction"><span class="badge">${state.mode==='final'?'Your own new story':'Try it your way'} · ${state.index+1} of ${length(state.mode)}</span><h1 id="activity-title">${escape(t.title)}</h1><p class="prompt">${escape(t.prompt)}</p>${state.mode==='stories'?`<div class="picture-strip" role="img" aria-label="Your picture model: ${n} ${t.object}">${n?Array.from({length:n},()=>`<span aria-hidden="true">${t.icon}</span>`).join(''):'<span>0 · empty</span>'}</div><p class="tiny">Your picture: ${n} ${t.object}.<br>Each light stands for one ${t.object.replace(/s$/, '')}.</p>`:''}<p class="tiny">Tap any ${locked?'empty ':''}space. Or use +1 and −1.</p><div class="support"><label for="scaffold">Choose your help</label><select id="scaffold"><option value="together" ${scaffold==='together'?'selected':''}>Count together</option><option value="explore" ${scaffold==='explore'?'selected':''}>Explore</option></select><button id="hint">Give me a hint</button><button id="replay-demo">Show an example</button></div></section><section class="board" aria-label="Ten-frame workspace">${demoHtml()}<div class="board-header"><h2>One space. One light.</h2>${state.mode==='build'?`<div class="target">Target <b>${t.target}</b></div>`:'<div class="target">Ten spaces</div>'}</div><div class="frame" role="group" aria-label="Ten-frame, two rows of five spaces">${state.slots.map((value,i)=>`<button id="slot-${i}" class="slot ${locked&&i<t.initial?'locked':''}" type="button" aria-label="Space ${i+1}, ${value?(value===1?'starting light':'added light'):'empty'}${locked&&i<t.initial?', fixed starting group':''}" aria-pressed="${!!value}" ${locked&&i<t.initial?'aria-disabled="true"':''}>${value?`<span aria-hidden="true" class="counter ${value===1?'original':''}">${value===1?'●':'✦'}</span>`:`<span class="slot-number" aria-hidden="true">${scaffold==='together'?i+1:'·'}</span>`}</button>`).join('')}</div><div class="legend"><span><i aria-hidden="true">●</i> Starting lights</span><span><i aria-hidden="true">✦</i> Your lights</span></div><p class="quantity" id="quantity">${n===0?'0 lights · all ten spaces are empty':`${n} ${n===1?'light':'lights'} · ${10-n} empty ${10-n===1?'space':'spaces'}`}</p><div class="adjust"><button id="minus" aria-label="Take away one light">−1</button><button id="plus" aria-label="Add one light">+1</button></div>${locked||state.solved?`<p class="equation" aria-label="${escape(equation(state))}">${escape(equation(state))}</p>`:''}<div id="feedback" class="feedback${state.solved?' good':''}" role="status" aria-live="polite">${escape(feedback||'Take your time. Try, change, and count again.')}</div><div class="board-actions"><button id="retry">Reset this try</button><button id="check" class="primary">Check my lights</button>${state.solved?'<button id="next" class="primary">'+(state.mode==='final'&&state.index===1?'See my journey':'Next stop')+' →</button>':''}</div></section></div><div class="progress-row"><progress max="${length(state.mode)}" value="${done}" aria-label="Activities explored in this stop"></progress><span>${done} of ${length(state.mode)} explored here</span></div></section>`;
  modeList.forEach(mode=>document.querySelector('#nav-'+mode).onclick=()=>enter(mode));
  document.querySelector('#exit').onclick=()=>{screen='home';demo=null;render();document.querySelector('#start').focus();};
  document.querySelector('#scaffold').onchange=e=>{scaffold=e.target.value;render();};
  document.querySelector('#hint').onclick=hint;
  document.querySelector('#replay-demo').onclick=()=>{demo=state.mode==='final'?'bonds':state.mode;render();document.querySelector('#demo-done').focus();};
  if(demo)document.querySelector('#demo-done').onclick=()=>{demonstrated.add(state.mode);demo=null;render();document.querySelector('#slot-0').focus();};
  function change(next){state=next;feedback='';render();}
  state.slots.forEach((_,i)=>document.querySelector('#slot-'+i).onclick=()=>change(toggle(state,i)));
  document.querySelector('#plus').onclick=()=>change(adjust(state,1));
  document.querySelector('#minus').onclick=()=>change(adjust(state,-1));
  document.querySelector('#retry').onclick=()=>{state=create(state.mode,state.index);feedback='A fresh try. You can change your lights as often as you like.';hintLevel=0;render();};
  document.querySelector('#check').onclick=()=>{
    if(check(state)){
      state.solved=true;completed.add(state.mode+':'+state.index);
      feedback=explanation();render();speech(feedback);document.querySelector('#next').focus();
    }else{
      const current=count(state.slots);
      const strategy=locked?'Count the empty spaces.':state.mode==='stories'||state.mode==='final'?'Read the story again. Show what arrives or leaves, then count what stays.':'Count each light once. Compare your count with the target.';
      status(`You have ${current} ${current===1?'light':'lights'}. Let's try another look. ${strategy}`);
    }
  };
  const next=document.querySelector('#next');
  if(next)next.onclick=()=>{
    if(state.index+1<length(state.mode))enter(state.mode,state.index+1);
    else if(state.mode==='final'){screen='summary';render();}
    else enter(modeList[modeList.indexOf(state.mode)+1]);
  };
  if(preserve&&document.getElementById(preserve))document.getElementById(preserve).focus({preventScroll:true});
}
function explanation(){
  const t=task(state.mode,state.index);
  if(state.mode==='build')return t.target===0?'Yes. Zero is a number too: no lights, and ten empty spaces.':`Yes. You made ${t.target}. Every light has its own space.`;
  if(state.mode==='bonds'||state.mode==='final'&&state.index===0)return `You made a whole ten! ${t.initial} starting lights and ${10-t.initial} added lights fill all ten spaces.`;
  if(state.mode==='final')return 'You made ten, then took away two. Eight lights stay: 10 − 2 = 8. You used two number ideas in one new story.';
  return t.op==='+'?`${t.a} and ${t.b} make ${t.target}. The whole group has ${t.target} ${t.object}.`:`Start with ${t.a}. Take away ${t.b}. ${t.target} ${t.object} ${t.target===1?'stays':'stay'}.`;
}
function summary(){
  const all=modeList.every(m=>[...Array(length(m)).keys()].every(i=>completed.has(m+':'+i)));
  main.innerHTML=`<section class="summary"><p class="eyebrow">Your Lantern Bay journey</p><h1>${all?'A whole bay of discoveries.':'Look what you explored.'}</h1><p>You used lights to show numbers, put parts together, and see what stays.</p><ul>${modeList.map(m=>`<li><strong>${labels[m]}</strong>: ${[...completed].filter(k=>k.startsWith(m+':')).length} of ${length(m)} explored.</li>`).join('')}</ul><p><strong>Try it away from the screen:</strong> Put ten buttons in two little groups. Can you find a different way to make ten?</p><p class="tiny">This is your activity record, not a test score. There is always room for another try.</p><div class="summary-actions"><button id="continue" class="primary">Explore again</button><button id="reset-all">Start a fresh journey</button><a href="guide.html" class="small">Grown-up guide</a></div></section>`;
  document.querySelector('#continue').onclick=()=>enter('build');
  document.querySelector('#reset-all').onclick=()=>{completed.clear();demonstrated.clear();state=create();screen='home';feedback='';hintLevel=0;render();};
  main.focus();
}
document.querySelector('#home').onclick=e=>{e.preventDefault();screen='home';demo=null;render();};
document.querySelector('#mute').onclick=()=>{
  muted=!muted;const btn=document.querySelector('#mute');btn.textContent=muted?'Sound off':'Sound on';btn.setAttribute('aria-pressed',String(muted));
  if(muted&&'speechSynthesis' in window)window.speechSynthesis.cancel();
  if(!muted&&!window.speechSynthesis?.getVoices().some(v=>v.localService&&v.lang.startsWith('en'))) {
    btn.textContent='Text mode';muted=true;btn.setAttribute('aria-pressed','true');
    if(screen==='lesson')status('A local reading voice is not available. All prompts are here to read together.');
  }
};
document.querySelector('#read').onclick=()=>{
  const text=screen==='lesson'?task(state.mode,state.index).prompt:'Come down to Lantern Bay. Count a little. Make ten. See what happens next.';
  const available=window.speechSynthesis?.getVoices().some(v=>v.localService&&v.lang.startsWith('en'));
  if(available){speech(text,true);}else if(screen==='lesson')status('Read together: '+text);
  else {const notice=document.querySelector('#audio-status');notice.hidden=false;notice.textContent='A local reading voice is not available. Read the words together; every activity works without sound.';}
};
render();
