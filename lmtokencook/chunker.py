import pathlib
from typing import List, Dict, Any
import tiktoken


def serving_lines(
    lines: list,
    output_dir: pathlib.Path,
    serving_size: int,
    encoding_name: str = "cl100k_base"
) -> int:
    """
    Splits a list of lines into serving_XXX.txt files based on token count.
    Returns the number of chunks created.
    """
    import tiktoken
    enc = tiktoken.get_encoding(encoding_name)
    serving_number = 1
    current_serving_tokens = 0
    current_serving_lines = []
    serving_files = []
    # Count how many chunks there will be
    temp_serving_tokens = 0
    temp_serving_count = 1
    for line in lines:
        line_tokens = len(enc.encode(line))
        if temp_serving_tokens + line_tokens > serving_size and temp_serving_tokens > 0:
            temp_serving_count += 1
            temp_serving_tokens = 0
        temp_serving_tokens += line_tokens
    total_chunks = temp_serving_count
    # Actual chunking
    serving_number = 1
    current_serving_tokens = 0
    current_serving_lines = []
    for line in lines:
        line_tokens = len(enc.encode(line))
        if current_serving_tokens + line_tokens > serving_size and current_serving_tokens > 0:
            serving_path = output_dir / f"serving_{serving_number}_of_{total_chunks}.txt"
            with open(serving_path, "w", encoding="utf-8") as f:
                if serving_number < total_chunks:
                    comment = f"# [LMTokenCook] This is chunk {serving_number} of {total_chunks}. Do not respond yet, more chunks are coming."
                else:
                    comment = f"# [LMTokenCook] This is chunk {serving_number} of {total_chunks}. This is everything. Make an index of all the information you’ve been provided and summarize it. Ask me what I want to do now that we're on the same page thanks to LMTokenCook by DropShock Digital."
                f.write(comment + "\n")
                for l in current_serving_lines:
                    f.write(l + "\n")
                f.write(comment + "\n")
            serving_files.append(serving_path)
            serving_number += 1
            current_serving_lines = []
            current_serving_tokens = 0
        current_serving_lines.append(line)
        current_serving_tokens += line_tokens
    if current_serving_lines:
        serving_path = output_dir / f"serving_{serving_number}_of_{total_chunks}.txt"
        with open(serving_path, "w", encoding="utf-8") as f:
            if serving_number < total_chunks:
                comment = f"# [LMTokenCook] This is chunk {serving_number} of {total_chunks}. Do not respond yet, more chunks are coming."
            else:
                comment = f"# [LMTokenCook] This is chunk {serving_number} of {total_chunks}. This is everything. Make an index of all the information you’ve been provided and summarize it. Ask me what I want to do now that we're on the same page thanks to LMTokenCook by DropShock Digital."
            f.write(comment + "\n")
            for l in current_serving_lines:
                f.write(l + "\n")
            f.write(comment + "\n")
        serving_files.append(serving_path)
    return len(serving_files)

def serving_master_text(
    master_file: pathlib.Path,
    output_dir: pathlib.Path,
    serving_size: int,
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
    serving_number = 1
    current_serving_tokens = 0
    current_serving_lines = []
    serving_files = []
    def write_chunk(serving_number, lines, total_chunks):
        serving_path = output_dir / f"serving_{serving_number}_of_{total_chunks}.txt"
        with open(serving_path, "w", encoding="utf-8") as f:
            if serving_number < total_chunks:
                comment = f"# [LMTokenCook] This is chunk {serving_number} of {total_chunks}. Do not respond yet, more chunks are coming."
            else:
                comment = f"# [LMTokenCook] This is chunk {serving_number} of {total_chunks}. This is everything. Make an index of all the information you’ve been provided and summarize it. Ask me what I want to do now that we're on the same page thanks to LMTokenCook by DropShock Digital."
            f.write(comment + "\n")
            for l in lines:
                f.write(l + "\n")
            f.write(comment + "\n")
        serving_files.append(serving_path)

    # Read all lines from masterfile (preserve structure, do not filter or renumber)
    with open(master_file, "r", encoding="utf-8") as mf:
        file_lines = [line.rstrip("\n") for line in mf]

    # Count how many chunks there will be
    enc = tiktoken.get_encoding(encoding_name)
    temp_serving_tokens = 0
    temp_serving_count = 1
    for line in file_lines:
        line_tokens = len(enc.encode(line))
        if temp_serving_tokens + line_tokens > serving_size and temp_serving_tokens > 0:
            temp_serving_count += 1
            temp_serving_tokens = 0
        temp_serving_tokens += line_tokens
    total_chunks = temp_serving_count

    # Actual chunking
    serving_number = 1
    current_serving_tokens = 0
    current_serving_lines = []
    for line in file_lines:
        line_tokens = len(enc.encode(line))
        if current_serving_tokens + line_tokens > serving_size and current_serving_tokens > 0:
            write_chunk(serving_number, current_serving_lines, total_chunks)
            serving_number += 1
            current_serving_lines = []
            current_serving_tokens = 0
        current_serving_lines.append(line)
        current_serving_tokens += line_tokens
    if current_serving_lines:
        write_chunk(serving_number, current_serving_lines, total_chunks)
    return len(serving_files)

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

    # Servinging logic
    enc = tiktoken.get_encoding(encoding_name)
    serving_number = 1
    current_serving_tokens = 0
    current_serving_lines = []
    serving_files = []
    total_chunks = 0
    # First, count how many chunks there will be
    temp_serving_tokens = 0
    temp_serving_count = 1
    for line in file_lines:
        line_tokens = len(enc.encode(line))
        if temp_serving_tokens + line_tokens > serving_size and temp_serving_tokens > 0:
            temp_serving_count += 1
            temp_serving_tokens = 0
        temp_serving_tokens += line_tokens
    total_chunks = temp_serving_count
    # Now do the actual chunking
    for line in file_lines:
        line_tokens = len(enc.encode(line))
        if current_serving_tokens + line_tokens > serving_size and current_serving_tokens > 0:
            write_chunk(serving_number, current_serving_lines, total_chunks)
            serving_number += 1
            current_serving_lines = []
            current_serving_tokens = 0
        current_serving_lines.append(line)
        current_serving_tokens += line_tokens
    if current_serving_lines:
        write_chunk(serving_number, current_serving_lines, total_chunks)
    return len(serving_files)

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
            if current_serving_tokens + line_tokens > serving_size and current_serving_tokens > 0:
                # Write current chunk and start new one
                write_chunk(serving_number, current_serving_lines)
                serving_number += 1
                current_serving_lines = []
                current_serving_tokens = 0
            current_serving_lines.append(line)
            current_serving_tokens += line_tokens
    if current_serving_lines:
        write_chunk(serving_number, current_serving_lines)
    return len(serving_files)
