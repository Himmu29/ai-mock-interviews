// app/api/summarizer/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { feedback } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return new NextResponse('GROQ API key not configured', { status: 500 });
    }

    const body = {
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI assistant specialized in summarizing text. Provide concise and accurate summaries.'
        },
        { role: 'user', content: feedback }
      ],
      stream: false
    };

    const apiRes = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify(body)
      }
    );

    if (!apiRes.ok) {
      const err = await apiRes.text();
      return new NextResponse(`Groq API error: ${err}`, {
        status: apiRes.status
      });
    }

    const { choices } = await apiRes.json();
    const summary = choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summarizer route error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
