// components/AISummarizerButton.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ellipsis, Zap } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

interface AISummarizerButtonProps {
  /**
   * CSS selector for fallback text container when no text is selected
   */
  textSelector?: string;
}

export function AISummarizerButton({
  textSelector = '.prose',
}: AISummarizerButtonProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleSummarize = async () => {
    // Try to get user-selected text first
    const selectedText = window.getSelection()?.toString().trim() || '';
    // If no selection, fallback to full text in container
    const fallbackEl = document.querySelector(textSelector);
    const fallbackText = fallbackEl?.textContent?.trim() || '';
    const feedback = selectedText || fallbackText;
    if (!feedback) return; // nothing to summarize

    setIsSummarizing(true);
    setSummary('');

    try {
      const res = await fetch('/api/summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { summary: aiSummary } = await res.json();
      setSummary(aiSummary);
    } catch (err) {
      console.error('Summarization failed', err);
      alert('Could not summarize. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  // clear summary on outside click
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (summaryRef.current && !summaryRef.current.contains(e.target as Node)) {
        setSummary('');
      }
    };
    if (summary) document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [summary]);

  return (
    <div className={cn('relative')}>      
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <motion.button
              onClick={handleSummarize}
              whileHover={{ scale: 1.1 }}
              disabled={isSummarizing}
              className={cn(
                'p-3 bg-black border-2 rounded-full',
                isSummarizing ? 'opacity-50' : ''
              )}
            >
              {isSummarizing ? (
                <Ellipsis className="h-6 w-6 animate-ping" />
              ) : (
                <Zap className="h-6 w-6" />
              )}
              <span className="sr-only">
                Summarize selected or full feedback
              </span>
            </motion.button>
          </Tooltip.Trigger>
          <Tooltip.Content sideOffset={8}>
            Summarize selected or full feedback
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>

      {summary && (
        <div
          ref={summaryRef}
          className="mt-4 p-4 bg-black text-white border rounded"
        >
          <h3 className="font-semibold mb-2">Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
