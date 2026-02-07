'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InterviewCamera } from '@/components/InterviewCamera';
import { AudioRecorder } from '@/components/AudioRecorder';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { AIAvatar } from '@/components/AIAvatar';
import { useInterviewStore } from '@/store/interviewStore';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Loader2, XCircle } from 'lucide-react';
import type { Message } from '@/types';

export default function InterviewSessionPage() {
  const router = useRouter();
  const {
    sessionId,
    interviewType,
    difficulty,
    conversationHistory,
    isRecording,
    isAISpeaking,
    mediaStream,
    addMessage,
    setIsRecording,
    setIsAISpeaking,
  } = useInterviewStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const { isRecording: isAudioRecording, audioBlob, startRecording, stopRecording, clearAudio } = useAudioRecorder();

  const playAIResponse = useCallback(async (text: string) => {
    try {
      setIsAISpeaking(true);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.onended = () => {
          setIsAISpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        await audioPlayerRef.current.play();
      }
    } catch (error) {
      console.error('Failed to play AI response:', error);
      setIsAISpeaking(false);
    }
  }, [setIsAISpeaking]);

  // Initialize the interview with AI greeting
  useEffect(() => {
    if (!sessionId) {
      router.push('/interview/setup');
      return;
    }

    const initializeInterview = async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Hello, I am ready for the interview.',
            conversationHistory: [],
            interviewType,
            difficulty,
          }),
        });

        const data = await response.json();

        // Add AI greeting to conversation
        const aiMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        addMessage(aiMessage);

        // Convert AI response to speech
        await playAIResponse(data.response);
      } catch (error) {
        console.error('Failed to initialize interview:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeInterview();
  }, [sessionId, router, interviewType, difficulty, addMessage, playAIResponse]);

  const processAudioResponse = useCallback(async () => {
    if (!audioBlob) return;

    setIsProcessing(true);

    try {
      // Step 1: Transcribe audio
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const { text } = await transcribeResponse.json();

      // Add user message to conversation
      const userMessage: Message = {
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      addMessage(userMessage);

      // Step 2: Get AI response
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationHistory,
          interviewType,
          difficulty,
        }),
      });

      const { response: aiResponse } = await chatResponse.json();

      // Add AI message to conversation
      const aiMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      addMessage(aiMessage);

      // Step 3: Convert AI response to speech and play
      await playAIResponse(aiResponse);

      // Clear audio blob
      clearAudio();
    } catch (error) {
      console.error('Failed to process audio:', error);
      alert('Failed to process your response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [audioBlob, conversationHistory, interviewType, difficulty, addMessage, playAIResponse, clearAudio]);

  // Process audio when recording stops
  useEffect(() => {
    if (audioBlob && !isAudioRecording) {
      processAudioResponse();
    }
  }, [audioBlob, isAudioRecording, processAudioResponse]);

  const handleStartRecording = async () => {
    if (!mediaStream) {
      alert('Media stream not available. Please return to setup.');
      return;
    }

    setIsRecording(true);
    await startRecording(mediaStream);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording();
  };

  const handleEndInterview = async () => {
    if (conversationHistory.length < 4) {
      const confirm = window.confirm(
        'Are you sure you want to end the interview? You should complete at least a few questions for meaningful feedback.'
      );
      if (!confirm) return;
    }

    try {
      // Generate feedback
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationHistory,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }

      // Navigate to results page
      router.push(`/interview/results/${sessionId}`);
    } catch (error) {
      console.error('Failed to end interview:', error);
      alert('Failed to generate feedback. Please try again.');
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto" />
          <p className="text-muted-foreground">Initializing interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Interview in Progress</h1>
              <p className="text-sm text-muted-foreground">
                {interviewType} • {difficulty} level
              </p>
            </div>
            <Button variant="destructive" onClick={handleEndInterview}>
              <XCircle className="mr-2 h-4 w-4" />
              End Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - AI Avatar & User Camera */}
          <div className="space-y-6">
            <AIAvatar isSpeaking={isAISpeaking} isThinking={isProcessing} />
            <div className="lg:sticky lg:top-6">
              <InterviewCamera stream={mediaStream} />
            </div>
          </div>

          {/* Middle & Right Column - Conversation & Controls */}
          <div className="lg:col-span-2 space-y-6">
            <TranscriptionDisplay messages={conversationHistory} />

            <AudioRecorder isRecording={isRecording} />

            <div className="flex gap-4">
              {!isRecording && !isAISpeaking && !isProcessing ? (
                <Button
                  onClick={handleStartRecording}
                  size="lg"
                  className="flex-1"
                >
                  Start Speaking
                </Button>
              ) : isRecording ? (
                <Button
                  onClick={handleStopRecording}
                  size="lg"
                  variant="destructive"
                  className="flex-1"
                >
                  Stop Recording
                </Button>
              ) : (
                <Button disabled size="lg" className="flex-1">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      AI is speaking...
                    </>
                  )}
                </Button>
              )}
            </div>

            {conversationHistory.length > 0 && (
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground text-center">
                  Answer {Math.floor(conversationHistory.length / 2)} of ~5-7 questions completed
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
