import os
import pathlib
from typing import List, Tuple

# === Whitelist of safe, human-readable text/code/document extensions ===
# Edit this list to add/remove types as needed
INCLUDE_EXTENSIONS = {
    # Plain text & docs
    '.txt', '.md', '.rst', '.csv', '.tsv', '.json', '.yaml', '.yml', '.xml', '.ini', '.cfg', '.log', '.docx', '.rtf', '.env', '.conf', '.properties',
    # Code
    '.py', '.js', '.ts', '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.go', '.rb', '.sh', '.bat', '.ps1', '.toml', '.html', '.htm', '.css', '.scss', '.less', '.php', '.pl', '.swift', '.kt', '.rs', '.m', '.scala', '.vb', '.dart', '.sql', '.r', '.jl', '.lua', '.asm',
    # Jupyter
    '.ipynb'
}
# === Blacklist of extensions that are always excluded (binary, encoded, media, machine code, etc) ===
EXCLUDE_EXTENSIONS = {
    '.enc', '.pdf', '.exe', '.dll', '.so', '.app', '.dmg', '.pkg', '.deb', '.rpm', '.zip', '.gz', '.tar', '.rar', '.7z', '.bin', '.dat', '.o', '.obj', '.a', '.lib', '.class', '.jar', '.apk', '.ipa', '.iso', '.img', '.dmg', '.pkl', '.db', '.sqlite', '.mp3', '.wav', '.flac', '.ogg', '.mp4', '.avi', '.mov', '.mkv', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.ico', '.svg', '.bz2', '.xz'
}

BINARY_EXTENSIONS = {
    '.exe', '.dll', '.so', '.app', '.dmg', '.pkg', '.deb', '.rpm', '.zip', '.gz', '.tar', '.rar', '.7z',
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.mp3', '.wav', '.aac', '.flac', '.ogg',
    '.mp4', '.avi', '.mov', '.mkv', '.wmv'
} # Kept for legacy, but now only INCLUDE_EXTENSIONS matter.

def scan_directory(input_path: pathlib.Path) -> Tuple[List[pathlib.Path], dict]:
    """
    Recursively scan directory, filter files, skip binaries/symlinks.
    Returns (list_of_files, directory_structure_dict)
    """
    files = []
    dir_struct = {}
    skipped_files = []  # For summary logging
    def _scan_dir(cur_path, cur_struct):
        for entry in cur_path.iterdir():
            if entry.is_symlink():
                cur_struct[entry.name] = {'processed': False, 'skipped': 'symlink'}
                continue
            # Always skip any .venv directory for privacy/security reasons
            if entry.is_dir():
                if entry.name == '.venv':
                    cur_struct[entry.name] = {'processed': False, 'skipped': '.venv'}
                    continue
                cur_struct[entry.name] = {}
                _scan_dir(entry, cur_struct[entry.name])
            elif entry.is_file():
                ext = entry.suffix.lower()
                # Only allow specific plain text/code/document files
                if ext in EXCLUDE_EXTENSIONS:
                    cur_struct[entry.name] = {'processed': False, 'skipped': 'explicitly_excluded'}
                    skipped_files.append((str(entry), 'explicitly_excluded'))
                elif ext in INCLUDE_EXTENSIONS:
                    cur_struct[entry.name] = {'processed': True, 'rel_path': str(entry.relative_to(input_path))}
                    files.append(entry)
                else:
                    cur_struct[entry.name] = {'processed': False, 'skipped': 'not_plaintext'}
                    skipped_files.append((str(entry), 'not_plaintext'))
    _scan_dir(input_path, dir_struct)
    # Print a summary of skipped files (optional, can be removed or redirected to a logger)
    if skipped_files:
        print(f"[LMTokenCook] Skipped {len(skipped_files)} files not suitable for plain text processing:")
        for fname, reason in skipped_files[:10]:
            print(f"  - {fname} [{reason}]")
        if len(skipped_files) > 10:
            print(f"  ...and {len(skipped_files)-10} more.")
    return files, dir_struct
