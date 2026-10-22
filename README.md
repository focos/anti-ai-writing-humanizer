# Anti-AI Writing Humanizer (中文表达去模板化与自然表达重构)

<p align="center">
  <img src="https://img.shields.io/badge/Agent_Skills-Open_Standard-blue.svg" alt="Agent Skills Standard" />
  <img src="https://img.shields.io/badge/Version-2.4.0-brightgreen.svg" alt="Version 2.4.0" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18.0-green.svg" alt="Node.js" />
  <img src="https://img.shields.io/badge/Zero_Dependencies-Builtin_Only-orange.svg" alt="Zero Dependencies" />
  <img src="https://img.shields.io/badge/License-Apache--2.0-blue.svg" alt="License" />
</p>

专为中文大语言模型（LLM）与多智能体（Multi-Agent）生态打造的**中文文本去模板化、消除AI公文八股腔、重塑人类思考温度与自然表达**的开源技能模块。

严格遵循 [Agent Skills 开放标准](https://agentskills.io)，原生适配 **Claude Code、Cursor、OpenAI Codex、Google Antigravity、Gemini CLI、WorkBuddy、GitHub Copilot、Coze (扣子)** 等全部主流 Agent 平台。

---

## 💡 为什么需要本项目？

当前大语言模型（GPT-4、Claude、DeepSeek、混元等）在生成中文文本时，普遍存在严重的**“机器套话病”**与**“八股公文腔”**：
- **机械对称与排比泛滥**：动辄“不仅...而且...更...”、“从...到...再到...”、“既是...又是...更是...”；
- **空心大词与假升华**：“如同一盏明灯”、“为...奠定了基石”、“谱写了壮丽篇章”、“未来可期”、“行稳致远”；
- **过度连接词与清单化**：无论什么问题都习惯列出 `1. 2. 3.`，充斥“首先、其次、再者、总而言之、由此可见”；
- **假中立端水**：“这把双刃剑既有优势也有挑战，需要辩证客观看待”。

### 常见的降 AI 误区 vs 本项目的解决理念

| 维度 | 常见降 AI 工具的误区 ❌ | 本项目的核心原则 (v2.4.0) ✅ |
|---|---|---|
| **事实准确性** | 为制造“真实感”凭空造谣，虚构不存在的数据、实验、亲身经历 | **事实绝对保真**：严格保留人名、数字、单位、限制条件、引用和论据，未知信息绝不瞎编 |
| **语言风格** | 盲目注入口语俚语与奇怪口癖（如强插“手抖”、“绝了”、“纯纯”） | **语域纯度守恒**：学术就是学术，研报就是研报，纪实就是白描，保留原作者真实声音 |
| **结构处理** | 机械做同义词替换（“人工智能”改“机器智能”），破坏上下文语义 | **段落推进重构**：消除空话复述，理顺论据与论点因果，用真实动作替代空泛评价 |
| **检测认知** | 迷信“100%包过”、“预估AIGC概率”，搞黑盒对抗 | **客观反馈驱动**：以实际检测报告为线索定位问题段落，不设虚假承诺，不搞伪造对抗 |

---

## 🛠️ 多智能体平台兼容性

本技能开箱即用，支持以下平台的项目级与全局级目录：

| 平台 | 项目级目录 | 用户全局目录 |
|---|---|---|
| **Claude Code** | `.claude/skills/` | `~/.claude/skills/` |
| **Cursor** | `.cursor/skills/` | `~/.cursor/skills/` |
| **OpenAI Codex** | `.codex/skills/` | `~/.agents/skills/` |
| **Google Antigravity** | `.gemini/skills/` | `~/.gemini/antigravity/builtin/skills/` |
| **Gemini CLI** | `.gemini/skills/` | `~/.gemini/skills/` |
| **WorkBuddy** | `.workbuddy/skills/` | `~/.workbuddy/skills/` |
| **GitHub Copilot** | `.copilot/skills/` | `~/.copilot/skills/` |
| **Coze (扣子)** | `.coze/skills/` | `~/.coze/skills/` |
| **通用 Agents** | `.agents/skills/` | `~/.agents/skills/` |

---

## 🚀 快速开始与安装

### 方式一：Windows 用户一键安装 (推荐)
直接双击根目录下的 `一键安装.bat`，脚本会自动探测当前电脑中安装的全部智能体平台并一键同步。

### 方式二：跨平台命令行安装 (Node.js)
```bash
# 克隆仓库
git clone https://github.com/<your-username>/anti-ai-writing-humanizer.git
cd anti-ai-writing-humanizer

# 自动扫描并安装到本机所有 Agent 环境
node scripts/install_agents.js

# 或者指定安装到某个目标目录
node scripts/install_agents.js -t ~/.claude/skills
```

### 方式三：手动部署
直接将本项目文件夹复制或软链接（Symlink）到对应 Agent 的 `skills/anti-ai-writing-humanizer` 目录下即可。

---

## 📖 日常使用姿势

安装完成后，在任意支持 Agent Skills 的对话中，直接对 Agent 发送需求即可触发：

```markdown
# 场景 1：学术论文 / 毕业设计
"请使用 anti-ai-writing-humanizer 帮我润色这段论文引言，消除AI模板腔，保留全部专业术语、引用标号和实验数据，直接给修改后的正文。"

# 场景 2：商业研报 / 行业分析
"请按照 anti-ai-writing-humanizer 技能重构这段宏观分析，剔除空心黑话与排比套话，用清晰的事实和数据因果推进。"

# 场景 3：纪实叙事 / 个人随笔
"请用 anti-ai-writing-humanizer 改写这篇回忆文章，保留原作者的观察视角，用具体的现实动作代替煽情总结。"

# 场景 4：结合检测报告定向修改
"这是我的原稿，朱雀检测在第 2 段和第 4 段标出了疑似 AI，请参考 anti-ai-writing-humanizer 的检测反馈模式进行针对性修改。"
```

---

## 🧰 内置零依赖离线工具链

本项目在 `scripts/` 下提供纯 Node.js（零外部 npm 依赖）的文本诊断与分析工具：

### 1. 文本统计与模板腔诊断器 (`analyze_ai_burstiness.js`)
提供句长变异系数 (CV)、极值差、高频公文套话扫描与重复句检测：
```bash
# 查看人性化诊断摘要
node scripts/analyze_ai_burstiness.js input.txt

# 输出完整结构化 JSON（便于脚本与 CI 流水线集成）
node scripts/analyze_ai_burstiness.js input.txt --json
```

### 2. 文本非侵入式格式检查器 (`humanize_text.js`)
安全合规的本地后处理器，默认**绝对保留原文语义与标点**：
```bash
# 只读检查模式
node scripts/humanize_text.js input.txt --check-only

# 显式规范空白（仅处理统一换行和行尾多余空格，不改动文字）
node scripts/humanize_text.js input.txt --normalize-whitespace -o cleaned.txt
```

### 3. 运行内置自动化单元测试
```bash
node --test scripts/text_tools.test.js
```

---

## 📂 项目结构全景

```
anti-ai-writing-humanizer/
├── SKILL.md                          # 智能体技能标准入口定义 (Agent Skill Entry)
├── README.md                         # 项目总说明与开源文档
├── LICENSE                           # Apache-2.0 开源协议
├── 使用教程.md                        # 面向普通用户的简易速查手册
├── 一键安装.bat                       # Windows 一键全平台部署脚本
│
├── rules/                            # 规则与规范体系
│   ├── BLACKLIST_WORDS.md            # 600+ AI 高危套话与指纹词审查表
│   ├── HUMAN_STYLES.md               # 五大文体（学术/研报/专栏/自媒体/纪实）专属语域指南
│   ├── RESEARCH_EVIDENCE.md          # 行业检测文献与事实边界分析
│   ├── EMOTIONAL_NARRATIVE.md        # 情感纪实类写作去刻板化指南
│   ├── TRADING_NARRATIVE.md          # 经历与市场分析类文体规范
│   ├── ZHUQUE_DETECTION_SPECS.md     # AIGC 检测反馈记录与迭代规程
│   └── DISTILLED_OPENSOURCE_RULES.md # 开源经验与机制蒸馏白皮书
│
├── workflows/                        # 标准作业规程 (SOP)
│   ├── DE_AI_SOP.md                  # 五步重构标准工作流 (信息锁定/段落重构/句子修改)
│   ├── QUALITY_CHECKLIST.md          # 交付前 10 项质检红线与审核清单
│   └── AUTHOR_DRAFT_COMPARISON.md    # 原稿对照与局部修改记录规程
│
├── templates/                        # 提示词模板与案例记录
│   ├── prompt_templates.md           # 针对各种场景的即插即用 Prompt 模板
│   ├── before_after_cases.md         # 真实保真改写前后对照案例集
│   ├── author_comparison_record.md   # 版本对照记录模板
│   ├── emotion_feedback_20261008.md  # 情感稿反馈实验记录
│   └── stock_feedback_20261008.md    # 经历稿反馈实验记录
│
├── scripts/                          # 零依赖 Node.js 工具集
│   ├── analyze_ai_burstiness.js      # 离线句长方差与模板词分析器
│   ├── humanize_text.js              # 非侵入式后处理脚本
│   ├── install_agents.js             # 跨平台智能体一键安装器
│   └── text_tools.test.js            # 自动化测试用例
│
└── samples/                          # 诊断与实测比对范文库
```

---

## 🤝 贡献与共建

欢迎提交 Issue 和 Pull Request！
- 如果你发现了新的大模型典型套话或口癖，欢迎扩充 [`rules/BLACKLIST_WORDS.md`](rules/BLACKLIST_WORDS.md)；
- 如果你测试了新的文体范式，欢迎补充 [`templates/before_after_cases.md`](templates/before_after_cases.md)；
- 请确保新增脚本遵循零依赖原则，并通过 `node --test scripts/text_tools.test.js` 测试。

---

## 📜 许可证 (License)

本项目采用 [Apache License 2.0](LICENSE) 开源许可证。

> **免责声明**：本项目旨在帮助作者改善文本表达质量、消除大语言模型的机械套话并保留人类思考质感。请将本项目用于合规的写作辅助与编辑润色，请勿用于学术不端或违反相关平台服务协议的行为。
