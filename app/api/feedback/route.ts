import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { getServiceSupabase } from '@/lib/supabase';
import type { Message, FeedbackScores, Feedback } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      conversationHistory, 
      sessionId 
    }: { 
      conversationHistory: Message[];
      sessionId: string;
    } = body;

    if (!conversationHistory || conversationHistory.length === 0) {
      return NextResponse.json(
        { error: 'No conversation history provided' },
        { status: 400 }
      );
    }

    // Create a conversation summary for the AI
    const conversationText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`)
      .join('\n\n');

    const feedbackPrompt = `You are an expert interview evaluator. Based on the following interview conversation, provide a comprehensive feedback analysis.

Conversation:
${conversationText}

Evaluate the candidate across these five metrics (score each from 1-10):
1. Content Quality: Relevance, depth, and accuracy of answers
2. Communication Skills: Clarity, conciseness, and articulation
3. Answer Structure: Use of frameworks like STAR method, logical flow
4. Confidence: Assertiveness and lack of uncertainty markers
5. Use of Examples: Concrete examples and specificity

Provide your response in the following JSON format:
{
  "scores": {
    "contentQuality": <number>,
    "communicationSkills": <number>,
    "answerStructure": <number>,
    "confidence": <number>,
    "useOfExamples": <number>
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "summary": "A brief 2-3 sentence overall summary of the candidate's performance"
}

Be specific, actionable, and constructive in your feedback.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert interview evaluator. Respond only with valid JSON.' },
        { role: 'user', content: feedbackPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const feedbackText = completion.choices[0]?.message?.content || '{}';
    const parsedFeedback = JSON.parse(feedbackText);

    // Calculate overall score
    const scores: FeedbackScores = {
      ...parsedFeedback.scores,
      overall: Math.round(
        (parsedFeedback.scores.contentQuality +
          parsedFeedback.scores.communicationSkills +
          parsedFeedback.scores.answerStructure +
          parsedFeedback.scores.confidence +
          parsedFeedback.scores.useOfExamples) / 5
      ),
    };

    const feedback: Feedback = {
      scores,
      strengths: parsedFeedback.strengths || [],
      improvements: parsedFeedback.improvements || [],
      summary: parsedFeedback.summary || '',
    };

    // Update session in database
    if (sessionId) {
      const supabase = getServiceSupabase();
      await supabase
        .from('interview_sessions')
        .update({
          feedback,
          scores,
          status: 'completed',
        })
        .eq('id', sessionId);
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
}
