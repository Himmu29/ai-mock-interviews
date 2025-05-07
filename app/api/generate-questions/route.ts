// app/api/generate-questions/route.ts
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: Request) {
  try {
    const { jobPosition, jobDescription, selectedTypes, numQuestions } = await request.json();

    // Prompt now asks for detailed, multi-sentence answers
    const prompt = `You are an expert interview coach.
Generate exactly ${numQuestions} interview questions for the role "${jobPosition}" based on this job description:
${jobDescription}
Focus areas: ${selectedTypes.join(', ')}.

For each question, provide a thorough, detailed answer of at least three sentences, explaining key concepts, best practices, and potential pitfalls.

Respond ONLY with a JSON array of objects, each object having "question" and "answer". Example format:

[
  {
    "question": "What is X?",
    "answer": "X is... (at least three sentences of detailed explanation)"
  },
  ...
]`;

    // Give the model more room to elaborate
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt,
      temperature: 0.7,
      maxTokens: 1024,
    });

    // Try to parse the full JSON output
    let qaPairs: { question: string; answer: string }[];
    try {
      qaPairs = JSON.parse(text);
    } catch {
      // Fallback extraction of the JSON array
      const match = text.match(/\[\s*(?:{[\s\S]*?},?\s*)+\]/);
      if (match) {
        try {
          qaPairs = JSON.parse(match[0]);
        } catch (parseErr) {
          console.error('Failed to parse extracted JSON:', match[0]);
          throw new Error('Extracted content is not valid JSON.');
        }
      } else {
        console.error('Raw Gemini output:', text);
        throw new Error(`Could not parse AI response as JSON. Raw output: ${text}`);
      }
    }

    return NextResponse.json({ questions: qaPairs });
  } catch (error: any) {
    console.error('Generate-questions error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
