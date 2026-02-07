'use client';

import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Mic, MicOff } from 'lucide-react';

interface AudioRecorderProps {
  isRecording: boolean;
}

export function AudioRecorder({ isRecording }: AudioRecorderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className={`p-3 rounded-full ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-muted'
              }`}
            >
              {isRecording ? (
                <Mic className="h-5 w-5 text-white" />
              ) : (
                <MicOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {isRecording ? 'Recording...' : 'Ready to record'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isRecording ? 'Speak clearly into your microphone' : 'Click to start speaking'}
              </p>
            </div>
          </div>
          
          {isRecording && (
            <Badge variant="destructive">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE
              </div>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
