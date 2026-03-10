import { getEncoding } from 'js-tiktoken';

export function countTokens(text: string): number {
  try {
    const enc = getEncoding("cl100k_base");
    return enc.encode(text).length;
  } catch (e) {
    return Math.ceil(text.length / 4); // Fallback estimation
  }
}

export async function processFileContent(
  content: string,
  options: { chunkSize: number, encodingName: string, addLineNumbers: boolean, skipEmptyLines: boolean }
): Promise<string[]> {
  const lines = content.split('\n');
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (options.skipEmptyLines && line.trim() === '') continue;
    
    let processedLine = line;
    if (options.addLineNumbers) {
      processedLine = `${String(i + 1).padStart(4, '0')}: ${line}`;
    }
    processedLines.push(processedLine);
  }

  const chunks: string[] = [];
  let currentChunk = '';
  let currentTokens = 0;

  for (const line of processedLines) {
    const lineTokens = countTokens(line + '\n');
    
    if (currentTokens + lineTokens > options.chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = line + '\n';
      currentTokens = lineTokens;
    } else {
      currentChunk += line + '\n';
      currentTokens += lineTokens;
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks.length > 0 ? chunks : [content];
}
