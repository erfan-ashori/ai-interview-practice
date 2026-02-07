'use client';

import React, { useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Video, VideoOff } from 'lucide-react';
import { Button } from './ui/button';

interface InterviewCameraProps {
  stream: MediaStream | null;
  error?: string | null;
  onToggle?: () => void;
  isEnabled?: boolean;
}

export function InterviewCamera({ 
  stream, 
  error,
  onToggle,
  isEnabled = true 
}: InterviewCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream && isEnabled) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isEnabled]);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        {error ? (
          <div className="flex items-center justify-center h-full p-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : isEnabled && stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <VideoOff className="h-12 w-12 mb-2" />
            <p className="text-sm">Camera off</p>
          </div>
        )}
        
        {onToggle && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button
              onClick={onToggle}
              variant="secondary"
              size="icon"
              className="rounded-full"
            >
              {isEnabled ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
