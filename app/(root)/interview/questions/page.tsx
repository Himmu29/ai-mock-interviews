'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  let qaPairs: { question: string; answer: string }[] = [];

  try {
    if (data) {
      qaPairs = JSON.parse(decodeURIComponent(data));
    }
  } catch (err) {
    console.error('Failed to parse query data:', err);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Generated Interview Questions</h1>
      {qaPairs.length > 0 ? (
        qaPairs.map((item, idx) => (
          <div key={idx} className="p-4 border rounded-lg shadow-sm">
            <p className="font-medium">Q{idx + 1}: {item.question}</p>
            <p className="text-gray-600 mt-1">A: {item.answer}</p>
          </div>
        ))
      ) : (
        <p>No questions found.</p>
      )}
    </div>
  );
}
