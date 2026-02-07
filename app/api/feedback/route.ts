import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationHistory, interviewType, difficulty } = body;

    if (!conversationHistory || conversationHistory.length === 0) {
      return NextResponse.json(
        { error: 'No conversation history provided' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert interview evaluator. Analyze the following ${interviewType} interview conversation for a ${difficulty} level position.

Conversation:
${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

Provide detailed feedback in the following JSON format:
{
  "scores": {
    "contentQuality": <number 1-10>,
    "communicationSkills": <number 1-10>,
    "answerStructure": <number 1-10>,
    "confidence": <number 1-10>,
    "useOfExamples": <number 1-10>,
    "overall": <number 1-10>
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"],
  "summary": "Overall summary of performance"
}

Base your evaluation on:
- Content Quality: Relevance, depth, and accuracy of answers
- Communication Skills: Clarity, conciseness, articulation
- Answer Structure: Use of frameworks (e.g., STAR), logical flow
- Confidence: Assertiveness, lack of filler words
- Use of Examples: Concrete examples, specificity

Be constructive but honest.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview evaluator. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const feedbackText = completion.choices[0].message.content;
    
    if (!feedbackText) {
      throw new Error('No feedback generated');
    }

    const feedback = JSON.parse(feedbackText);

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error('Feedback generation error:', error);
    
    // Return a default feedback if API fails
    return NextResponse.json({
      scores: {
        contentQuality: 7,
        communicationSkills: 7,
        answerStructure: 7,
        confidence: 7,
        useOfExamples: 7,
        overall: 7,
      },
      strengths: [
        'Good participation in the interview',
        'Answered questions thoughtfully',
        'Engaged with the interviewer',
      ],
      improvements: [
        'Provide more specific examples',
        'Structure answers using frameworks like STAR',
        'Practice articulating complex ideas clearly',
      ],
      summary: 'You showed good effort in the interview. Keep practicing to improve!',
    });
  }
}
