'use client';

import React from 'react';
import { Card, CardContent } from './ui/card';
import { Bot, Loader2 } from 'lucide-react';

interface AIAvatarProps {
  isSpeaking: boolean;
  isThinking?: boolean;
}

export function AIAvatar({ isSpeaking, isThinking = false }: AIAvatarProps) {
  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div 
            className={`relative p-6 rounded-full ${
              isSpeaking 
                ? 'bg-primary animate-pulse' 
                : isThinking
                ? 'bg-muted'
                : 'bg-secondary'
            }`}
          >
            {isThinking ? (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            ) : (
              <Bot className={`h-12 w-12 ${isSpeaking ? 'text-primary-foreground' : 'text-primary'}`} />
            )}
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg">AI Interviewer</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isThinking 
                ? 'Thinking...' 
                : isSpeaking 
                ? 'Speaking' 
                : 'Listening'}
            </p>
          </div>

          {isSpeaking && (
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-8 bg-primary rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
