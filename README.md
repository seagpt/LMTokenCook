![LMTokenCook Logo](assets/LMTC_Patch.png)

<h1 align="center">LMTokenCook: Cook Your Files into AI-Ready Servings 🍳</h1>
<h3 align="center">A tool for AI power-users by Steven Seagondollar, DropShock Digital</h3>

## 🚀 Download

* [**Download for Windows (.exe)**](https://github.com/seagpt/LMTokenCook/releases/download/exe_v1.0/LMTokenCook.exe)
* [**Download for macOS (.dmg)**](https://github.com/seagpt/LMTokenCook/releases/download/dmg.v1.0/LMTokenCook.app.zip)

---

### Overview 📖

LMTokenCook is an AI power-user’s favorite tool to maximize their value with web interface–based, large-context-window language models. The tool compiles your data into a single master text file that begins with a map of the file hierarchy, appends each file’s content (labeled with its full path and token count), and offers to divide your consolidated content into manageable servings based on the token limit you set.

Powerful AI models like Gemini offer a 1,000,000-token context window for API users, but web interface subscribers can only submit ~70,000 tokens per prompt. This can make it difficult to provide full context to Gemini if you're working with a book, transcript, or code repository that exceeds the prompt limit. However, thanks to LMTokenCook, you can sequentially copy and paste each serving into your chosen AI tool, saturating the full 1,000,000-token context window to get the most out of your subscriptions.

---

How do you ensure the AI considers *all* relevant information if you can't paste it in one go?

**Context Augmented Generation! (CAG)**

**LMTokenCook bridges this gap for non-API users.** It systematically processes your local file collections:

1.  It scans your selected directory, identifying relevant text-based files while skipping non-text based files.
2.  It extracts the text content from various supported formats.
3.  It compiles this content into a single, structured data stream, prepending a file hierarchy map and clearly delineating each file's content with its full path and estimated token count.
4.  Crucially, it offers to divide this consolidated content into manageable **servings** (`serving_XXX_of_YYY.txt`), precisely sized according to a token limit you specify, perfectly tailored for sequential pasting into your target AI's prompt window.

By feeding these servings one after another, you can effectively saturate the LLM's full context window, ensuring it operates with the complete background information necessary for high-quality, contextually aware responses. This allows you to leverage the full power of your AI subscriptions, even through interfaces that have restricted prompt windows. The output is clean, token-efficient plain text for maximum compatibility and recall.

<div align="center">
<img src="assets/Program_Preview.png" alt="LMTokenCook GUI Screenshot" width="60%" style="border: 1px solid #FFEB70; border-radius: 5px;"/>
</div>

---

### Features ✨

* **Cross-Platform GUI:** Modern, intuitive interface built with CustomTkinter, featuring a dark theme with yellow accents. Natively supports macOS and Windows. 💻
* **Flexible Input:** Select input directories or single files using a standard file browser or convenient drag-and-drop. 📁
* **Organized Output:** Automatically creates a unique, timestamped subfolder within your chosen output directory for each processing run, keeping results clearly separated. 💾
* **Intelligent File Scanning:** Recursively scans directories, identifying and processing files based on a comprehensive, extensible list of text, code, and document extensions (see `lmtokencook/scanner.py` for the full list, includes `.txt`, `.md`, `.py`, `.js`, `.java`, `.docx`, `.pdf`, `.ipynb`, etc.). Safely skips binary files, archives, media, symbolic links, and common exclusion folders (like `.git`, `.venv`, `node_modules`). 🧐
* **Robust Text Extraction:** Leverages dedicated libraries for reliable content extraction:
    * Plain Text & Code (numerous formats).
    * Microsoft Word (`.docx`) via `python-docx` (best-effort text extraction).
    * PDF (`.pdf`) via `pypdf` (best-effort extraction, requires a text layer; does not perform OCR on image-only PDFs). (*pdf support coming soon*)
    * Jupyter Notebooks (`.ipynb`) processed to extract code and markdown cell content.
* **Accurate Tokenization:** Employs OpenAI's official `tiktoken` library (`cl100k_base` encoding) for token counting and serving size calculations, ensuring high relevance for models like the GPT-4 family and Google Gemini. 🪙
* **Optimized Concatenation & Formatting:** Efficiently processes and combines text streams. Applies optional formatting *before* writing output. Clearly marks the beginning and end of each file's content within the output stream using `=== File Start: [Full Path] ===` and `=== File End: [Full Path] ===` delimiters.
* **Optional Master File:** Choose to retain the full concatenated `masterfile.t-XXXXX.txt` (where XXXXX reflects the *final* estimated token count after processing) or automatically discard it if only the servings are needed, saving disk space.
* **Intelligent Token-Based Servings:** If the total processed token count exceeds your specified limit, the content is automatically divided into sequentially named `serving_XXX_of_YYY.txt` files. Each serving includes instructional comments (`# [LMTokenCook] This is serving X of Y...`) to guide sequential input into the LLM interface. 🔢
* **Line Numbering Option:** Optionally prepend `NNNN ` (a 4-digit, zero-padded line number and space) to every line of the output content. Useful for citing specific parts of the source material in your prompts, for example, code repositories. #️⃣
* **Skip Empty Lines Option:** Optionally remove completely blank lines from the output to create denser, potentially more token-efficient content. 🧹
* **Detailed Manifest (`manifest.json`):** Every run generates a comprehensive JSON report, providing full transparency and traceability:
    * **Run Metadata:** Input/output paths, timestamp, processing options selected, final file counts (scanned, processed, skipped, failed), total estimated tokens, serving details.
    * **Directory Structure:** A nested dictionary mirroring the scanned input, showing the status of each file/folder.
    * **Processed File Details:** An ordered list for each successfully processed file, including relative/absolute paths, character offsets in the final concatenated stream, character count, *final* estimated token count, extraction status, and encoding used. 🧾
* **Responsive UI:** Utilizes background threading and a queue system to ensure the GUI remains interactive and responsive during file scanning, extraction, and processing, providing real-time progress updates. ⏳
* **Configuration Persistence:** Remembers your last-used output folder path and serving size setting in a `config.json` file located in the standard user application configuration directory (via `appdirs`). ⚙️

---

### 🖼️ Example: Gemini Workflow with Servings

<div align="center">
<img src="assets/working-example.png" alt="Gemini Working with Servings" width="50%" style="border: 1px solid #FFEB70; border-radius: 5px;"/>
</div>

*Above: An example showing multiple LMTokenCook servings being sequentially pasted into Google Gemini, enabling analysis of content far exceeding the single prompt limit, thereby utilizing more of the available context window.*

---

### ⭐ Understanding the AI Playground: Tokens, Context, and Prompts

Maximizing LMTokenCook requires understanding how Large Language Models (LLMs) handle text. Here’s a quick primer:

* **What are LLMs?**
    Think of models like **Google Gemini**, **OpenAI's ChatGPT (GPT-4 family)**, **Anthropic's Claude**, **Mistral AI's models**, and **Meta's LLaMA** as highly advanced pattern-matching and text-generation engines. Trained on massive datasets, they learn the structure, nuances, and information within human language, allowing them to perform tasks like summarization, translation, coding, conversation, and complex reasoning.

* **🪙 What are Tokens?**
    LLMs don't process text word-by-word. They break it into **tokens**. A token is the fundamental unit the model "sees." It could be a whole word (`"model"`), a common part of a word (`"token"`, `"iza"`, `"tion"`), a single character (`"a"`), punctuation (`.`), or even whitespace. This **tokenization** process uses specific algorithms (like BPE, WordPiece, SentencePiece). The key takeaway is that model limits and API costs are based on *token counts*, not characters or words. Different languages also tokenize with varying efficiency. LMTokenCook uses OpenAI's `tiktoken` (`cl100k_base`), which aligns well with many current models, making its serving size calculations highly relevant.

* **🧠 What is a Context Window?**
    This is the model's **total working memory**, measured in tokens. It represents the maximum span of text (including your input prompt, preceding conversation turns you provide as history, and sometimes the model's own generated output) that the model can reference *simultaneously* when generating its next response. A larger context window allows for greater coherence over long interactions and analysis of large documents. However, processing larger contexts demands more computational resources, potentially increasing cost and latency. Leading models now offer context windows ranging from 128k up to 1 or 2 million tokens (though availability varies).

* **✍️ What is a Prompt/Input Limit?**
    This is often the more immediate practical constraint, especially in web interfaces. It's the **maximum number of tokens you can actually submit** in a *single* prompt. This limit is frequently **much smaller** than the model's total context window. For example, while Gemini 2.5 Pro has a 1M token context window, its web interface might limit a single *input* to tens of thousands of tokens (e.g., ~65k for 2.5 Pro). These limits exist for performance, cost control, and usability reasons.
    **LMTokenCook's "Serving Size" should be set based on this Prompt/Input Limit**, leaving sufficient headroom for your own instructions and the model's response. LMTokenCook helps you overcome this limit by segmenting your large context into manageable servings.

* **📊 Major Models & Approximate Web Interface Limits (April-2025 - *Disclaimer: Limits change! Always verify with the specific platform's official documentation and your subscription tier. These estimates focus on direct text input in web chat interfaces.*):**

| Model Family (Provider)        | Specific Models (Examples)             | Max Context Window (Model Capability) | Typical *Web Interface* Prompt/Input Limit & Details                                                                                                | Max Output Limit (Web UI) | Web Interface Access Points                                           |
| :----------------------------- | :------------------------------------- | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------ | :-------------------------------------------------------------------- |
| **OpenAI GPT-4 Series** | GPT-4 Turbo, GPT-4o, GPT-4.1, GPT-4.5 (Preview) | 128k - 1M+ tokens                     | **Highly Tier-Dependent:** Free tier (often GPT-3.5 or limited GPT-4o): ~8k-16k tokens? Paid tiers (Plus/Team using GPT-4/4o/4.5): Often ~32k-128k tokens, but the *usable* single-prompt input can fluctuate and may be less than the model's max context. | ~4k-8k tokens (typical)   | chat.openai.com                                                       |
| **Google Gemini Series** | Gemini 1.0 Pro, 1.5 Flash, 1.5 Pro, 2.5 Pro (Preview) | 32k - 2M+ tokens                    | **Varies by Interface & Tier:** Basic `gemini.google.com` (often 1.0 Pro or 1.5 Flash): ~16k-64k tokens? Gemini Advanced (1.5/2.5 Pro): ~60k-128k+ tokens text input. Google AI Studio: Often allows larger inputs closer to 1M via specific configurations, but differs from the standard web chat. File uploads can bypass direct text limits but contribute to context. | ~8k tokens (typical)      | gemini.google.com, aistudio.google.com, Google Workspace Integrations |
| **Anthropic Claude Series** | Claude 3 Haiku, 3 Sonnet, 3 Opus, 3.5 Sonnet | 200k+ tokens                        | **Tier-Dependent:** Free tier: Significantly limited, perhaps ~10k-20k tokens for direct input. Pro tier: Much higher, potentially up to ~150k-200k tokens, especially effective via *file uploads*. Direct text pasting might have lower practical limits. | ~4k tokens (typical)      | claude.ai                                                             |
| **Mistral AI Series** | Mistral Small, Medium, Large, Mixtral, NeMo | 32k - 128k tokens                     | **Varies Greatly by Platform:** Mistral doesn't have a single dominant public web UI like the others. Limits heavily depend on the third-party host (e.g., Hugging Chat, Perplexity Labs, LlamaParse, etc.) and could range from ~4k to 32k+ tokens. | ~4k-8k tokens             | Primarily via Third-party platforms or specific partner integrations. |

---

### ❗ Mandatory Reading: Understand Before Use

* **Set Serving Size Wisely:** Base your "Serving Size" on the **Prompt/Input Limit** of your target LLM interface (see table above), *not* its max context window. Leave ample headroom (e.g., set `60000` for Gemini's web UI, `28000` for standard ChatGPT) for your instructions and the AI's response.
* **Extraction Quality:** Text extraction from complex formats (PDF, DOCX) is best-effort and may miss content in images or complex layouts. Review `manifest.json` for errors.
* **Token Estimates:** Counts are via `tiktoken` (`cl100k_base`). Actual model tokenization might vary slightly. Servings might slightly exceed the limit if a very long line cannot be split.
* **Privacy & Security:** LMTokenCook runs locally. **Do NOT process sensitive or confidential information** you wouldn't share with the third-party LLM service you intend to paste the servings into. Review the LLM provider's data usage policies.

---

### 💾 Installation

* **Prerequisites:**
    * Operating System: Windows 10/11 or macOS (>= 11 Big Sur recommended).
    * Disk Space: Sufficient free space for output files.
* **Steps:**
    1.  **Download:** Get the latest release from the [**GitHub Releases Page**](https://github.com/seagpt/LMTokenCook/releases/latest).
        * 🍎 **macOS:** Download `LMTokenCook.dmg`.
        * 🪟 **Windows:** Download `LMTokenCook.exe`.
    2.  **Install:**
        * **macOS:** Open the `.dmg`, drag `LMTokenCook.app` to `/Applications`. On first run, you may need to Right-click -> "Open" -> Confirm in the security dialog.
        * **Windows:** Run the `.exe` installer. Bypass SmartScreen if prompted ("More info" -> "Run anyway").
    3.  **Launch:** Run LMTokenCook from Applications (macOS) or Start Menu/Desktop (Windows).

---

### 📖 Usage Guide

1.  **Launch LMTokenCook.**
2.  **Select Input:** Use "Browse..." or drag-and-drop your source folder/file.
3.  **Select Output:** Use "Browse..." to pick a *base* output directory. A timestamped subfolder will be created there.
4.  **Set Serving Size:** Enter max tokens per serving file (based on LLM prompt limits). 0 or blank = no serving.
5.  **Choose Options:** Check boxes for keeping the master file, adding line numbers, or skipping empty lines.
6.  **Click "Start Processing".**
7.  **Monitor:** Watch the status log and progress bar. Use "Cancel" if needed.
8.  **Completion:** Wait for the "[SUCCESS]" message.
9.  **Access Results:** Click "Open Output Folder" to find the `manifest.json` and `.txt` file(s).
10. **Feed to LLM:** Copy content from `masterfile.txt` or sequentially from `serving_X_of_Y.txt` files into your LLM interface, following the instructional comments within the servings. After loading context, pose your question/task.

    *Example Multi-Serving Input Workflow:*
    1.  *Prompt 1:* `"Here is the first part of the context: [Paste content of serving_1_of_N.txt]"` -> Send.
    2.  *Prompt 2:* `"Here is the next part: [Paste content of serving_2_of_N.txt]"` -> Send.
    3.  *(Repeat...)*
    4.  *Prompt N+1:* `"[Paste content of serving_N_of_N.txt] Now, based on all the context provided, please [Your actual question or task]."` -> Send.

    <div align="center">
<img src="assets/working-example.png" alt="Working Example: Gemini Multi-Servings Upload" width="50%" style="border: 1px solid #FFEB70; border-radius: 5px;"/>
</div>
*Above: Gemini successfully receiving and processing multiple LMTokenCook serving files in sequence.*

---

### ⚙️ Configuration

LMTokenCook saves your last-used settings automatically:

* **File:** `config.json`
* **Location:** Standard user config directory (via `appdirs`).
    * *macOS:* `~/Library/Application Support/LMTokenCook/`
    * *Windows:* `%APPDATA%\LMTokenCook\LMTokenCook\`
    * *Linux:* `~/.config/LMTokenCook/` (if built from source)
* **Settings:** `last_output_dir`, `last_serving_size`.
* **Reset:** Delete `config.json` to restore defaults.

---

### 🧾 Manifest File (`manifest.json`)

A detailed JSON report is generated for each run, providing transparency:

* **`metadata`:** Run summary (paths, timestamp, counts, options, serving info).
* **`directory_structure`:** Input structure view with processing status per item.
* **`processed_files`:** List of processed files detailing paths, final character offsets, char/token counts, status, encoding.

---

### 🛠️ Technical Details

* **Architecture:** Built with Python and the CustomTkinter library for the GUI. Uses background threading (`queue.Queue`) for responsive processing of file I/O, text extraction, tokenization, and writing outputs. The processing pipeline is optimized to handle content modification options efficiently before generating the final output stream(s).
* **Development Environment:** The project was built using Python directly within the **Windsurf IDE**. Windsurf, being an AI-centric fork of VS Code, facilitated the use of OpenAI models for assistance. Specifically, **GPT-4.1 was utilized for coding and debugging via Windsurf starting on the very day the model was released.**
* **Key Dependencies:** Python 3.8+, `customtkinter`, `Pillow`, `tiktoken`, `tkinterdnd2`, `python-docx`, `pypdf`, `appdirs`. *(See `requirements.txt` for specific versions used in development).*
* **DOCX Styles:** Contains standard DOCX styling files, primarily relevant to the underlying `python-docx` library; these are not applied to the plain text output.
* **Distribution:** Packaged into standalone applications using PyInstaller.

---

### ❓ Troubleshooting

1.  **`ModuleNotFoundError`?** (Source code only) Ensure virtual env is active & `pip install -r requirements.txt`. If packaged, reinstall app.
2.  **App Unresponsive?** Allow time for heavy I/O. If persistent, force quit & check console logs. Report bugs on GitHub with details.
3.  **PDF/DOCX Issues?** Check `manifest.json` for errors. May be password-protected, image-only (no OCR), corrupted, or use unsupported formatting. Extraction is best-effort.
4.  **Token Counts/Serving Size Off?** Counts are `tiktoken` estimates; actual LLM tokenization may differ slightly. Check manifest counts (reflecting options like line numbering/skipping). Servings prioritize line breaks and may slightly exceed limits with extremely long single lines.
5.  **Reset Settings?** Delete `config.json` (see Configuration).
6.  **Drag-and-Drop Fails?** Relies on `tkinterdnd2`. Use "Browse..." as the main method. May require extra setup if running from source.

---

### 🤝 Contributing & Support

Contributions, bug reports, and feature suggestions are welcome via the [GitHub Issues](https://github.com/seagpt/LMTokenCook/issues) page for the project.

Special thanks to:

* **Garrett Montagne** – For invaluable technical assistance in resolving complex `tiktoken` dependency and packaging challenges across Windows and macOS, significantly improving build reliability and providing crucial troubleshooting support.

---

### 🛟 Need Help? Support & Contact

If you experience any issues, bugs, security concerns, or have questions about LMTokenCook, we want to hear from you! Your feedback is essential to ensuring the reliability, security, and ongoing improvement of this tool.

**How to Contact Support:**

- **Email:** [support@dropshockdigital.com](mailto:support@dropshockdigital.com)

**Please contact us if you encounter any of the following:**
- Application crashes, freezes, or unexpected errors
- Problems with file processing, output, or token counts
- Security vulnerabilities or privacy concerns
- Installation or compatibility issues on Windows or macOS
- Feature requests or usability suggestions
- Any other feedback, questions, or concerns

When reaching out, please include as much detail as possible:
- Your operating system and version (e.g., Windows 11, macOS Sonoma)
- The version of LMTokenCook you are using
- Steps to reproduce the issue
- Any error messages, screenshots, or output files that may help us diagnose the problem

**Your privacy and security are important to us.** All support requests are handled confidentially by the DropShock Digital team. We aim to respond to all inquiries as quickly as possible.

Thank you for helping us make LMTokenCook better for everyone!

---

### 📜 License

Copyright (c) 2025 Steven Seagondollar, DropShock Digital

Licensed under the **MIT License**. See the `LICENSE.md` file in the repository for the full text.

---

### 🙏 Acknowledgements

LMTokenCook leverages the power of the Python ecosystem and several key open-source libraries:

* [Python](https://www.python.org/)
* [CustomTkinter](https://github.com/TomSchimansky/CustomTkinter)
* [tiktoken](https://github.com/openai/tiktoken)
* [pypdf](https://github.com/py-pdf/pypdf)
* [python-docx](https://github.com/python-openxml/python-docx)
* [appdirs](https://github.com/ActiveState/appdirs)
* [tkinterdnd2](https://github.com/python-tkdnd/tkdnd/)
* [Pillow](https://python-pillow.org/)
* [PyInstaller](https://pyinstaller.org/)

---
