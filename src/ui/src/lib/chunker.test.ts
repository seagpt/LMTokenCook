import { describe, it, expect } from 'vitest';
import { processFileContent, countTokens } from './chunker';

describe('chunker v2', () => {

    it('should process empty content', async () => {
        const chunks = await processFileContent('', { chunkSize: 100, encodingName: 'cl100k_base' });
        expect(chunks).toEqual([]);
    });

    it('should skip empty lines if enabled', async () => {
        const content = "Line 1\n\nLine 2\n   \nLine 3";
        const chunks = await processFileContent(content, {
            chunkSize: 100,
            encodingName: 'cl100k_base',
            skipEmptyLines: true
        });
        // Should be just "Line 1\nLine 2\n   \nLine 3" -> Wait, checks trim().length > 0
        // "   " trims to empty.
        // So "Line 1", "Line 2", "Line 3".
        // Joined by newline.
        expect(chunks[0]).toBe("Line 1\nLine 2\nLine 3");
    });

    it('should add line numbers', async () => {
        const content = "A\nB";
        const chunks = await processFileContent(content, {
            chunkSize: 100,
            encodingName: 'cl100k_base',
            addLineNumbers: true
        });
        expect(chunks[0]).toBe("0001: A\n0002: B");
    });

    it('should split correctly with line numbers added', async () => {
        // Small chunk size to force split after numbering increases size
        const content = "Line1\nLine2";
        // "0001: Line1" -> ~4-5 tokens?
        // "0002: Line2" 
        const chunks = await processFileContent(content, {
            chunkSize: 5, // Very small
            encodingName: 'cl100k_base',
            addLineNumbers: true
        });
        expect(chunks.length).toBeGreaterThan(1);
    });

    it('should count tokens correctly', () => {
        const count = countTokens("hello world");
        expect(count).toBeGreaterThan(0);
    });
});
