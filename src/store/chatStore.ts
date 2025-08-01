import { create } from 'zustand';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  aiEmotion: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  hasAutoInitiated: boolean;
  silenceAttempts: number; // Track how many times AI has tried to break silence
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  setAiEmotion: (emotion: string) => void;
  setTimeOfDay: (time: 'morning' | 'afternoon' | 'evening' | 'night') => void;
  setAutoInitiated: (initiated: boolean) => void;
  incrementSilenceAttempts: () => void;
  resetSilenceAttempts: () => void;
  clearMessages: () => void;
}

const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  aiEmotion: 'calm',
  timeOfDay: getTimeOfDay(),
  hasAutoInitiated: false,
  silenceAttempts: 0,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    }],
  })),

  setLoading: (loading) => set({ isLoading: loading }),

  setAiEmotion: (emotion) => set({ aiEmotion: emotion }),

  setTimeOfDay: (time) => set({ timeOfDay: time }),

  setAutoInitiated: (initiated) => set({ hasAutoInitiated: initiated }),

  incrementSilenceAttempts: () => set((state) => ({ 
    silenceAttempts: state.silenceAttempts + 1 
  })),

  resetSilenceAttempts: () => set({ silenceAttempts: 0 }),

  clearMessages: () => set({ messages: [] }),
})); 