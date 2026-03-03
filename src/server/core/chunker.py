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



def count_tokens(text: str, encoding_name: str = "cl100k_base") -> int:
    import tiktoken
    enc = tiktoken.get_encoding(encoding_name)
    return len(enc.encode(text))
