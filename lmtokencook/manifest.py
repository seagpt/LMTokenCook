import json
import pathlib
from typing import List, Dict, Any
from datetime import datetime

def build_manifest_metadata(input_path: pathlib.Path, output_subdir: str, scan_counts: dict, chunking: dict) -> dict:
    return {
        "input_path": str(input_path.resolve()),
        "output_subdirectory": output_subdir,
        "processing_timestamp_utc": datetime.utcnow().isoformat() + "Z",
        "total_files_scanned": scan_counts.get("scanned", 0),
        "total_files_processed": scan_counts.get("processed", 0),
        "total_files_skipped_binary": scan_counts.get("skipped_binary", 0),
        "total_files_skipped_symlink": scan_counts.get("skipped_symlink", 0),
        "total_files_failed_extraction": scan_counts.get("failed_extraction", 0),
        "total_estimated_tokens": scan_counts.get("estimated_tokens", 0),
        "chunking_enabled": chunking.get("enabled", False),
        "chunk_size_threshold": chunking.get("threshold", 0),
        "chunks_created": chunking.get("created", 0)
    }

def write_manifest(
    output_path: pathlib.Path,
    metadata: dict,
    directory_structure: dict,
    processed_files: List[Dict[str, Any]]
):
    manifest = {
        "metadata": metadata,
        "directory_structure": directory_structure,
        "processed_files": processed_files
    }
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
