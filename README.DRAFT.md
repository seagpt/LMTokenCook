# LMTokenCook — README draft

> **Review copy only.** This file is a proposed replacement for `README.md`. It does not change the live project README.

**Turn a folder of text and code into smaller, ordered context files for an AI conversation.**

LMTokenCook helps when a project is too large to paste into one chat message. It reads selected files, counts tokens, creates a file map, and writes chunks in order so you can share the full picture step by step.

**Status:** Active public project. The main product is the browser app. The Python service remains a compatibility and experimental path.

- **Use the app:** <https://lmtokencook.dropshockdigital.com/>
- **Source code:** <https://github.com/DropShock-Digital/LMTokenCook>

![LMTokenCook browser app](src/ui/public/app_hero_screenshot.png)

## What it does

1. You choose a folder of text or source files.
2. LMTokenCook reads eligible files and counts them with `cl100k_base` tokenization.
3. It can create a project map showing each file and its token count.
4. It splits each file on line boundaries at your chosen limit.
5. It writes numbered context files with optional “wait for the next part” instructions.

In browsers with the File System Access API, you choose both the input and output folders. Other supported browsers fall back to a ZIP download.

## Privacy and care

The primary browser workflow processes selected files in your browser. It does not upload the chosen folder as part of that workflow.

The output is still a copy of your source material. Review it before you share it. Do not send private code, credentials, client files, personal data, or regulated information to an AI service unless you are allowed to do so.

## Use it locally

```bash
git clone https://github.com/DropShock-Digital/LMTokenCook.git
cd LMTokenCook/src/ui
npm ci
npm run dev
```

Open the local URL printed by Vite. Chromium-family browsers provide the full folder read/write path. Other browsers use the ZIP fallback.

## Check a change

### Browser app

```bash
cd src/ui
npm ci
npm run build
```

### Python compatibility path

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r src/server/requirements.txt
PYTHONPATH=. python -m pytest tests/
```

## What it does not do

- It does not increase an AI model’s context window.
- It does not decide whether your files are safe to share.
- It does not parse every binary or office-file format in the browser workflow.
- It does not guarantee that a third-party chat product will accept a particular token count.

## Project map

| Path | Purpose |
| --- | --- |
| `src/ui/` | Browser-native React app |
| `src/ui/src/lib/chunker.ts` | Token counting and line-aware chunking |
| `src/ui/src/lib/fs-handler.ts` | Permissioned folder access and output writing |
| `src/server/` | Python compatibility and API experiment path |
| `tests/` | Python regression tests |
| `assets/` | Product artwork and diagrams |

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a change. For a security issue, use GitHub’s private vulnerability-reporting option; do not post source material, credentials, generated chunks, or proof data in a public issue. See [SECURITY.md](SECURITY.md).

## License

LMTokenCook is available under the [MIT License](LICENSE).

Built by [DropShock Digital](https://dropshockdigital.com) and Steven Seagondollar.
