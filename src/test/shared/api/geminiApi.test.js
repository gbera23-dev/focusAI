import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateContent } from '../../../shared/api/geminiApi';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('generateContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-gemini-key');
    axios.post.mockResolvedValue({ data: { candidates: [] } });
  });

  it('sends the prompt in Gemini contents with the configured API key', async () => {
    const response = await generateContent('Explain closures simply.');

    expect(response).toEqual({ candidates: [] });
    expect(axios.post).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Explain closures simply.' }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'test-gemini-key',
        },
      },
    );
  });

  it('rejects empty prompts before making a request', async () => {
    await expect(generateContent('')).rejects.toThrow('non-empty prompt');
    expect(axios.post).not.toHaveBeenCalled();
  });
});
