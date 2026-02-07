import { create } from 'zustand';
import type { Message, InterviewType, Difficulty } from '@/types';

interface InterviewStore {
  sessionId: string | null;
  interviewType: InterviewType;
  difficulty: Difficulty;
  conversationHistory: Message[];
  isRecording: boolean;
  isAISpeaking: boolean;
  currentTranscription: string;
  mediaStream: MediaStream | null;
  
  setSessionId: (id: string) => void;
  setInterviewType: (type: InterviewType) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  addMessage: (message: Message) => void;
  setConversationHistory: (history: Message[]) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsAISpeaking: (isSpeaking: boolean) => void;
  setCurrentTranscription: (text: string) => void;
  setMediaStream: (stream: MediaStream | null) => void;
  resetInterview: () => void;
}

const initialState = {
  sessionId: null,
  interviewType: 'behavioral' as InterviewType,
  difficulty: 'mid' as Difficulty,
  conversationHistory: [],
  isRecording: false,
  isAISpeaking: false,
  currentTranscription: '',
  mediaStream: null,
};

export const useInterviewStore = create<InterviewStore>((set) => ({
  ...initialState,
  
  setSessionId: (id) => set({ sessionId: id }),
  setInterviewType: (type) => set({ interviewType: type }),
  setDifficulty: (difficulty) => set({ difficulty }),
  addMessage: (message) => set((state) => ({
    conversationHistory: [...state.conversationHistory, message],
  })),
  setConversationHistory: (history) => set({ conversationHistory: history }),
  setIsRecording: (isRecording) => set({ isRecording }),
  setIsAISpeaking: (isSpeaking) => set({ isAISpeaking: isSpeaking }),
  setCurrentTranscription: (text) => set({ currentTranscription: text }),
  setMediaStream: (stream) => set({ mediaStream: stream }),
  resetInterview: () => set(initialState),
}));
