'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateInterviewPage() {
  const router = useRouter();
  const [jobPosition, setJobPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [numQuestions, setNumQuestions] = useState<number | ''>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const typesList = [
    'Technical',
    'Behavioral',
    'Experience',
    'Problem Solving',
    'Leadership',
  ];
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Shared question-generation logic
  const generateAndRedirect = async (target: 'preview' | 'live') => {
    if (!jobPosition || !jobDescription || numQuestions === '' || selectedTypes.length === 0) {
      alert('Please complete all fields before proceeding.');
      return;
    }

    const formData = {
      jobPosition,
      jobDescription,
      numQuestions,
      selectedTypes,
    };

    const res = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const { questions } = await res.json();

    if (!questions) {
      alert('Failed to generate questions. Please try again.');
      return;
    }

    const payload =
      target === 'preview'
        ? encodeURIComponent(JSON.stringify(questions))
        : encodeURIComponent(
            JSON.stringify({
              role: jobPosition,
              type: selectedTypes.join(', '),
              questions,
            })
          );

    const path = target === 'preview' ? '/interview/questions' : '/interview/live';
    router.push(`${path}?data=${payload}`);
  };

  return (
    <section className="max-w-xl mx-auto p-6">
      {/* Header & Back */}
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold ml-2">Create New Interview</h1>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); generateAndRedirect('preview'); }}>
        {/* Job Position */}
        <div>
          <label htmlFor="job-position" className="block mb-1 font-medium">
            Job Position
          </label>
          <input
            id="job-position"
            type="text"
            value={jobPosition}
            onChange={(e) => setJobPosition(e.target.value)}
            placeholder="Enter job position"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="job-description" className="block mb-1 font-medium">
            Job Description
          </label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter job description"
            className="w-full border rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Number of Questions */}
        <div>
          <label htmlFor="num-questions" className="block mb-1 font-medium">
            Number of Questions
          </label>
          <input
            id="num-questions"
            type="number"
            min={1}
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.valueAsNumber || '')}
            placeholder="Enter number of questions"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Resume Upload */}
        <div>
          <label htmlFor="resume-upload" className="block mb-1 font-medium">
            Upload Resume (PDF)
          </label>
          <label
            htmlFor="resume-upload"
            className="flex items-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
          >
            <Upload className="h-6 w-6 text-gray-600" />
            <span className="text-gray-500">
              {resumeFile ? `Selected: ${resumeFile.name}` : 'Click to upload PDF'}
            </span>
            <input
              id="resume-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Interview Type Buttons */}
        <div>
          <p className="block mb-1 font-medium">Interview Type</p>
          <div className="flex flex-wrap gap-2">
            {typesList.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  selectedTypes.includes(type)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={
              !jobPosition || !jobDescription || numQuestions === '' || !selectedTypes.length
            }
            className="btn-primary"
          >
            Generate Questions →
          </Button>
          <Button
            type="button"
            onClick={() => generateAndRedirect('live')}
            className="btn-secondary"
          >
            Start Interview
          </Button>
        </div>
      </form>
    </section>
  );
}
