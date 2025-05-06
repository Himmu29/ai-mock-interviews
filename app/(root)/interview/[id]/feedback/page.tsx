
// app/interview/[id]/feedback/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/actions/auth.action';
import {
  getFeedbackByInterviewId,
  getInterviewById
} from '@/lib/actions/general.action';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AISummarizerButton } from '@/components/ui/AISummarizerButton';

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [feedback, setFeedback] = useState<any>(null);
  const [interview, setInterview] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) return router.replace('/');
      const iv = await getInterviewById(id);
      if (!iv) return router.replace('/');
      setInterview(iv);
      const fb = await getFeedbackByInterviewId({ interviewId: id, userId: user.id });
      setFeedback(fb);
    }
    load();
  }, [id, router]);

  if (!feedback || !interview) return <p className="p-4 text-center">Loading...</p>;

  return (
    <section className="section-feedback p-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-semibold">
          Feedback – <span className="capitalize">{interview.role}</span>
        </h1>
      </div>

      <div className="flex justify-center mb-4 space-x-6">
        <div className="flex items-center space-x-2">
          <Image src="/star.svg" width={22} height={22} alt="star" />
          <p>
            Overall: <strong>{feedback.totalScore}/100</strong>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
          <p>
            {feedback.createdAt
              ? dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')
              : 'N/A'}
          </p>
        </div>
      </div>

      <hr className="my-6" />

      <div className="prose mb-6">
        <p>{feedback.finalAssessment}</p>
      </div>


      {/* Rest of feedback details... */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Breakdown</h2>
        <div className="space-y-4">
          {feedback.categoryScores.map((cat: any, idx: number) => (
            <div key={idx}>
              <p className="font-bold">
                {idx + 1}. {cat.name} ({cat.score}/100)
              </p>
              <p>{cat.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Strengths</h3>
        <ul className="list-disc list-inside">
          {feedback.strengths.map((s: string, idx: number) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Areas for Improvement</h3>
        <ul className="list-disc list-inside">
          {feedback.areasForImprovement.map((a: string, idx: number) => (
            <li key={idx}>{a}</li>
          ))}
        </ul>
      </div>

          {/* AI Summarize Button placed above dashboard button */}
      <div className="mb-6 flex justify-center">
        <AISummarizerButton />
      </div>

      <div className="mb-6 flex space-x-4">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="w-full text-center">
            Back to Dashboard
          </Link>
        </Button>
        <Button className="btn-primary flex-1">
          <Link href={`/interview/${id}`} className="w-full text-center">
            Retake Interview
          </Link>
        </Button>
      </div>

    </section>
  );
}
