import test from 'node:test';
import assert from 'node:assert/strict';
import {quantities,bonds,stories} from './content.mjs';
import {tenSlots,count,create,toggle,adjust,check,equation,task,storyResult,length} from './model.mjs';
test('all frames have exactly ten distinct slots; toggling cannot duplicate a counter',()=>{
  for(let n=0;n<=10;n++){let s={...create(),slots:tenSlots(n)};assert.equal(s.slots.length,10);for(let i=0;i<10;i++){const back=toggle(toggle(s,i),i);assert.deepEqual(back.slots.map(Boolean),s.slots.map(Boolean));}}
});
test('seven and three visibly form ten without changing starting part',()=>{
  let s=create('bonds',0);assert.equal(count(s.slots),7);assert.equal(toggle(s,0),s);
  for(let i=0;i<3;i++)s=adjust(s,1);
  assert.equal(check(s),true);assert.equal(equation(s),'7 + 3 = 10');
  assert.equal(s.slots.filter(v=>v===1).length,7);assert.equal(s.slots.filter(v=>v===2).length,3);
});
test('nine minus four is five, bounded against negative quantities',()=>{
  let s=create('stories',1);for(let i=0;i<4;i++)s=adjust(s,-1);
  assert.equal(count(s.slots),5);assert.ok(check(s));assert.equal(equation(s),'9 − 4 = 5');
  for(let i=0;i<20;i++)s=adjust(s,-1);assert.equal(count(s.slots),0);
});
test('zero and ten are deliberate quantity targets',()=>{
  assert.ok(quantities.includes(0)&&quantities.includes(10));assert.ok(check(create('build',1)));
  let s=create('build',3);for(let i=0;i<20;i++)s=adjust(s,1);assert.equal(count(s.slots),10);assert.ok(check(s));
});
test('every bond is solvable including zero plus ten and five plus five',()=>{
  assert.ok(bonds.includes(0)&&bonds.includes(5));assert.ok(new Set(bonds).size>=5);
  for(let i=0;i<bonds.length;i++){let s=create('bonds',i);for(let j=0;j<10-bonds[i];j++)s=adjust(s,1);assert.ok(check(s));assert.equal(count(s.slots),10);}
});
test('all six original stories have valid within-ten results and manipulable solutions',()=>{
  assert.ok(stories.length>=6);
  stories.forEach((story,i)=>{let s=create('stories',i);for(let j=0;j<story.b;j++)s=adjust(s,story.op==='+'?1:-1);assert.equal(count(s.slots),storyResult(story));assert.ok(check(s));assert.ok(storyResult(story)>=0&&storyResult(story)<=10);});
});
test('correctness depends on quantity, not counter placement',()=>{
  let s=create('build',0);for(const i of [9,4,7])s=toggle(s,i);assert.ok(check(s));
});
test('repeated adjustments preserve bounds and original state immutability',()=>{
  const original=create('build');let s=original;
  for(let i=0;i<200;i++)s=adjust(s,i%3?1:-1);
  assert.deepEqual(original.slots,tenSlots());assert.equal(s.slots.length,10);assert.ok(count(s.slots)>=0&&count(s.slots)<=10);
  assert.equal(toggle(s,-1),s);assert.equal(toggle(s,10),s);
});
test('fresh final combines making ten and taking away two',()=>{
  let s=create('final',0);for(let i=0;i<6;i++)s=adjust(s,1);assert.ok(check(s));
  s=create('final',1);s=adjust(adjust(s,-1),-1);assert.ok(check(s));assert.equal(count(s.slots),8);
});
test('invalid external state rejected',()=>{
  for(const n of [-1,11,NaN,1.5])assert.throws(()=>tenSlots(n),RangeError);
  assert.throws(()=>create('build',-1),RangeError);assert.throws(()=>create('other'),RangeError);
});
