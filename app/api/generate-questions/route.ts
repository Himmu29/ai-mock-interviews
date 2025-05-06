// app/api/generate-questions/route.ts
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: Request) {
  try {
    // Extract inputs from the request body
    const { jobPosition, jobDescription, duration, selectedTypes } = await request.json();

    // Build the prompt for Gemini
    const prompt = `You are an interview assistant.
Generate exactly five concise interview questions for the role "${jobPosition}".
Job description: ${jobDescription}.
Focus areas: ${selectedTypes.join(', ')}.
Interview duration: ${duration} minutes.

Respond ONLY with a valid JSON array of strings.
Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;

    // Call Gemini via the AI SDK
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt,
      temperature: 0.7,
      maxTokens: 256,
    });

    let questions: string[];

    // Try parsing as JSON
    try {
      questions = JSON.parse(text);
    } catch (err) {
      // Fallback: extract array-like content using regex
      const match = text.match(/\[[\s\S]*?\]/);
      if (match) {
        try {
          questions = JSON.parse(match[0]);
        } catch {
          console.error('Failed to parse extracted JSON:', match[0]);
          throw new Error('Extracted content is not valid JSON.');
        }
      } else {
        console.error('Gemini returned unstructured response:', text);
        throw new Error('Failed to parse questions from AI response.');
      }
    }

    // Return the generated questions
    return NextResponse.json({ questions });

  } catch (error: any) {
    console.error('Generate-questions error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
