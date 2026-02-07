# AI Interview Practice Platform

🚀 AI-powered interview practice platform that helps you master your interview skills with real-time feedback.

## Overview

Practice behavioral, technical, and system design interviews with an AI interviewer powered by OpenAI's GPT-4o. Get instant feedback, detailed scoring, and actionable insights to improve your interview performance.

## Features

- **🎥 Video & Audio Practice**: Full camera and microphone integration for realistic interview simulation
- **🤖 AI-Powered Interviewer**: GPT-4o conducts natural, contextual interviews
- **🎙️ Real-time Transcription**: Whisper API transcribes your responses instantly
- **🔊 Text-to-Speech**: AI responses are spoken using OpenAI's TTS
- **📊 Comprehensive Feedback**: Detailed scoring across 5 key metrics:
  - Content Quality
  - Communication Skills
  - Answer Structure
  - Confidence
  - Use of Examples
- **💾 Session History**: Save and review past interview sessions
- **🎯 Multiple Interview Types**: Behavioral, Technical, and System Design
- **📈 Difficulty Levels**: Junior, Mid-Level, and Senior positions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI Services**: OpenAI (GPT-4o, Whisper, TTS)
- **State Management**: Zustand
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-interview-practice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

4. **Set up Supabase database**
   
   Run the migration file in your Supabase SQL editor:
   ```bash
   supabase/migrations/001_initial_schema.sql
   ```
   
   Or manually execute the SQL commands to create the `interview_sessions` table.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

### OpenAI API Key
- **Variable**: `OPENAI_API_KEY`
- **Description**: Your OpenAI API key for GPT-4o, Whisper, and TTS
- **Get it**: [OpenAI Platform](https://platform.openai.com/api-keys)

### Supabase Configuration
- **Variable**: `NEXT_PUBLIC_SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Example**: `https://your-project.supabase.co`

- **Variable**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description**: Your Supabase anonymous/public key
- **Note**: Safe to expose in client-side code

- **Variable**: `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: Your Supabase service role key (server-side only)
- **Security**: Never expose this key in client-side code

Get all Supabase credentials from: Project Settings → API in your Supabase dashboard

## How to Use

### 1. Landing Page
- View platform features and benefits
- Click "Start Interview Practice" to begin

### 2. Interview Setup
- **Enable Permissions**: Grant camera and microphone access
- **Choose Interview Type**: Behavioral, Technical, or System Design
- **Select Difficulty**: Junior, Mid-Level, or Senior
- **Begin Interview**: Start your AI-powered interview session

### 3. Interview Session
- The AI interviewer will introduce itself and ask the first question
- Click "Start Speaking" to record your response
- Speak clearly into your microphone
- Click "Stop Recording" when finished
- The AI will transcribe, analyze, and respond to your answer
- Continue until 5-7 questions are completed
- Click "End Interview" to finish

### 4. Results & Feedback
- View your overall score and detailed metrics
- Read strengths and areas for improvement
- Review the full conversation transcript
- Practice again with "Practice Another Interview"

## Project Structure

```
/app
  /page.tsx                    # Landing page
  /layout.tsx                  # Root layout
  /interview
    /setup/page.tsx            # Interview setup page
    /session/page.tsx          # Live interview session
    /results/[id]/page.tsx     # Results and feedback page
  /api
    /transcribe/route.ts       # Whisper transcription endpoint
    /chat/route.ts             # GPT-4o conversation endpoint
    /tts/route.ts              # Text-to-speech endpoint
    /feedback/route.ts         # Feedback generation endpoint
    /sessions/route.ts         # Session CRUD operations
    /sessions/[id]/route.ts    # Get single session
/components
  /ui                          # shadcn/ui components
  /InterviewCamera.tsx         # Camera preview component
  /AudioRecorder.tsx           # Recording indicator
  /TranscriptionDisplay.tsx    # Conversation display
  /AIAvatar.tsx               # AI interviewer avatar
  /FeedbackCard.tsx           # Feedback visualization
/hooks
  /useMediaDevices.ts         # Camera/mic access hook
  /useAudioRecorder.ts        # Audio recording hook
/lib
  /supabase.ts                # Supabase client
  /openai.ts                  # OpenAI client
  /utils.ts                   # Utility functions
/store
  /interviewStore.ts          # Zustand state management
/types
  /index.ts                   # TypeScript types
/supabase
  /migrations
    /001_initial_schema.sql   # Database schema
```

## API Routes

### POST /api/transcribe
Transcribe audio using Whisper API
- **Input**: FormData with audio file
- **Output**: `{ text: string }`

### POST /api/chat
Get AI interviewer response
- **Input**: `{ message, conversationHistory, interviewType, difficulty }`
- **Output**: `{ response: string }`

### POST /api/tts
Convert text to speech
- **Input**: `{ text: string }`
- **Output**: Audio stream (MP3)

### POST /api/feedback
Generate comprehensive feedback
- **Input**: `{ conversationHistory, sessionId }`
- **Output**: `{ feedback: Feedback }`

### GET /api/sessions
List all interview sessions
- **Output**: `{ sessions: InterviewSession[] }`

### POST /api/sessions
Create new interview session
- **Input**: `{ interviewType, difficulty }`
- **Output**: `{ session: InterviewSession }`

### GET /api/sessions/[id]
Get specific session
- **Output**: `{ session: InterviewSession }`

## Database Schema

### interview_sessions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| created_at | TIMESTAMP | Session creation time |
| user_id | UUID | Optional user identifier |
| interview_type | TEXT | Type: behavioral, technical, system-design |
| difficulty | TEXT | Level: junior, mid, senior |
| status | TEXT | Status: in_progress, completed |
| conversation_history | JSONB | Array of messages |
| feedback | JSONB | Feedback object with scores |
| scores | JSONB | Detailed score breakdown |

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure environment variables
   - Deploy

3. **Set Environment Variables**
   - Add all variables from `.env.local` to Vercel's environment settings

### Environment Variables in Production
Ensure all environment variables are configured in your Vercel project settings:
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Browser Compatibility

- **Recommended**: Chrome, Edge (Chromium-based browsers)
- **Required Features**:
  - WebRTC (getUserMedia)
  - MediaRecorder API
  - Web Audio API

## Troubleshooting

### Camera/Microphone Not Working
- Ensure you've granted browser permissions
- Check that no other application is using the camera/microphone
- Try a different browser (Chrome/Edge recommended)

### API Errors
- Verify all environment variables are set correctly
- Check OpenAI API key has sufficient credits
- Ensure Supabase database is properly configured

### Audio Recording Issues
- Use Chrome or Edge browser
- Ensure microphone is properly connected
- Check browser console for detailed error messages

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Video recording and playback
- [ ] Filler word detection
- [ ] Speaking pace analysis
- [ ] PDF transcript export
- [ ] Pause/resume interview
- [ ] Interview history dashboard
- [ ] Mobile app version

## License

MIT License - feel free to use this project for learning and practice!

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, OpenAI, and Supabase
