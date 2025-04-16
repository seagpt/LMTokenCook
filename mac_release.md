# LMTokenCook for macOS (.dmg)

<div align="center">
<img src="assets/LMTC_Patch.png" alt="LMTokenCook Logo" />
</div>

<h1 align="center">LMTokenCook: Cook Your Files into AI-Ready Servings 🍳</h1>
<h3 align="center">A tool for AI power-users by Steven Seagondollar, DropShock Digital</h3>

---

## 🚀 Quick Download

[**Download LMTokenCook.dmg**](https://github.com/seagpt/LMTokenCook/releases/download/dmg.v1.0/LMTokenCook.dmg)

---

## Overview 📖
LMTokenCook is your AI power-user’s tool for maximizing the value of web interface–based, large-context-window language models. It compiles your data into a single master text file (with a map of the file hierarchy and token counts) and divides it into manageable "servings" for easy, sequential pasting into LLMs like Gemini, GPT-4, Claude, and more.

---

## 🍎 macOS Installation & Usage

1. **Download** `LMTokenCook.dmg` from the release assets above.
2. **Open** the DMG and drag `LMTokenCook.app` to your Applications folder.
3. On first launch, right-click and select "Open" to bypass Gatekeeper if prompted.

---

## Features ✨
- Native, modern GUI with dark theme (CustomTkinter)
- Drag-and-drop or browse for input files/folders
- Smart, token-based file splitting (OpenAI tiktoken)
- Recursively scans directories, skipping non-text files
- Outputs sequentially named serving files for easy LLM input
- Detailed manifest (`manifest.json`) for transparency
- No internet required; all processing is local and private

---

## Requirements
- macOS 12 (Monterey) or later (Apple Silicon & Intel supported)
- No Python or extra dependencies required

---

## Example Workflow
1. Run LMTokenCook.app
2. Select your input folder or file
3. Choose an output directory
4. Set your serving size (tokens per file)
5. Click Start and wait for processing
6. Sequentially paste each serving into your favorite LLM interface

---

## Troubleshooting
- If macOS blocks the app, right-click and select "Open" on first launch
- For help, see the [README](README.md) or open an issue on GitHub

---

## Credits
Developed by Steven Seagondollar, DropShock Digital.

Special thanks to Garrett Montagne for cross-platform build and packaging support.

---

## License
MIT License. See LICENSE file for details.
