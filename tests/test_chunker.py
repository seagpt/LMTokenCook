import unittest
from unittest.mock import MagicMock, patch
import tempfile
import shutil
import pathlib
from src.server.core.chunker import serving_lines

class TestChunker(unittest.TestCase):

    def setUp(self):
        self.test_dir = tempfile.mkdtemp()
        self.output_dir = pathlib.Path(self.test_dir)
    
    def tearDown(self):
        shutil.rmtree(self.test_dir)

    def test_serving_lines_basic(self):
        # Mock tiktoken so "hello" is 1 token or length based
        with patch('tiktoken.get_encoding') as mock_enc:
            mock_encoding = MagicMock()
            # Simple mock: 1 char = 1 token for predictable math
            mock_encoding.encode.side_effect = lambda s: [0] * len(s)
            mock_enc.return_value = mock_encoding
            
            lines = ["a" * 50, "b" * 60] # 50 tokens, 60 tokens
            
            # Serving size 70. 
            # Chunk 1: "a"*50 (50) -> OK. Next "b"*60 (60). Total 110 > 70.
            # So Chunk 1 = "a"*50.
            # Chunk 2 = "b"*60.
            
            count = serving_lines(lines, self.output_dir, serving_size=70)
            
            self.assertEqual(count, 2)
            
            files = sorted(list(self.output_dir.glob("serving_*.txt")))
            self.assertEqual(len(files), 2)
            
            # Verify content
            with open(files[0], 'r', encoding='utf-8') as f:
                content = f.read()
                self.assertIn("a" * 50, content)
                self.assertIn("This is chunk 1 of 2", content)

    def test_serving_lines_single_chunk(self):
         with patch('tiktoken.get_encoding') as mock_enc:
            mock_encoding = MagicMock()
            mock_encoding.encode.side_effect = lambda s: [0] * len(s)
            mock_enc.return_value = mock_encoding
            
            lines = ["a" * 10]
            count = serving_lines(lines, self.output_dir, serving_size=100)
            
            self.assertEqual(count, 1)
            files = list(self.output_dir.glob("serving_*.txt"))
            with open(files[0], 'r', encoding='utf-8') as f:
                content = f.read()
                self.assertIn("This is chunk 1 of 1", content)
                self.assertIn("This is everything", content)

if __name__ == '__main__':
    unittest.main()
