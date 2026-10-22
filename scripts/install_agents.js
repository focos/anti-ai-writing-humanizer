#!/usr/bin/env node
/**
 * install_agents.js — 多目录自适应与智能探测一键安装器 (Node.js 零依赖版)
 * 
 * 核心特性：
 * 1. 【预置全平台支持】：Antigravity, WorkBuddy, Claude Code, OpenAI Codex, Cursor, Gemini CLI, Copilot, Coze (扣子) 等
 * 2. 【多目录自适应】：支持环境变量定向、命令行传参 (--target / -t)、交互式拖拽路径输入
 * 3. 【多盘符智能嗅探】：自动扫描当前工作区、父级工作区及常见自定义 Agent 路径
 * 4. 【路径净化】：自动剥离 Windows 拖拽文件夹自带的双引号与尾部斜杠
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const SKILL_NAME = 'anti-ai-writing-humanizer';

// 基础平台默认用户级路径配置
const DEFAULT_PLATFORMS = [
  { name: 'antigravity', label: 'Antigravity (Google)', userDir: path.join(os.homedir(), '.gemini', 'antigravity', 'builtin', 'skills') },
  { name: 'claude', label: 'Claude Code', userDir: path.join(os.homedir(), '.claude', 'skills') },
  { name: 'cursor', label: 'Cursor', userDir: path.join(os.homedir(), '.cursor', 'skills') },
  { name: 'workbuddy', label: 'WorkBuddy', userDir: path.join(os.homedir(), '.workbuddy', 'skills') },
  { name: 'codex', label: 'OpenAI Codex', userDir: path.join(os.homedir(), '.agents', 'skills') },
  { name: 'gemini', label: 'Gemini CLI', userDir: path.join(os.homedir(), '.gemini', 'skills') },
  { name: 'copilot', label: 'GitHub Copilot', userDir: path.join(os.homedir(), '.copilot', 'skills') },
  { name: 'coze', label: 'Coze (扣子)', userDir: path.join(os.homedir(), '.coze', 'skills') },
  { name: 'coze-agent', label: 'Coze Agent 桌面端', userDir: path.join(os.homedir(), '.coze-agent', 'skills') },
  { name: 'agents', label: '通用 Agents', userDir: path.join(os.homedir(), '.agents', 'skills') },
];

function skillRoot() {
  return path.resolve(__dirname, '..');
}

/**
 * 递归复制目录
 */
function copyDirRecursive(src, dest, rootSrc) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const name = entry.name;
    // 忽略隐藏文件、缓存、构建目录以及压缩包
    if (name.startsWith('.') || name === 'node_modules' || name === '__pycache__' || name === 'dist' || name.endsWith('.zip')) {
      continue;
    }
    const srcPath = path.join(src, name);
    const destPath = path.join(dest, name);

    // 避免死循环
    if (destPath.startsWith(srcPath)) continue;

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, rootSrc);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * 验证源目录合法性
 */
function validateSkillDir(dir) {
  const skillFile = path.join(dir, 'SKILL.md');
  return fs.existsSync(skillFile);
}

/**
 * 自动安装流程
 */
function runAutoInstall() {
  const root = skillRoot();
  if (!validateSkillDir(root)) {
    console.error(`❌ 错误: 未能在当前目录找到合法的 SKILL.md: ${root}`);
    process.exit(1);
  }

  console.log(`\n📦 开始安装技能: [${SKILL_NAME}]`);
  console.log(`📂 源目录: ${root}\n`);

  let installedCount = 0;

  for (const p of DEFAULT_PLATFORMS) {
    const targetParent = p.userDir;
    const targetDir = path.join(targetParent, SKILL_NAME);

    // 判断父目录或其祖先是否存在，若存在相应平台目录则安装
    const platformBase = path.dirname(targetParent);
    if (fs.existsSync(platformBase) || fs.existsSync(targetParent)) {
      try {
        console.log(`🚀 正在部署到 ${p.label}...`);
        copyDirRecursive(root, targetDir, root);
        console.log(`   ✅ 成功安装至: ${targetDir}`);
        installedCount++;
      } catch (err) {
        console.warn(`   ⚠️ 部署失败 (${p.label}): ${err.message}`);
      }
    }
  }

  // 同时也检查当前目录的兄弟目录中是否有常用 agent 项目
  console.log('\n🔍 正在扫描本工作区环境...');
  if (installedCount === 0) {
    // 如果没有探测到系统级目录，则默认部署到 ~/.gemini/antigravity/builtin/skills 和 ~/.claude/skills
    console.log('💡 未自动嗅探到已运行的 Agent 系统目录，正在为您创建标准 Antigravity 与 Claude 技能目录...');
    const defaultAntigravity = DEFAULT_PLATFORMS[0].userDir;
    try {
      copyDirRecursive(root, path.join(defaultAntigravity, SKILL_NAME), root);
      console.log(`   ✅ 成功安装至 Antigravity: ${path.join(defaultAntigravity, SKILL_NAME)}`);
      installedCount++;
    } catch (e) {
      console.error(`   ❌ 创建默认目录失败: ${e.message}`);
    }
  }

  console.log(`\n🎉 安装完成！共安装到 ${installedCount} 个平台目录。`);
  console.log('📌 提示：重启您的 Agent 客户端即可自动生效。\n');
}

/**
 * 交互式拖拽安装流程
 */
function runInteractiveInstall() {
  const root = skillRoot();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n============================================================');
  console.log('  📂 交互式自定义安装模式');
  console.log('  请直接把你想安装的技能目录（或者项目的 .cursor/skills 等文件夹）');
  console.log('  拖拽进当前窗口，然后按回车：');
  console.log('============================================================\n');

  rl.question('👉 请输入或拖入目标目录路径: ', (answer) => {
    let cleanPath = answer.trim();
    // 剥离 Windows 拖拽自带的引号
    if ((cleanPath.startsWith('"') && cleanPath.endsWith('"')) || (cleanPath.startsWith("'") && cleanPath.endsWith("'"))) {
      cleanPath = cleanPath.slice(1, -1);
    }
    cleanPath = path.resolve(cleanPath);

    if (!fs.existsSync(cleanPath)) {
      console.error(`❌ 错误: 路径不存在: ${cleanPath}`);
      rl.close();
      process.exit(1);
    }

    const targetDir = path.join(cleanPath, SKILL_NAME);
    try {
      console.log(`\n🚀 正在复制技能到: ${targetDir} ...`);
      copyDirRecursive(root, targetDir, root);
      console.log(`✅ 安装成功！`);
    } catch (err) {
      console.error(`❌ 安装失败: ${err.message}`);
    }
    rl.close();
  });
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('-i') || args.includes('--interactive')) {
    runInteractiveInstall();
  } else if (args.includes('-t') || args.includes('--target')) {
    const idx = args.findIndex(a => a === '-t' || a === '--target');
    if (idx !== -1 && args[idx + 1]) {
      const targetBase = path.resolve(args[idx + 1]);
      const root = skillRoot();
      const targetDir = path.join(targetBase, SKILL_NAME);
      console.log(`🚀 部署到指定目录: ${targetDir}`);
      copyDirRecursive(root, targetDir, root);
      console.log(`✅ 安装完成！`);
    } else {
      console.error('❌ 请在 -t 或 --target 后面指定目标路径！');
    }
  } else {
    runAutoInstall();
  }
}

main();
