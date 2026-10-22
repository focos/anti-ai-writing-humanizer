#!/usr/bin/env node
'use strict';
const fs = require('node:fs');

const REVIEW_WORDS = ['不可否认的是','值得注意的是','综上所述','总而言之','赋能','抓手','全方位','具有重要意义','未来可期'];
const countChars = text => [...text.replace(/\s/gu, '')].length;
function summarize(parts) {
  const lengths = parts.map(countChars).filter(n => n > 0);
  const count = lengths.length;
  const mean = count ? lengths.reduce((a,b) => a+b, 0)/count : 0;
  const stdDev = count ? Math.sqrt(lengths.reduce((s,n) => s+(n-mean)**2, 0)/count) : 0;
  return { count, mean, stdDev, cv: mean ? stdDev/mean : 0,
    minLen: count ? Math.min(...lengths) : 0, maxLen: count ? Math.max(...lengths) : 0 };
}
function sentences(text) {
  // Decimal periods remain within sentences; only ASCII periods not between digits split.
  return text.split(/[。！？!?]+|(?<!\d)\.|\.(?!\d)|\r?\n/u)
    .map(s => s.trim()).filter(s => /[\p{L}\p{N}]/u.test(s));
}
function reviewExpressions(text) {
  return REVIEW_WORDS.flatMap(word => {
    let positions = [], offset = 0, position;
    while ((position = text.indexOf(word, offset)) !== -1) {
      positions.push(position); offset = position + word.length;
    }
    return positions.length ? [{word, count: positions.length, positions}] : [];
  });
}
function analyzeText(text) {
  if (typeof text !== 'string') throw new TypeError('文本必须为字符串');
  const paragraphs = text.split(/\r?\n+/u).map(s => s.trim()).filter(Boolean);
  const sentenceParts = sentences(text);
  const repeated = new Map();
  sentenceParts.forEach(s => {
    const key = s.replace(/\s/gu,'');
    if (countChars(key) >= 8) repeated.set(key, (repeated.get(key) || 0)+1);
  });
  return {
    kind: 'writing-diagnostics', externalDetection: '未实测',
    notice: '离线编辑线索；不计算PPL，不预测AIGC概率。词语命中和句长不是作者身份判断。',
    totalChars: countChars(text), paragraphCount: paragraphs.length,
    sentenceStats: summarize(sentenceParts),
    clauseStats: summarize(text.split(/[，,；;。！？!?\r\n]+/u).filter(s => /[\p{L}\p{N}]/u.test(s))),
    reviewExpressions: reviewExpressions(text),
    repeatedSentences: [...repeated].filter(([,count]) => count > 1).map(([text,count]) => ({text,count})),
    paragraphs: paragraphs.map((p,index) => ({
      index: index+1, text: p, totalChars: countChars(p),
      sentenceStats: summarize(sentences(p)), reviewExpressions: reviewExpressions(p)
    }))
  };
}
function readInput(source) {
  if (fs.existsSync(source)) {
    if (!fs.statSync(source).isFile()) throw new Error('输入路径不是文件');
    return fs.readFileSync(source,'utf8');
  }
  if (/[/\\]|\.(txt|md|csv|json)$/iu.test(source)) throw new Error('输入文件不存在：'+source);
  return source;
}
function main(args) {
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log('用法：node scripts/analyze_ai_burstiness.js <文件或文本> [--json]');
    return;
  }
  if (args.slice(1).some(a => a !== '--json')) throw new Error('不支持的参数');
  const result = analyzeText(readInput(args[0]));
  console.log(JSON.stringify(result,null,2));
}
if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode=1; }
}
module.exports = {analyzeText, summarize, readInput};
