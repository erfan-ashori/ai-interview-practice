# Deployment Guide for AI Interview Practice

## Quick Start Checklist

Before deploying, ensure you have:

- [ ] OpenAI API key with credits
- [ ] Supabase project created
- [ ] Database migration executed
- [ ] All environment variables ready

## Setting Up Supabase

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Click "New Project"
3. Fill in project details:
   - Project name: `ai-interview-practice`
   - Database password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be provisioned (~2 minutes)

### 2. Run Database Migration

1. In your Supabase project, navigate to the SQL Editor
2. Click "New Query"
3. Copy the content from `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the migration
6. Verify the `interview_sessions` table was created in the Table Editor

### 3. Get API Credentials

From your Supabase project settings (Settings → API):

- **Project URL**: `https://your-project-id.supabase.co`
- **Anon/Public Key**: `eyJ...` (safe for client-side)
- **Service Role Key**: `eyJ...` (keep secret, server-side only)

## Getting OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy and save the key securely (you won't see it again!)
6. Add credits to your account if needed

## Environment Variables

Create a `.env.local` file in your project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Access the application at [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In the project setup, expand "Environment Variables"
   - Add each variable from your `.env.local`:
     - `OPENAI_API_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Make sure to add them for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and set environment variables
```

## Post-Deployment

### Testing Your Deployment

1. **Visit Your Site**
   - Navigate to your Vercel URL
   - Test the landing page loads

2. **Test Camera/Microphone**
   - Click "Start Interview Practice"
   - Grant camera/microphone permissions
   - Verify video preview works

3. **Test Interview Flow**
   - Select interview type and difficulty
   - Start an interview
   - Record a response
   - Verify transcription works
   - Complete interview
   - Check feedback generation

### Monitoring

- **Vercel Dashboard**: Monitor deployments, analytics, and errors
- **Supabase Dashboard**: Check database usage and logs
- **OpenAI Dashboard**: Monitor API usage and costs

### Cost Considerations

#### OpenAI Costs (Per Interview)
- **Whisper**: ~$0.006 per minute of audio
- **GPT-4o**: ~$0.01-0.05 per interview (depends on length)
- **TTS**: ~$0.015 per 1000 characters
- **Estimated**: $0.10-0.30 per complete interview

#### Supabase
- **Free Tier**: 
  - 500 MB database
  - 1 GB file storage
  - 2 GB bandwidth
- Usually sufficient for hundreds of interviews

#### Vercel
- **Hobby Plan** (Free):
  - 100 GB bandwidth
  - Unlimited deployments
- Should handle significant traffic

## Troubleshooting

### Build Failures

**Error: Missing environment variables**
- Solution: Add all required env vars in Vercel dashboard

**Error: Module not found**
- Solution: Clear cache and redeploy
  ```bash
  vercel --force
  ```

### Runtime Errors

**Camera/Mic not working**
- Ensure HTTPS is enabled (Vercel provides this)
- Browser must support WebRTC
- Check browser permissions

**API calls failing**
- Verify environment variables are set correctly
- Check OpenAI API key has credits
- Verify Supabase credentials

**Database errors**
- Ensure migration was run successfully
- Check Supabase service is running
- Verify network connectivity

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys committed to Git
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Service role key only used server-side

## Updating Your Deployment

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically redeploy
```

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning

## Support

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **OpenAI**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

Happy Interviewing! 🚀
