@echo off
chcp 65001 >nul
title 去AI味与人类质感重构 (过朱雀) - 一键安装工具

echo ================================================================
echo      🛡️ 去AI味与人类质感重构技能 (过朱雀/知网) - 一键安装
echo      (原生支持 Antigravity / Claude Code / Cursor / Coze / Codex)
echo ================================================================
echo.
echo   [1] 🚀 自动安装 (推荐：全自动扫描并安装到电脑里的所有智能体平台)
echo   [2] 📁 拖拽安装 (如果你的智能体装在 D盘/E盘 等其他自定义路径，选这个)
echo   [0] 退出
echo.
set /p choice=请输入数字 [1 或 2] 并按回车 (默认直接回车选 1): 

if "%choice%"=="" goto auto_install
if "%choice%"=="1" goto auto_install
if "%choice%"=="2" goto drag_install
if "%choice%"=="0" exit /b

:auto_install
echo.
echo 正在为您全自动安装到电脑里的所有智能体...
node "%~dp0scripts\install_agents.js"
goto done

:drag_install
echo.
node "%~dp0scripts\install_agents.js" -i
goto done

:done
echo.
echo ================================================================
echo   🎉 安装完成！
echo.
echo   【接下来怎么用？】
echo   1. 重启你的智能体软件（如 Antigravity / Claude / Cursor / 扣子 等）
echo   2. 直接对 AI 发送一句话，例如：
echo      👉 "帮我把这段文本去AI味，要求过朱雀，改成科技专栏口吻"
echo      👉 "重构这段学术论文摘要，消除AI生成痕迹，要过知网检测"
echo      👉 "诊断这段文字的AI味道指数：[粘贴内容]"
echo ================================================================
echo.
pause
