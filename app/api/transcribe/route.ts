import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as File;

    console.log('🎤 Transcription request received');

    if (!audio) {
      console.error('❌ Transcribe: No audio file provided');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('📦 Audio file details:', {
      name: audio.name,
      type: audio.type,
      size: audio.size
    });

    // Validate audio file size
    if (audio.size === 0) {
      console.error('❌ Transcribe: Empty audio file');
      return NextResponse.json(
        { error: 'Empty audio file provided' },
        { status: 400 }
      );
    }

    // Validate audio file size (OpenAI has a 25MB limit)
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    if (audio.size > MAX_SIZE) {
      console.error('❌ Transcribe: Audio file too large:', audio.size);
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    console.log('📤 Sending to Whisper API...');

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
    });

    console.log('✅ Transcription successful');
    console.log('📝 Transcribed text:', transcription.text);
    console.log('Text preview:', transcription.text.substring(0, 100) + (transcription.text.length > 100 ? '...' : ''));

    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error('❌ Transcription error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Provide more specific error messages without exposing internal details
    let errorMessage = 'Failed to transcribe audio';
    if (error.message?.includes('Invalid file format')) {
      errorMessage = 'Invalid audio format. Please ensure the audio is recorded properly.';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
