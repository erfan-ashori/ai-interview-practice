import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory, interviewType, difficulty } = body;

    console.log('Chat request:', { message, interviewType, difficulty });

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    // Build system prompt based on interview type
    const systemPrompts = {
      behavioral: `You are an experienced HR interviewer conducting a ${difficulty} level behavioral interview. Ask insightful behavioral questions using the STAR method (Situation, Task, Action, Result). Be professional, encouraging, and probe for specific examples. Ask one question at a time.`,
      technical: `You are a senior software engineer conducting a ${difficulty} level technical interview. Ask questions about data structures, algorithms, system design, and coding concepts appropriate for the level. Be technical but fair. Ask one question at a time.`,
      'system-design': `You are a senior architect conducting a ${difficulty} level system design interview. Ask about scalability, architecture patterns, trade-offs, and design decisions. Be thorough and probe for depth of understanding. Ask one question at a time.`,
    };

    const systemPrompt = systemPrompts[interviewType as keyof typeof systemPrompts] || systemPrompts.behavioral;

    // Build messages array
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    });

    console.log('Sending to OpenAI with', messages.length, 'messages');

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    console.log('OpenAI response received:', response?.substring(0, 100) + '...');

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
