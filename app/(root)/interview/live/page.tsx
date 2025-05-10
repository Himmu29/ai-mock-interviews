'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Agent from '@/components/Agent';
import InterviewRecorder from '@/components/InterviewRecorder';

export default function LiveInterviewPage() {
  const searchParams = useSearchParams();
  const [interviewData, setInterviewData] = useState<{
    role: string;
    type: string;
    questions: any[];
  } | null>(null);

  useEffect(() => {
    const param = searchParams.get('data');
    if (param) {
      setInterviewData(JSON.parse(decodeURIComponent(param)));
    }
  }, [searchParams]);

  if (!interviewData) {
    return <p className="text-center mt-10">Loading interview…</p>;
  }

  return (
    <>
      {/* Recorder UI / mic permission */}
      <InterviewRecorder />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{interviewData.role} Interview</h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize text-sm">
          {interviewData.type}
        </span>
      </div>

      {/* Voice-AI Agent */}
      <Agent
        userName="Guest"
        userId="live-session"
        interviewId="temp-session"
        type="interview"
        questions={interviewData.questions}
      />
    </>
  );
}
