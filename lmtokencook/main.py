import argparse
import pathlib
import shutil
import sys
from lmtokencook.scanner import scan_directory
from lmtokencook.extractors import get_extractor, ExtractionError
from lmtokencook.manifest import build_manifest_metadata, write_manifest
from lmtokencook.chunker import chunk_master_text
import tiktoken
import os
import json
from datetime import datetime

import threading

class CancelledError(Exception):
    pass

def run_lmtokencook(input_path, output_path, chunk_size=28000, progress_callback=None, cancel_flag=None, keep_masterfile=False, add_line_numbers=False, skip_empty_lines=False):
    input_path = pathlib.Path(input_path)
    output_base = pathlib.Path(output_path)

    # Validate input
    if not input_path.exists():
        raise FileNotFoundError(f"Input path does not exist: {input_path}")
    if not output_base.exists():
        output_base.mkdir(parents=True, exist_ok=True)

    # Create unique output subdir
    input_name = input_path.stem if input_path.is_file() else input_path.name
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    output_subdir = output_base / f"{input_name}_LMTC_Output_{timestamp}"
    output_subdir.mkdir(exist_ok=True)

    # Scan files
    if progress_callback:
        progress_callback("Scanning pantry for ingredients...")
    if input_path.is_dir():
        files, dir_struct = scan_directory(input_path)
    else:
        files = [input_path]
        dir_struct = {input_path.name: {"processed": True, "rel_path": input_path.name}}
    scan_counts = {
        "scanned": len(files),
        "processed": 0,
        "skipped_binary": 0,
        "skipped_symlink": 0,
        "failed_extraction": 0,
        "estimated_tokens": 0,
    }
    processed_files = []
    # Calculate total token count for all files (for master file naming)
    enc = tiktoken.get_encoding("cl100k_base")
    total_tokens = 0
    temp_file_tokens = []
    for f in files:
        ext = f.suffix.lower()
        extractor = get_extractor(ext)
        try:
            text = extractor.extract(f)
            tokens = len(enc.encode(text))
            total_tokens += tokens
            temp_file_tokens.append(tokens)
        except Exception:
            temp_file_tokens.append(0)
    master_lines = []
    char_offset = 0
    file_metadata = []
    # Write directory tree as Ingredients (in-memory)
    master_lines.append("=== Ingredients (Directory Tree) ===")
    def _print_tree(d, prefix=""):
        for k, v in d.items():
            rel = v.get("rel_path", k)
            master_lines.append(f"{prefix}{rel}")
            if "children" in v:
                _print_tree(v["children"], prefix + "  ")
    _print_tree(dir_struct)
    master_lines.append("")
    # Process each file
    for idx, f in enumerate(files):
        if cancel_flag is not None and cancel_flag.is_set():
            if progress_callback:
                progress_callback("Cooking cancelled by chef!")
            raise CancelledError("Processing was cancelled by user.")
        rel_path = str(f.relative_to(input_path.parent if input_path.is_file() else input_path))
        abs_path = str(f.resolve())
        ext = f.suffix.lower()
        extractor = get_extractor(ext)
        try:
            text = extractor.extract(f)
            if not text.strip():
                raise ExtractionError("No text extracted.")
            tokens = len(enc.encode(text))
            scan_counts["processed"] += 1
            scan_counts["estimated_tokens"] += tokens
            # Write file start marker
            master_lines.append(f"{abs_path}")
            allowed = set(map(chr, range(32, 127)))
            lines = text.splitlines()
            filtered_lines = []
            for line in lines:
                if not all(c in allowed for c in line):
                    continue
                if skip_empty_lines and not line.strip():
                    continue
                filtered_lines.append(line)
            if add_line_numbers:
                for i, line in enumerate(filtered_lines, start=1):
                    master_lines.append(f"{i}\t{line}")
            else:
                for line in filtered_lines:
                    master_lines.append(line)
            master_lines.append(f"\n=== File End: {abs_path} ===\n")
            char_start = char_offset
            char_offset += len(text)
            processed_files.append({
                "relative_path": rel_path,
                "absolute_path": abs_path,
                "char_start_offset": char_start,
                "char_end_offset": char_offset,
                "char_count": char_offset - char_start,
                "estimated_tokens": tokens,
                "extraction_status": "Success",
                "encoding_used": "utf-8"
            })
            file_metadata.append({
                "absolute_path": abs_path,
                "tokens": tokens,
                "start_marker": f"{abs_path}\n",
                "end_marker": f"\n=== File End: {abs_path} ===\n\n",
                "content": text
            })
            if progress_callback:
                progress_callback(f"[COOK] {abs_path} ({tokens} tokens)", idx+1, len(files))
        except ExtractionError as e:
            scan_counts["failed_extraction"] += 1
            processed_files.append({
                "relative_path": rel_path,
                "absolute_path": abs_path,
                "extraction_status": f"Error: {e}",
                "encoding_used": None
            })
            if progress_callback:
                progress_callback(f"[BURNT] {abs_path}: {e}")
        except Exception as e:
            scan_counts["failed_extraction"] += 1
            processed_files.append({
                "relative_path": rel_path,
                "absolute_path": abs_path,
                "extraction_status": f"Error: {e}",
                "encoding_used": None
            })
            if progress_callback:
                progress_callback(f"[BURNT] {abs_path}: {e}")

    # After all content prep, calculate the true token count of the finalized master_lines
    enc = tiktoken.get_encoding("cl100k_base")
    master_content = "\n".join(master_lines)
    total_tokens = len(enc.encode(master_content))

    # Servinging
    chunking = {"enabled": False, "threshold": chunk_size, "created": 0}
    if total_tokens > chunk_size:
        if progress_callback:
            progress_callback("Serving dish into portions...")
        # Write masterfile.txt only if keep_masterfile is True
        master_path = output_subdir / f"masterfile.t-{total_tokens}.txt"
        if keep_masterfile:
            with open(master_path, "w", encoding="utf-8") as master_f:
                for line in master_lines:
                    master_f.write(line + "\n")
        # Serving directly from in-memory lines
        from lmtokencook.chunker import chunk_lines
        num_chunks = chunk_lines(master_lines, output_subdir, chunk_size)
        chunking = {"enabled": True, "threshold": chunk_size, "created": num_chunks}
        if not keep_masterfile:
            if progress_callback:
                progress_callback(f"Servinged into {num_chunks} files. master_content.txt not written.")
        else:
            if progress_callback:
                progress_callback(f"Servinged into {num_chunks} files. master_content.txt kept.")
    else:
        # Only write masterfile.txt if not chunking or keep_masterfile is True
        master_path = output_subdir / f"masterfile.t-{total_tokens}.txt"
        with open(master_path, "w", encoding="utf-8") as master_f:
            for line in master_lines:
                master_f.write(line + "\n")
        if progress_callback:
            progress_callback("Servinging not required.")

    # Manifest
    metadata = build_manifest_metadata(input_path, output_subdir.name, scan_counts, chunking)
    manifest_path = output_subdir / "manifest.json"
    write_manifest(manifest_path, metadata, dir_struct, processed_files)
    if progress_callback:
        progress_callback(f"Manifest written to {manifest_path}", len(files), len(files))
        progress_callback(f"Done. Output in {output_subdir}", len(files), len(files))
    return {
        "output_dir": str(output_subdir),
        "manifest_path": str(manifest_path),
        "scan_counts": scan_counts,
        "chunking": chunking
    }

# CLI wrapper remains for CLI usage

def main():
    parser = argparse.ArgumentParser(description="LMTokenCook Backend Prototype")
    parser.add_argument("--input", required=True, help="Input file or directory path")
    parser.add_argument("--output", required=True, help="Output directory path")
    parser.add_argument("--chunk-size", type=int, default=28000, help="Token serving size threshold")
    args = parser.parse_args()
    try:
        run_lmtokencook(args.input, args.output, args.chunk_size, progress_callback=print)
    except Exception as e:
        print(f"ERROR: {e}")


if __name__ == "__main__":
    main()
