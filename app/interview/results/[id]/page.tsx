'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackCard } from '@/components/FeedbackCard';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';
import type { InterviewSession } from '@/types';

export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Session not found');
        }

        const data = await response.json();
        setSession(data.session);
      } catch (err) {
        console.error('Failed to fetch session:', err);
        setError('Failed to load interview results');
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive">{error || 'Session not found'}</p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Link href="/interview/setup">
              <Button variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Practice Again
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Interview Results</h1>
            <p className="text-muted-foreground">
              {session.interview_type} Interview • {session.difficulty} Level
            </p>
            <p className="text-sm text-muted-foreground">
              Completed on {new Date(session.created_at).toLocaleDateString()}
            </p>
          </div>

          {session.feedback ? (
            <>
              <FeedbackCard feedback={session.feedback} />

              <Separator />

              <div>
                <h2 className="text-2xl font-bold mb-4">Interview Transcript</h2>
                <TranscriptionDisplay messages={session.conversation_history} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/interview/setup" className="flex-1">
                  <Button size="lg" className="w-full">
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Practice Another Interview
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Return Home
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Feedback is being generated. Please refresh the page in a moment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
