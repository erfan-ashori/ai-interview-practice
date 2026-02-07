export type InterviewType = 'behavioral' | 'technical' | 'system-design';
export type Difficulty = 'junior' | 'mid' | 'senior';
export type SessionStatus = 'in_progress' | 'completed';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FeedbackScores {
  contentQuality: number;
  communicationSkills: number;
  answerStructure: number;
  confidence: number;
  useOfExamples: number;
  overall: number;
}

export interface Feedback {
  scores: FeedbackScores;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface InterviewSession {
  id: string;
  created_at: string;
  interview_type: InterviewType;
  difficulty: Difficulty;
  status: SessionStatus;
  conversation_history: Message[];
  feedback: Feedback | null;
  scores: FeedbackScores | null;
}
