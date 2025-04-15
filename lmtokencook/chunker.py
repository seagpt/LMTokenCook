import pathlib
from typing import List, Dict, Any
import tiktoken


def chunk_lines(
    lines: list,
    output_dir: pathlib.Path,
    chunk_size: int,
    encoding_name: str = "cl100k_base"
) -> int:
    """
    Splits a list of lines into chunk_XXX.txt files based on token count.
    Returns the number of chunks created.
    """
    import tiktoken
    enc = tiktoken.get_encoding(encoding_name)
    chunk_number = 1
    current_chunk_tokens = 0
    current_chunk_lines = []
    chunk_files = []
    # Count how many chunks there will be
    temp_chunk_tokens = 0
    temp_chunk_count = 1
    for line in lines:
        line_tokens = len(enc.encode(line))
        if temp_chunk_tokens + line_tokens > chunk_size and temp_chunk_tokens > 0:
            temp_chunk_count += 1
            temp_chunk_tokens = 0
        temp_chunk_tokens += line_tokens
    total_chunks = temp_chunk_count
    # Actual chunking
    chunk_number = 1
    current_chunk_tokens = 0
    current_chunk_lines = []
    for line in lines:
        line_tokens = len(enc.encode(line))
        if current_chunk_tokens + line_tokens > chunk_size and current_chunk_tokens > 0:
            chunk_path = output_dir / f"chunk_{chunk_number}_of_{total_chunks}.txt"
            with open(chunk_path, "w", encoding="utf-8") as f:
                if chunk_number < total_chunks:
                    comment = f"# [LMTokenCook] This is chunk {chunk_number} of {total_chunks}. Do not respond yet, more chunks are coming."
                else:
                    comment = f"# [LMTokenCook] This is chunk {chunk_number} of {total_chunks}. This is everything. Make an index of all the information you’ve been provided and summarize it. Ask me what I want to do now that we're on the same page thanks to LMTokenCook by DropShock Digital."
                f.write(comment + "\n")
                for l in current_chunk_lines:
                    f.write(l + "\n")
                f.write(comment + "\n")
            chunk_files.append(chunk_path)
            chunk_number += 1
            current_chunk_lines = []
            current_chunk_tokens = 0
        current_chunk_lines.append(line)
        current_chunk_tokens += line_tokens
    if current_chunk_lines:
        chunk_path = output_dir / f"chunk_{chunk_number}_of_{total_chunks}.txt"
        with open(chunk_path, "w", encoding="utf-8") as f:
            if chunk_number < total_chunks:
                comment = f"# [LMTokenCook] This is chunk {chunk_number} of {total_chunks}. Do not respond yet, more chunks are coming."
            else:
                comment = f"# [LMTokenCook] This is chunk {chunk_number} of {total_chunks}. This is everything. Make an index of all the information you’ve been provided and summarize it. Ask me what I want to do now that we're on the same page thanks to LMTokenCook by DropShock Digital."
            f.write(comment + "\n")
            for l in current_chunk_lines:
                f.write(l + "\n")
            f.write(comment + "\n")
        chunk_files.append(chunk_path)
    return len(chunk_files)

def chunk_master_text(
    master_file: pathlib.Path,
    output_dir: pathlib.Path,
    chunk_size: int,
    file_metadata: list,
    encoding_name: str = "cl100k_base",
    add_line_numbers: bool = False,
    skip_empty_lines: bool = False
) -> int:
    """
    Splits masterfile.txt into serving_XXX.txt files based on token count, using file_metadata for markers.
    Returns the number of servings created.
    """
    enc = tiktoken.get_encoding(encoding_name)
    chunk_number = 1
    current_chunk_tokens = 0
    current_chunk_lines = []
    chunk_files = []
    def write_chunk(chunk_number, lines, total_chunks):
        chunk_path = output_dir / f"chunk_{chunk_number}_of_{total_chunks}.txt"
        with open(chunk_path, "w", encoding="utf-8") as f:
            if chunk_number < total_chunks:
                comment = f"# [LMTokenCook] This is chunk {chunk_number} of {total_chunks}. Do not respond yet, more chunks are coming."
            else:
                comment = f"# [LMTokenCook] This is chunk {chunk_number} of {total_chunks}. This is everything. Make an index of all the information you’ve been provided and summarize it. Ask me what I want to do now that we're on the same page thanks to LMTokenCook by DropShock Digital."
            f.write(comment + "\n")
            for l in lines:
                f.write(l + "\n")
            f.write(comment + "\n")
        chunk_files.append(chunk_path)

    # Read all lines from masterfile (preserve structure, do not filter or renumber)
    with open(master_file, "r", encoding="utf-8") as mf:
        file_lines = [line.rstrip("\n") for line in mf]

    # Count how many chunks there will be
    enc = tiktoken.get_encoding(encoding_name)
    temp_chunk_tokens = 0
    temp_chunk_count = 1
    for line in file_lines:
        line_tokens = len(enc.encode(line))
        if temp_chunk_tokens + line_tokens > chunk_size and temp_chunk_tokens > 0:
            temp_chunk_count += 1
            temp_chunk_tokens = 0
        temp_chunk_tokens += line_tokens
    total_chunks = temp_chunk_count

    # Actual chunking
    chunk_number = 1
    current_chunk_tokens = 0
    current_chunk_lines = []
    for line in file_lines:
        line_tokens = len(enc.encode(line))
        if current_chunk_tokens + line_tokens > chunk_size and current_chunk_tokens > 0:
            write_chunk(chunk_number, current_chunk_lines, total_chunks)
            chunk_number += 1
            current_chunk_lines = []
            current_chunk_tokens = 0
        current_chunk_lines.append(line)
        current_chunk_tokens += line_tokens
    if current_chunk_lines:
        write_chunk(chunk_number, current_chunk_lines, total_chunks)
    return len(chunk_files)

    import string
    allowed = set(map(chr, range(32, 127)))
    with open(master_file, "r", encoding="utf-8") as mf:
        file_lines = mf.readlines()
    filtered_lines = []
    for idx, line in enumerate(file_lines, 1):
        line = line.rstrip("\n")
        if not all(c in allowed for c in line):
            continue
        if skip_empty_lines and not line.strip():
            continue
        if add_line_numbers:
            filtered_lines.append(f"{idx:04d} {line}")
        else:
            filtered_lines.append(line)
    file_lines = filtered_lines

    # Chunking logic
    enc = tiktoken.get_encoding(encoding_name)
    chunk_number = 1
    current_chunk_tokens = 0
    current_chunk_lines = []
    chunk_files = []
    total_chunks = 0
    # First, count how many chunks there will be
    temp_chunk_tokens = 0
    temp_chunk_count = 1
    for line in file_lines:
        line_tokens = len(enc.encode(line))
        if temp_chunk_tokens + line_tokens > chunk_size and temp_chunk_tokens > 0:
            temp_chunk_count += 1
            temp_chunk_tokens = 0
        temp_chunk_tokens += line_tokens
    total_chunks = temp_chunk_count
    # Now do the actual chunking
    for line in file_lines:
        line_tokens = len(enc.encode(line))
        if current_chunk_tokens + line_tokens > chunk_size and current_chunk_tokens > 0:
            write_chunk(chunk_number, current_chunk_lines, total_chunks)
            chunk_number += 1
            current_chunk_lines = []
            current_chunk_tokens = 0
        current_chunk_lines.append(line)
        current_chunk_tokens += line_tokens
    if current_chunk_lines:
        write_chunk(chunk_number, current_chunk_lines, total_chunks)
    return len(chunk_files)

    import string
    allowed = set(map(chr, range(32, 127)))
    with open(master_file, "r", encoding="utf-8") as mf:
        file_lines = mf.readlines()
    filtered_lines = []
    for idx, line in enumerate(file_lines, 1):
        line = line.rstrip("\n")
        if not all(c in allowed for c in line):
            continue
        if skip_empty_lines and not line.strip():
            continue
        if add_line_numbers:
            filtered_lines.append(f"{idx:04d} {line}")
        else:
            filtered_lines.append(line)
    file_lines = filtered_lines
    for file_info in file_metadata:
        # Write file start marker
        start_marker = file_info["start_marker"]
        end_marker = file_info["end_marker"]
        content = file_info["content"]
        file_lines = [start_marker, content, end_marker]
        # Split content into lines for token counting
        for line in file_lines:
            line_tokens = len(enc.encode(line))
            if current_chunk_tokens + line_tokens > chunk_size and current_chunk_tokens > 0:
                # Write current chunk and start new one
                write_chunk(chunk_number, current_chunk_lines)
                chunk_number += 1
                current_chunk_lines = []
                current_chunk_tokens = 0
            current_chunk_lines.append(line)
            current_chunk_tokens += line_tokens
    if current_chunk_lines:
        write_chunk(chunk_number, current_chunk_lines)
    return len(chunk_files)
