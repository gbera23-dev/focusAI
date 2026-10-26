import axios from 'axios';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const REQUEST_TIMEOUT_MS = 30_000;
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY;

const getGenerateContentUrl = (model) =>
  `${GEMINI_API_BASE_URL}/${model}:generateContent`;

export async function generateContent(prompt, { model = DEFAULT_MODEL, signal } = {}) {
  if (!prompt || typeof prompt !== 'string') {
    throw new TypeError('A non-empty prompt is required.');
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured.');
  }

  const response = await axios.post(
    getGenerateContentUrl(model),
    {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      timeout: REQUEST_TIMEOUT_MS,
      ...(signal ? { signal } : {}),
    },
  );

  return response.data;
}

export const geminiApiConfig = {
  defaultModel: DEFAULT_MODEL,
  baseUrl: GEMINI_API_BASE_URL,
  timeoutMs: REQUEST_TIMEOUT_MS,
};
