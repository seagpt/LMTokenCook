# Contributing to LMTokenCook

Thanks for helping make large-context handoffs safer and more predictable.

## Before opening a change

- Search existing issues first.
- Keep changes focused on a real user problem.
- Do not commit source folders, generated chunks, credentials, local databases, build output, or private AI context.
- Discuss major file-handling, privacy, or product-direction changes in an issue before implementation.

## Development checks

```bash
cd src/ui
npm ci
npm run build

cd ../..
python -m venv .venv
source .venv/bin/activate
pip install -r src/server/requirements.txt
PYTHONPATH=. python -m pytest tests/
```

## Pull requests

Include what changed, why it matters, how it was tested, screenshots for visible changes, and any privacy or compatibility impact.

By contributing, you agree that your contribution may be distributed under the repository's MIT License.
