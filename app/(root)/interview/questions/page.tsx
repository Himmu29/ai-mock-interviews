'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function InterviewQuestionsPage() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  let questions: string[] = [];

  try {
    if (data) {
      questions = JSON.parse(decodeURIComponent(data));
    }
  } catch (err) {
    console.error('Failed to parse questions:', err);
  }

  return (
    <section className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Generated Interview Questions</h1>
      {questions.length > 0 ? (
        <ul className="space-y-4">
          {questions.map((q, index) => (
            <li key={index} className="p-4 bg-black rounded-lg">
              {index + 1}. {q}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No questions found.</p>
      )}
    </section>
  );
}
