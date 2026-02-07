'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewCamera } from '@/components/InterviewCamera';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useInterviewStore } from '@/store/interviewStore';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import type { InterviewType, Difficulty } from '@/types';

export default function InterviewSetupPage() {
  const router = useRouter();
  const { stream, error, hasPermission, requestPermissions } = useMediaDevices();
  const { interviewType, difficulty, setInterviewType, setDifficulty, setMediaStream } = useInterviewStore();
  
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const handleBeginInterview = async () => {
    if (!hasPermission) {
      alert('Please enable camera and microphone permissions first.');
      return;
    }

    setIsCreatingSession(true);

    try {
      // Create a new interview session
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewType,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      
      // Store the session ID and media stream in the store
      useInterviewStore.getState().setSessionId(data.session.id);
      setMediaStream(stream);

      // Navigate to the interview session page
      router.push('/interview/session');
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Interview Setup</h1>
            <p className="text-muted-foreground">
              Configure your interview and test your equipment
            </p>
          </div>

          {/* Camera Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Camera & Microphone</CardTitle>
              <CardDescription>
                Make sure your camera and microphone are working properly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InterviewCamera stream={stream} error={error} />
              
              {!hasPermission && (
                <Button onClick={requestPermissions} className="w-full">
                  Enable Camera & Microphone
                </Button>
              )}

              {hasPermission && (
                <Alert>
                  <AlertDescription className="flex items-center gap-2">
                    <Badge variant="default">✓ Connected</Badge>
                    Camera and microphone are ready
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Interview Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Type</CardTitle>
              <CardDescription>
                Choose the type of interview you want to practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { value: 'behavioral' as InterviewType, label: 'Behavioral', desc: 'STAR method, teamwork, leadership' },
                  { value: 'technical' as InterviewType, label: 'Technical', desc: 'Coding, algorithms, problem solving' },
                  { value: 'system-design' as InterviewType, label: 'System Design', desc: 'Architecture, scalability, trade-offs' },
                ].map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all ${
                      interviewType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setInterviewType(type.value)}
                  >
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">{type.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Level */}
          <Card>
            <CardHeader>
              <CardTitle>Difficulty Level</CardTitle>
              <CardDescription>
                Select the appropriate difficulty level for your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { value: 'junior' as Difficulty, label: 'Junior', desc: '0-2 years experience' },
                  { value: 'mid' as Difficulty, label: 'Mid-Level', desc: '2-5 years experience' },
                  { value: 'senior' as Difficulty, label: 'Senior', desc: '5+ years experience' },
                ].map((level) => (
                  <Card
                    key={level.value}
                    className={`cursor-pointer transition-all ${
                      difficulty === level.value
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setDifficulty(level.value)}
                  >
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{level.label}</h3>
                      <p className="text-sm text-muted-foreground">{level.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Begin Interview Button */}
          <Button
            onClick={handleBeginInterview}
            disabled={!hasPermission || isCreatingSession}
            size="lg"
            className="w-full text-lg"
          >
            {isCreatingSession ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Starting Interview...
              </>
            ) : (
              <>
                Begin Interview
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
