"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import ChatInterface from "@/components/ChatInterface";
import EmotionBackground from "@/components/EmotionBackground";
import TimeThemeIndicator from "@/components/TimeThemeIndicator";
import { useChatStore, Message } from "@/store/chatStore";
import { SilenceWatcher, getSilenceReactions } from "@/utils/silenceWatcher";

const getGreetingByTime = (timeOfDay: string) => {
  const greetings = {
    morning: [
      "Good morning! 🌅 Kya haal hai?",
      "Morning! ☀️ Kaise ho?",
      "Good morning! 🌅 Sab theek?",
      "Morning! ☀️ Kya soch rahe ho?",
      "Good morning! 🌅 Din shuru ho gaya hai",
    ],
    afternoon: [
      "Hey! 😊 Kya kar rahe ho?",
      "Hi! ☀️ Lunch ho gaya?",
      "Hey there! 😊 Kaise ho?",
      "Hi! ☀️ Din kaisa ja raha hai?",
      "Hey! 😊 Kuch interesting ho raha hai?",
    ],
    evening: [
      "Evening! 🌆 Din kaisa gaya?",
      "Good evening! 🌆 Kaise ho?",
      "Evening! 🌆 Kya plan hai?",
      "Good evening! 🌆 Din kaisa tha?",
      "Evening! 🌆 Chai pi lenge? ☕",
    ],
    night: [
      "Still up? 🌙 Kya ho raha hai?",
      "Hey! 🌙 Neend aa rahi hai?",
      "Still up? 🌙 Kya soch rahe ho?",
      "Hey! 🌙 Late night thoughts?",
      "Still up? 🌙 Kuch baat karni hai?",
    ],
  };

  const timeGreetings = greetings[timeOfDay as keyof typeof greetings] || greetings.afternoon;
  return timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
};

const getInitialEmotion = (timeOfDay: string) => {
  switch (timeOfDay) {
    case "morning":
      return "excited";
    case "afternoon":
      return "calm";
    case "evening":
      return "calm";
    case "night":
      return "tired";
    default:
      return "calm";
  }
};

export default function Home() {
  const {
    messages,
    isLoading,
    aiEmotion,
    timeOfDay,
    hasAutoInitiated,
    silenceAttempts,
    addMessage,
    setLoading,
    setAiEmotion,
    setAutoInitiated,
    incrementSilenceAttempts,
    resetSilenceAttempts,
  } = useChatStore();

  const [isTyping, setIsTyping] = useState(false);
  const silenceWatcherRef = useRef<SilenceWatcher | null>(null);

  // Auto-initiation effect
  useEffect(() => {
    if (!hasAutoInitiated) {
      const timer = setTimeout(() => {
        autoInitiate();
      }, 1000); // Wait 1 second after page load

      return () => clearTimeout(timer);
    }
  }, [hasAutoInitiated]);

  // Initialize silence watcher
  useEffect(() => {
    if (hasAutoInitiated && !silenceWatcherRef.current) {
      silenceWatcherRef.current = new SilenceWatcher(() => {
        handleSilence();
      });
      silenceWatcherRef.current.start();
    }

    return () => {
      silenceWatcherRef.current?.stop();
    };
  }, [hasAutoInitiated]);

  const handleSilence = () => {
    // Stop if we've tried too many times
    if (silenceAttempts >= 5) {
      return;
    }
    
    incrementSilenceAttempts();
    const reactions = getSilenceReactions(timeOfDay, silenceAttempts + 1);
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    addMessage({
      text: randomReaction,
      sender: "ai",
      emotion: "caring",
    });
    
    // Restart silence watcher after a longer delay
    setTimeout(() => {
      silenceWatcherRef.current?.start();
    }, 5000); // Wait 5 seconds before starting next silence detection
  };

  const handleUserTyping = (typing: boolean) => {
    silenceWatcherRef.current?.setUserTyping(typing);
  };

  const autoInitiate = async () => {
    setAutoInitiated(true);
    setAiEmotion(getInitialEmotion(timeOfDay));
    
    // Add initial greeting
    addMessage({
      text: getGreetingByTime(timeOfDay),
      sender: "ai",
      emotion: getInitialEmotion(timeOfDay),
    });

    // Simulate typing delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const sendMessage = async (message: string) => {
    // Add user message
    addMessage({
      text: message,
      sender: "user",
    });

    // Reset silence watcher and attempts when user sends a message
    silenceWatcherRef.current?.updateActivity();
    resetSilenceAttempts();

    setLoading(true);

    const requestBody = { 
      message,
      context: messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n'),
      timeOfDay,
      aiEmotion
    };
    
    console.log('Sending request:', requestBody);

    try {
      const response = await fetch("http://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from FeelMate");
      }

      const data = await response.json();
      
      // Add AI response
      addMessage({
        text: data.reply,
        sender: "ai",
        emotion: data.emotion || aiEmotion,
      });

      // Update AI emotion if provided
      if (data.emotion) {
        console.log('AI Emotion changed to:', data.emotion);
        console.log('Previous emotion was:', aiEmotion);
        setAiEmotion(data.emotion);
        
        // Force re-render of background
        setTimeout(() => {
          console.log('Forcing background update for emotion:', data.emotion);
        }, 100);
      } else {
        console.log('No emotion provided in response, keeping:', aiEmotion);
      }

    } catch (error) {
      console.error("Error:", error);
      addMessage({
        text: "Sorry, I'm having trouble connecting right now. Can you try again?",
        sender: "ai",
        emotion: "sad",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Emotion-based background */}
      <EmotionBackground key={aiEmotion} emotion={aiEmotion} timeOfDay={timeOfDay} />
      
      {/* Time and Theme Indicator */}
      <TimeThemeIndicator timeOfDay={timeOfDay} emotion={aiEmotion} />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6 text-center"
      >
        <motion.h1 
          className="text-4xl font-bold text-gray-800"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          FeelMate
        </motion.h1>
        <p className="text-gray-600 mt-2">Your Emotion-Aware AI Companion</p>
      </motion.header>

      {/* Chat Interface */}
      <div className="flex-1 relative z-10">
        <ChatInterface
          onSendMessage={sendMessage}
          messages={messages}
          isLoading={isLoading || isTyping}
          aiEmotion={aiEmotion}
          onUserTyping={handleUserTyping}
        />
      </div>

      {/* AI Status Indicator */}
      <motion.div 
        className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-700 shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        key={aiEmotion} // Force re-render when emotion changes
      >
        <div className="flex items-center space-x-2">
          <motion.div 
            className={`w-2 h-2 rounded-full ${
              aiEmotion === 'happy' ? 'bg-yellow-400' :
              aiEmotion === 'sad' ? 'bg-blue-400' :
              aiEmotion === 'caring' ? 'bg-pink-400' :
              aiEmotion === 'excited' ? 'bg-pink-400' :
              aiEmotion === 'calm' ? 'bg-green-400' :
              aiEmotion === 'tired' ? 'bg-gray-400' :
              aiEmotion === 'hurt' ? 'bg-red-400' : 'bg-blue-400'
            }`}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.5 }}
          />
          <span className="capitalize">{aiEmotion}</span>
        </div>
      </motion.div>
    </main>
  );
}
