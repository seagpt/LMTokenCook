import { getEncoding } from "js-tiktoken";

export interface CookConfig {
    chunkSize: number;
    encodingName: "cl100k_base" | "p50k_base";
    addLineNumbers?: boolean;
    skipEmptyLines?: boolean;
}

export interface ProcessingStats {
    filesProcessed: number;
    totalTokens: number;
    chunksCreated: number;
}

const enc = getEncoding("cl100k_base");

// Helper to counting tokens without chunking (for File Map)
export function countTokens(text: string): number {
    return enc.encode(text).length;
}

export async function processFileContent(
    content: string,
    config: CookConfig
): Promise<string[]> {
    if (!content) return [];

    // 1. Split lines
    let lines = content.split('\n');

    // 2. Filter Empty Lines ?
    if (config.skipEmptyLines) {
        lines = lines.filter((line: string) => line.trim().length > 0);
    }

    // 3. Add Line Numbers ? (Must be done BEFORE token counting to be accurate)
    if (config.addLineNumbers) {
        lines = lines.map((line, idx) => {
            const lineNum = (idx + 1).toString().padStart(4, '0');
            return `${lineNum}: ${line}`;
        });
    }

    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentTokens = 0;

    for (const line of lines) {
        const tokens = enc.encode(line).length;

        // Check if adding this line exceeds chunk size
        // Note: We add +1 token for newline character usually, but line-based split consumes it?
        // tiktoken encodes raw string. If we join with \n later, we should account for \n tokens.
        // '\n' is 1 token in cl100k_base.
        const newlineTokenCount = 1;

        if (currentTokens + tokens + newlineTokenCount > config.chunkSize && currentTokens > 0) {
            chunks.push(currentChunk.join('\n'));
            currentChunk = [];
            currentTokens = 0;
        }

        currentChunk.push(line);
        currentTokens += tokens + newlineTokenCount;
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n'));
    }

    return chunks;
}
