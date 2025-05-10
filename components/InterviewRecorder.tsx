'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Download } from 'lucide-react';

const InterviewRecorder: React.FC = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);

  const handleStartRecording = async () => {
    setAudioUrl(null); // clear previous recording

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        setChunks((prev) => [...prev, e.data]);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setChunks([]);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Please allow microphone access.');
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      {!isRecording ? (
        <Button onClick={handleStartRecording} className="btn-primary">
          <Mic className="mr-2" /> Start Recording
        </Button>
      ) : (
        <Button onClick={handleStopRecording} className="btn-destructive">
          <StopCircle className="mr-2" /> Stop Recording
        </Button>
      )}

      {audioUrl && (
        <a
          href={audioUrl}
          download="interview-recording.webm"
          className="mt-2 inline-flex items-center gap-2 text-blue-600 underline"
        >
          <Download size={18} /> Download Recording
        </a>
      )}
    </div>
  );
};

export default InterviewRecorder;
