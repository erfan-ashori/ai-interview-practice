-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID,
  interview_type TEXT NOT NULL CHECK (interview_type IN ('behavioral', 'technical', 'system-design')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('junior', 'mid', 'senior')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  conversation_history JSONB DEFAULT '[]'::jsonb,
  feedback JSONB,
  scores JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at ON interview_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON interview_sessions(status);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id) WHERE user_id IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access for hackathon purposes
-- In production, you would want more restrictive policies
CREATE POLICY "Allow public read access" ON interview_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON interview_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON interview_sessions
  FOR UPDATE USING (true);
