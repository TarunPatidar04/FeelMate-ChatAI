export class SilenceWatcher {
  private timer: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private onSilenceDetected: () => void;
  private silenceThreshold: number = 30000; // 30 seconds - more patient
  private isUserTyping: boolean = false;

  constructor(onSilenceDetected: () => void, silenceThreshold: number = 30000) {
    this.onSilenceDetected = onSilenceDetected;
    this.silenceThreshold = silenceThreshold;
  }

  start() {
    this.resetTimer();
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  resetTimer() {
    this.stop();
    this.lastActivity = Date.now();
    
    this.timer = setTimeout(() => {
      this.onSilenceDetected();
    }, this.silenceThreshold);
  }

  updateActivity() {
    this.resetTimer();
  }

  setUserTyping(typing: boolean) {
    this.isUserTyping = typing;
    if (typing) {
      this.stop(); // Pause timer when user is typing
    } else {
      this.resetTimer(); // Resume timer when user stops typing
    }
  }

  getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivity;
  }

  isActive(): boolean {
    return this.timer !== null;
  }
}

export const getSilenceReactions = (timeOfDay: string, attempt: number) => {
  // Different reactions based on attempt number
  if (attempt >= 5) {
    return [
      "Main yahan hoon, jab bhi baat karni ho... 🤗",
      "Take your time, main yahan hoon...",
      "Jab mann kare, baat karte hain...",
    ];
  }
  
  if (attempt >= 4) {
    return [
      "Thoda space chahiye? Main yahan hoon...",
      "Sab theek hai na? Main yahan hoon...",
      "Koi tension nahi, main yahan hoon...",
    ];
  }
  
  if (attempt >= 3) {
    return [
      "Sab theek hai na? 🤔",
      "Kuch soch rahe ho? 🤔",
      "Hmm... kya ho raha hai? 🤔",
    ];
  }

  const reactions = {
    morning: [
      "Hmm... kya soch rahe ho? 🤔",
      "Sab theek hai na?",
      "Kuch baat karni hai?",
      "Chai pi lenge? ☕",
      "Morning thoughts? ☀️",
      "Kya plan hai aaj?",
    ],
    afternoon: [
      "Kya kar rahe ho? 😊",
      "Lunch ho gaya?",
      "Thoda break lete hain?",
      "Kuch interesting ho raha hai?",
      "Din kaisa ja raha hai?",
      "Kya soch rahe ho?",
    ],
    evening: [
      "Evening ho gayi hai...",
      "Din kaisa gaya?",
      "Kuch baat karni hai?",
      "Chai pi lenge? ☕",
      "Evening thoughts? 🌆",
      "Kya plan hai?",
    ],
    night: [
      "Still up? 🌙",
      "Neend aa rahi hai?",
      "Kuch baat karni hai?",
      "Late night thoughts?",
      "Kya soch rahe ho? 🌙",
      "Night vibes?",
    ],
  };

  const timeReactions = reactions[timeOfDay as keyof typeof reactions] || reactions.afternoon;
  return timeReactions;
}; 