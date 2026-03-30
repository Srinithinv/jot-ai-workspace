import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

export const rewriteText = async (text, tone) => {
  const prompt = `You are a world-class Editor. Rewrite the following text to sound ${tone}.
Return ONLY a strictly formatted JSON object matching this structure:
{
  "rewrittenText": "<The fully rewritten version of the entire text>",
  "suggestions": [
    {
      "original": "<A specific short phrase or word from the user's original text>",
      "suggestion": "<Your exact suggested replacement>",
      "reason": "<A brief 3-5 word reason on why changed (e.g., 'More professional', 'Better flow')>"
    }
  ]
}
Make sure to include at least 1 or 2 specific word-level or phrase-level suggestions.
Do NOT return markdown formatting (no \`\`\`json), just the raw JSON object.

Text: "${text}"`;

  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  const rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(rawText);
};

export const humanizeText = async (text, burstinessLevel) => {
  const prompt = `Humanize this text to bypass AI detectors. Use a burstiness level corresponding to ${burstinessLevel}% (100% means extremely varied sentence lengths, natural phrasing, and human tone). Just return the humanized text directly without extra commentary.\n\nText:\n"${text}"`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return response.text;
};

// --- THE 5 NEW APIS ---
export const expandText = async (text) => {
  const prompt = `You are an expert AI Content Expander. Take the following short text and expand it into a beautifully detailed, professional paragraph with examples and rich vocabulary. Return ONLY the expanded text, no markdown formatting.\n\nText:\n"${text}"`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return response.text.trim();
};

export const detectTone = async (text) => {
  const prompt = `You are an expert Emotional Tone Analyzer. Analyze the following text and return the top 3 dominant tones/emotions as a strictly formatted JSON array. The percentages MUST sum to 100.
Return ONLY this exact JSON format:
[
  { "tone": "Professional", "percentage": 70 },
  { "tone": "Enthusiastic", "percentage": 20 },
  { "tone": "Aggressive", "percentage": 10 }
]
Do NOT return markdown formatting, just the raw JSON array.

Text: "${text}"`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  const rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(rawText);
};

export const autoComplete = async (text) => {
  const prompt = `You are an expert Ghostwriter. Read the following text, understand its context and flow, and seamlessly generate the next 3 sentences to continue it. Return ONLY the generated continuation text, no markdown formatting, no commentary.\n\nText:\n"${text}"`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return response.text.trim();
};

export const analyzeReadability = async (text) => {
  const prompt = `You are an expert Readability Analyzer. Analyze the following text's reading level, complexity, and flow.
Return ONLY a strictly formatted JSON object matching this structure:
{
  "score": <a number from 0 to 100 where 100 is extremely easy to read>,
  "level": "<A short string like '8th Grade', 'College Level', or 'Professional'>",
  "feedback": "<A short 1-sentence tip on how to improve readability>"
}
Do NOT return markdown formatting (no \`\`\`json), just the raw JSON object.

Text: "${text}"`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  const rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(rawText);
};

export const optimizeSEO = async (text) => {
  const prompt = `You are an expert SEO Optimizer. Analyze the following text and generate SEO metadata to help it rank.
Return ONLY a strictly formatted JSON object matching this structure:
{
  "title": "<A catchy, click-worthy SEO Meta Title (max 60 chars)>",
  "description": "<An engaging SEO Meta Description (max 160 chars)>",
  "keywords": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"]
}
Do NOT return markdown formatting (no \`\`\`json), just the raw JSON object.

Text: "${text}"`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  const rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(rawText);
};

// --- REMAINDER APIS ---

export const checkOriginality = async (text) => {
  const prompt = `You are an elite Plagiarism Detection Engine. Analyze the following text and simulate a realistic plagiarism report. 
Respond ONLY with a strictly formatted JSON object matching this structure:
{
  "originalityScore": <a number between 0 and 100 representing how unique the text is>,
  "recommendation": "<A short, punchy 3-5 word verdict predicting risk. E.g., '100% Safe to Publish'>",
  "matches": [
    {
      "text": "<a short specific sentence from the text that matched generic info>",
      "source": "<a realistic-looking URL where it might have been found like wikipedia or a blog>",
      "percentage": <matched percentage for this single fragment>
    }
  ]
}
If the text is incredibly unique, return an originalityScore between 95-100, a safe recommendation, and an empty matches array [].
Do NOT return markdown formatting (no \`\`\`json), just the raw JSON object.

Text: "${text}"`;

  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  const rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(rawText);
};

export const checkGrammar = async (text) => {
  const prompt = `You are an expert Grammar Checker. Analyze the following text for spelling mistakes, grammatical errors, and awkward phrasing.
Return ONLY a strictly formatted JSON object matching this structure:
{
  "issues": [
    {
      "original": "<the exact incorrect word or short phrase from the text>",
      "suggestion": "<the corrected word or phrase>",
      "explanation": "<A short 3-5 word explanation, like 'Spelling error', 'Incorrect verb tense', 'Awkward phrasing'>"
    }
  ]
}
If there are no issues, return {"issues": []}.
Do NOT return markdown formatting (no \`\`\`json), just the raw JSON object.

Text: "${text}"`;

  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  const rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(rawText);
};

export const summarizeText = async (text, length) => {
  const prompt = `You are an expert Summarizer. Summarize the following text. Make it a ${length} summary. Return ONLY the summarized text, no markdown formatting.\n\nText:\n"${text}"`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return response.text.trim();
};

export const translateText = async (text, language) => {
  const prompt = `You are an expert Translator. Translate the following text into ${language}. Return ONLY the translated text, no markdown formatting.\n\nText:\n"${text}"`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return response.text.trim();
};

export const magicFormat = async (text) => {
  const prompt = `Take this text and format it beautifully. Automatically separate logical chunks into detailed paragraphs, add informative H2 (<h2>) and H3 (<h3>) headings where appropriate, and use bullet points (<ul><li>) if there are lists. Ensure it reads like a premium, well-structured article. Return ONLY raw valid HTML logic restricted strictly to <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>. Do NOT use markdown or any \`\`\`html code wrappers.\n\nText:\n"${text}"`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return response.text.replace(/```html/g, '').replace(/```/g, '').trim();
};
