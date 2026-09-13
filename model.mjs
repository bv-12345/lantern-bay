import {quantities, bonds, stories} from './content.mjs';
export function tenSlots(n=0, type=1) {
  if (!Number.isInteger(n) || n < 0 || n > 10) throw new RangeError('Quantity must be an integer from 0 to 10');
  return Array.from({length:10}, (_,i)=>i<n?type:0);
}
export function count(slots) {return slots.filter(Boolean).length;}
export function storyResult(story) {return story.op==='+'?story.a+story.b:story.a-story.b;}
export function task(mode,index) {
  if (mode==='build') return {initial:0,target:quantities[index],title:'Fill a frame',prompt:`Show ${quantities[index]} lights. Tap a space to add or take away a light.`};
  if (mode==='bonds') return {initial:bonds[index],target:10,title:'Make ten',prompt:`${bonds[index]} lights are here. How many more make ten?`};
  if (mode==='stories') {const s=stories[index];return {...s,initial:s.a,target:storyResult(s),prompt:s.text};}
  if (mode==='final') return index===0
    ? {initial:4,target:10,title:'The lighthouse party',prompt:'4 lights are ready. Fill the frame so the party has ten lights.'}
    : {initial:10,target:8,title:'Two lights go home',prompt:'The party had 10 lights. 2 go home. Show how many stay.'};
  throw new RangeError('Unknown activity');
}
export function length(mode) {return mode==='build'?quantities.length:mode==='bonds'?bonds.length:mode==='stories'?stories.length:2;}
export function create(mode='build',index=0) {
  if (!['build','bonds','stories','final'].includes(mode) || !Number.isInteger(index) || index<0 || index>=length(mode)) throw new RangeError('Invalid task');
  return {mode,index,slots:tenSlots(task(mode,index).initial),solved:false};
}
export function toggle(state,index) {
  if (!Number.isInteger(index)||index<0||index>9) return state;
  const s={...state,slots:[...state.slots],solved:false};
  // In a number bond, the provided part remains fixed. Learners move their own part.
  if ((s.mode==='bonds'||s.mode==='final'&&s.index===0) && index<task(s.mode,s.index).initial) return state;
  s.slots[index]=s.slots[index]?0:2;
  return s;
}
export function adjust(state,delta) {
  const locked=(state.mode==='bonds'||state.mode==='final'&&state.index===0)?task(state.mode,state.index).initial:0;
  const i=delta>0?state.slots.findIndex(v=>!v):state.slots.findLastIndex((v,i)=>v&&i>=locked);
  return i<0?state:toggle(state,i);
}
export function check(state) {return count(state.slots)===task(state.mode,state.index).target;}
export function equation(state) {
  const t=task(state.mode,state.index);
  if(state.mode==='build')return `${count(state.slots)} lights`;
  if(state.mode==='bonds'||state.mode==='final'&&state.index===0)return `${t.initial} + ${count(state.slots)-t.initial} = ${count(state.slots)}`;
  if(state.mode==='stories')return `${t.a} ${t.op} ${t.b} = ${t.target}`;
  return '10 − 2 = 8';
}
