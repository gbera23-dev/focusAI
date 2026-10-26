import axios from 'axios';

const DEFAULT_MODEL = 'gemini-3.8-flash';
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY;

const getGenerateContentUrl = (model) =>
  `${GEMINI_API_BASE_URL}/${model}:generateContent`;

export async function generateContent(prompt, { model = DEFAULT_MODEL } = {}) {
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
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
    },
  );

  return response.data;
}

export const geminiApiConfig = {
  defaultModel: DEFAULT_MODEL,
  baseUrl: GEMINI_API_BASE_URL,
};
