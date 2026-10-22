'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {analyzeText} = require('./analyze_ai_burstiness');
const {humanizePipeline} = require('./humanize_text');
test('默认保留限定、数字、引用、专业解释及全部标点',()=>{
  const text='值得注意的是，该方案在某种程度上可能降低误差12.4%，但未验证因果[3]。他说：“先检查。”\r\n闭环（closed loop）——控制；阈值：0.65。';
  assert.equal(humanizePipeline(text).humanizedText,text);
  assert.throws(()=>humanizePipeline(text,{aggressive:true}),/已停用/);
});
test('统计分别报告句子与小句，不拆小数',()=>{
  const result=analyzeText('误差12.4%，尚未验证。温度25°C。');
  assert.equal(result.sentenceStats.count,2);
  assert.equal(result.clauseStats.count,3);
  assert.equal(result.externalDetection,'未实测');
  assert.equal('estimatedAigc' in result,false);
});
test('空文本、仅标点、Unicode均返回有限统计',()=>{
  for (const text of ['', '！？', '😀。𠮷野。']) {
    const result=analyzeText(text);
    assert.ok(Number.isFinite(result.sentenceStats.cv));
    assert.ok(Number.isFinite(result.sentenceStats.minLen));
  }
  assert.equal(analyzeText('😀').totalChars,1);
});
test('段落定位、重复句及词频可核查',()=>{
  const result=analyzeText('值得注意的是，样本未能支持该结论。\n样本未能支持该结论。样本未能支持该结论。');
  assert.equal(result.paragraphs.length,2);
  assert.equal(result.paragraphs[0].reviewExpressions[0].count,1);
  assert.equal(result.repeatedSentences[0].count,2);
});
test('规范空白仅处理换行和行尾，保留内部空格',()=>{
  const text='A  B  \r\n\t条件可能成立。\t\r\n';
  assert.equal(humanizePipeline(text,{normalizeWhitespace:true}).humanizedText,'A  B\n\t条件可能成立。\n');
});
test('CLI不覆盖原文件，check-only不写出，旧激进参数失败',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'humanizer-test-'));
  try {
    const input=path.join(dir,'input.txt'), output=path.join(dir,'output.txt');
    fs.writeFileSync(input,'事实：可能有效。');
    const script=path.join(__dirname,'humanize_text.js');
    let run=spawnSync(process.execPath,[script,input,'-o',input],{encoding:'utf8'});
    assert.equal(run.status,1); assert.equal(fs.readFileSync(input,'utf8'),'事实：可能有效。');
    run=spawnSync(process.execPath,[script,input,'--check-only','-o',output],{encoding:'utf8'});
    assert.equal(run.status,0); assert.equal(fs.existsSync(output),false);
    run=spawnSync(process.execPath,[script,input,'--aggressive'],{encoding:'utf8'});
    assert.equal(run.status,1);
    run=spawnSync(process.execPath,[script,path.join(dir,'missing.txt')],{encoding:'utf8'});
    assert.equal(run.status,1);
    run=spawnSync(process.execPath,[script,input,'-o',output],{encoding:'utf8'});
    assert.equal(run.status,0); assert.equal(fs.readFileSync(output,'utf8'),'事实：可能有效。');
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
