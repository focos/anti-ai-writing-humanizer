#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {analyzeText, readInput} = require('./analyze_ai_burstiness');
function humanizePipeline(inputText, options = {}) {
  if (options.aggressive) throw new Error('--aggressive 已停用：不能自动注入口癖或无来源内容');
  const humanizedText = options.normalizeWhitespace
    ? inputText.replace(/\r\n?/g,'\n').replace(/[ \t]+$/gm,'') : inputText;
  return {originalText: inputText, humanizedText,
    beforeMetrics: analyzeText(inputText), afterMetrics: analyzeText(humanizedText)};
}
function main(args) {
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log('用法：node scripts/humanize_text.js <文件或文本> [--check-only] [--normalize-whitespace] [-o 输出文件] [--genre 文体]');
    console.log('默认保留原文。不会自动改写语义、删除标点、添加短句或预测检测率。');
    return;
  }
  let options = {}, output = null, checkOnly = false;
  for (let i=1; i<args.length; i++) {
    const arg=args[i];
    if (arg==='--aggressive' || arg==='-a') throw new Error('--aggressive 已停用：不能自动注入口癖或无来源内容');
    if (arg==='--check-only') checkOnly=true;
    else if (arg==='--normalize-whitespace') options.normalizeWhitespace=true;
    else if (['-o','--output','--genre'].includes(arg)) {
      if (!args[i+1] || args[i+1].startsWith('-')) throw new Error(arg+' 缺少参数');
      const value=args[++i];
      if (arg==='--genre') {
        if (!['academic','tech','emotion','finance','general'].includes(value)) throw new Error('不支持的文体');
        options.genre=value;
      } else output=value;
    } else throw new Error('不支持的参数：'+arg);
  }
  if (output && path.resolve(output)===path.resolve(args[0])) throw new Error('输出不能覆盖原始输入文件');
  const result=humanizePipeline(readInput(args[0]), options);
  if (checkOnly) console.log(JSON.stringify(result.beforeMetrics,null,2));
  else if (output) { fs.writeFileSync(output,result.humanizedText,'utf8'); console.log('已保存：'+output); }
  else process.stdout.write(result.humanizedText);
}
if (require.main === module) {
  try {main(process.argv.slice(2));} catch(error) {console.error(error.message); process.exitCode=1;}
}
module.exports={humanizePipeline, evaluateMetrics:analyzeText};
