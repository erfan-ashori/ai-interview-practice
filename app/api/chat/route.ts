import { NextRequest, NextResponse } from 'next/server';
import { openai, getInterviewerPrompt } from '@/lib/openai';
import type { Message } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      message, 
      conversationHistory = [], 
      interviewType = 'behavioral',
      difficulty = 'mid'
    }: { 
      message: string; 
      conversationHistory: Message[];
      interviewType: string;
      difficulty: string;
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    const systemPrompt = getInterviewerPrompt(interviewType, difficulty);

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I did not understand that. Could you please rephrase?';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
