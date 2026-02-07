'use client';

import React, { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import type { Message } from '@/types';

interface TranscriptionDisplayProps {
  messages: Message[];
}

export function TranscriptionDisplay({ messages }: TranscriptionDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conversation</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={scrollRef}
          className="space-y-4 h-64 overflow-y-auto pr-4"
        >
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Conversation will appear here...
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-xs font-semibold mb-1">
                    {message.role === 'user' ? 'You' : 'Interviewer'}
                  </p>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
