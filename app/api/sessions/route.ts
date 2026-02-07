import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import type { InterviewType, Difficulty } from '@/types';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ sessions: data });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      interviewType, 
      difficulty 
    }: { 
      interviewType: InterviewType;
      difficulty: Difficulty;
    } = body;

    if (!interviewType || !difficulty) {
      return NextResponse.json(
        { error: 'Interview type and difficulty are required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({
        interview_type: interviewType,
        difficulty,
        status: 'in_progress',
        conversation_history: [],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ session: data });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
