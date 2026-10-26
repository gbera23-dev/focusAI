import { describe, expect, it } from 'vitest';
import { generateContent } from '../../../shared/api/geminiApi';

const runLiveTest = process.env.RUN_GEMINI_LIVE_TEST === 'true' ? it : it.skip;

describe('Gemini API live smoke test', () => {
  runLiveTest('accepts a prompt with the configured API key', async () => {
    const response = await generateContent('Reply with exactly: Gemini API is responsive.');
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    expect(text).toEqual(expect.any(String));
    expect(text.length).toBeGreaterThan(0);
  }, 30_000);
});
