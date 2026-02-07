# Testing Guide

## Manual Testing Checklist

This document outlines the testing steps to verify all features work correctly.

## Prerequisites

Before testing, ensure:
- [ ] Environment variables are configured in `.env.local`
- [ ] Supabase database migration has been run
- [ ] Development server is running (`npm run dev`)
- [ ] Using Chrome or Edge browser
- [ ] Camera and microphone are available

## Test 1: Landing Page

**URL**: `http://localhost:3000/`

### Expected Behavior
- [ ] Page loads without errors
- [ ] Hero section displays with "Master Your Interview Skills" heading
- [ ] "Start Interview Practice" button is visible
- [ ] Features section shows 4 feature cards
- [ ] "How It Works" section shows 4 steps
- [ ] Footer displays copyright information
- [ ] All navigation links work

### Test Steps
1. Navigate to landing page
2. Scroll through entire page
3. Click "Start Interview Practice" button
4. Verify redirect to `/interview/setup`

---

## Test 2: Interview Setup Page

**URL**: `http://localhost:3000/interview/setup`

### Expected Behavior
- [ ] Page loads without errors
- [ ] Camera preview placeholder shows initially
- [ ] "Enable Camera & Microphone" button is visible
- [ ] Interview type selection (3 cards) is available
- [ ] Difficulty selection (3 cards) is available
- [ ] "Begin Interview" button is disabled initially

### Test Steps

**2.1: Enable Permissions**
1. Click "Enable Camera & Microphone"
2. Allow browser permissions when prompted
3. Verify video feed appears in preview
4. Verify success alert shows "Connected"
5. Verify "Begin Interview" button becomes enabled

**2.2: Select Interview Type**
1. Click "Behavioral" card
2. Verify card has highlighted border
3. Click "Technical" card
4. Verify previous selection is deselected
5. Verify new card is highlighted

**2.3: Select Difficulty**
1. Click "Junior" level
2. Verify card has highlighted border
3. Click "Senior" level
4. Verify selection changes

**2.4: Navigation**
1. Click "Back to Home" link
2. Verify return to landing page
3. Return to setup page

---

## Test 3: Interview Session Page

**URL**: `http://localhost:3000/interview/session`

### Prerequisites
- Complete Test 2 successfully
- Grant camera/microphone permissions

### Expected Behavior
- [ ] Page shows "Initializing interview..." initially
- [ ] AI avatar displays after initialization
- [ ] User's video feed shows in bottom left
- [ ] AI greeting appears in conversation
- [ ] TTS audio plays for AI greeting (if API configured)
- [ ] "Start Speaking" button becomes available

### Test Steps

**3.1: Initial State**
1. From setup page, click "Begin Interview"
2. Wait for initialization (5-10 seconds)
3. Verify AI greeting appears in conversation
4. Verify audio plays (if OpenAI TTS configured)
5. Verify "Start Speaking" button is enabled

**3.2: Record Response**
1. Click "Start Speaking" button
2. Verify button changes to "Stop Recording"
3. Verify recording indicator shows "Recording..."
4. Verify red pulse animation on microphone
5. Speak for 10-15 seconds
6. Click "Stop Recording"
7. Verify "Processing..." message appears

**3.3: AI Response** (Requires OpenAI API)
1. Wait for transcription to complete
2. Verify your message appears in conversation
3. Wait for AI response
4. Verify AI message appears in conversation
5. Verify TTS audio plays
6. Verify "Start Speaking" becomes available again

**3.4: Complete Interview**
1. Record 3-5 more responses
2. Verify conversation history updates
3. Verify question counter increases
4. Click "End Interview" button
5. Verify redirect to results page

---

## Test 4: Results/Feedback Page

**URL**: `http://localhost:3000/interview/results/[session-id]`

### Prerequisites
- Complete an interview session (Test 3)
- OpenAI API must be configured

### Expected Behavior
- [ ] Page loads without errors
- [ ] Overall score displays (1-10)
- [ ] Score percentage badge shows
- [ ] Summary text appears
- [ ] 5 metric scores display with progress bars
- [ ] Strengths section lists 3+ items
- [ ] Improvements section lists 3+ items
- [ ] Full transcript shows all messages
- [ ] "Practice Another Interview" button works
- [ ] "Return Home" button works

### Test Steps

**4.1: Feedback Display**
1. Wait for page to load
2. Verify overall score is between 1-10
3. Verify all 5 metrics have scores
4. Verify progress bars match scores
5. Read summary text for coherence

**4.2: Strengths & Improvements**
1. Read strengths list
2. Verify 2-3 specific strengths listed
3. Read improvements list
4. Verify 2-3 actionable improvements listed

**4.3: Transcript**
1. Scroll to transcript section
2. Verify all messages are shown
3. Verify user vs AI messages are distinguished
4. Verify messages are in chronological order

**4.4: Navigation**
1. Click "Practice Another Interview"
2. Verify redirect to setup page
3. Return to results page
4. Click "Return Home"
5. Verify redirect to landing page

---

## Test 5: API Endpoints

### Test 5.1: POST /api/sessions

**Request:**
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"interviewType": "behavioral", "difficulty": "mid"}'
```

**Expected Response:**
```json
{
  "session": {
    "id": "uuid",
    "interview_type": "behavioral",
    "difficulty": "mid",
    "status": "in_progress",
    ...
  }
}
```

### Test 5.2: GET /api/sessions

**Request:**
```bash
curl http://localhost:3000/api/sessions
```

**Expected Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "interview_type": "behavioral",
      ...
    }
  ]
}
```

### Test 5.3: POST /api/transcribe

**Note**: Requires actual audio file

**Request:**
```bash
curl -X POST http://localhost:3000/api/transcribe \
  -F "audio=@test-audio.webm"
```

**Expected Response:**
```json
{
  "text": "Transcribed text from audio"
}
```

### Test 5.4: POST /api/chat

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about yourself",
    "conversationHistory": [],
    "interviewType": "behavioral",
    "difficulty": "mid"
  }'
```

**Expected Response:**
```json
{
  "response": "AI interviewer response"
}
```

---

## Test 6: Error Handling

### Test 6.1: Missing Permissions
1. Deny camera/microphone permissions
2. Verify error message displays
3. Verify cannot proceed to interview

### Test 6.2: Network Errors
1. Disconnect from internet
2. Try to start interview
3. Verify error handling

### Test 6.3: Invalid Session
1. Navigate to `/interview/results/invalid-uuid`
2. Verify error message displays
3. Verify "Return Home" option available

---

## Test 7: Responsive Design

### Test 7.1: Mobile View (375px)
1. Open DevTools
2. Set viewport to iPhone SE (375x667)
3. Test all pages
4. Verify layouts are readable
5. Verify buttons are tappable
6. Verify no horizontal scroll

### Test 7.2: Tablet View (768px)
1. Set viewport to iPad (768x1024)
2. Test all pages
3. Verify grid layouts adjust properly
4. Verify navigation is accessible

### Test 7.3: Desktop View (1920px)
1. Set viewport to 1920x1080
2. Test all pages
3. Verify content is centered
4. Verify maximum widths are respected

---

## Test 8: Browser Compatibility

### Recommended Browsers
- [ ] Chrome 90+ ✅ Primary
- [ ] Edge 90+ ✅ Primary
- [ ] Safari 15+ ⚠️ Limited (WebRTC support varies)
- [ ] Firefox 88+ ⚠️ Limited (MediaRecorder API varies)

### Test Each Browser
1. Complete Test 1-4 in each browser
2. Verify camera/microphone access works
3. Verify audio recording works
4. Document any browser-specific issues

---

## Test 9: Performance

### Page Load Times
- [ ] Landing page < 2 seconds
- [ ] Setup page < 2 seconds
- [ ] Session page < 3 seconds
- [ ] Results page < 2 seconds

### API Response Times (with OpenAI)
- [ ] Transcription < 5 seconds
- [ ] Chat response < 8 seconds
- [ ] TTS generation < 3 seconds
- [ ] Feedback generation < 15 seconds

---

## Test 10: Database

### Verify Data Persistence

1. Complete an interview
2. Check Supabase dashboard
3. Navigate to `interview_sessions` table
4. Verify new row exists
5. Verify `conversation_history` is populated
6. Verify `feedback` is populated after completion
7. Verify `scores` are saved

---

## Known Limitations

- Camera/microphone require HTTPS (except localhost)
- WebRTC not supported in all browsers
- OpenAI API calls require credits
- TTS audio may not play if API quota exceeded
- Mobile Safari has limited WebRTC support

---

## Bug Reporting

If you find issues, please report:

1. **Browser & Version**: Chrome 120
2. **Page/Feature**: Interview Session
3. **Steps to Reproduce**: 
4. **Expected Behavior**: 
5. **Actual Behavior**: 
6. **Screenshots**: 
7. **Console Errors**: 

---

## Success Criteria

✅ All pages load without errors
✅ Camera/microphone permissions work
✅ Audio recording functions properly
✅ API integrations work (with valid keys)
✅ Feedback is generated and displayed
✅ Data persists to database
✅ Responsive on mobile and desktop
✅ No ESLint errors
✅ Production build succeeds

---

**Testing Complete**: Date: _______________
**Tester**: _______________
**Status**: ⬜ Pass  ⬜ Fail  ⬜ Partial
**Notes**: 
