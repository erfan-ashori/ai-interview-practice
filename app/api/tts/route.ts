import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    console.log('🔊 TTS request received, text length:', text?.length);

    if (!text || typeof text !== 'string') {
      console.error('❌ TTS: No text provided or invalid type');
      return NextResponse.json(
        { error: 'No text provided or invalid type' },
        { status: 400 }
      );
    }

    if (text.trim().length === 0) {
      console.error('❌ TTS: Empty text provided');
      return NextResponse.json(
        { error: 'Empty text provided' },
        { status: 400 }
      );
    }

    console.log('📝 TTS text preview:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
      response_format: 'mp3',
    });

    console.log('✅ TTS audio generated successfully');

    const buffer = Buffer.from(await mp3.arrayBuffer());
    console.log('📦 Audio buffer size:', buffer.length, 'bytes');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('❌ TTS error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
