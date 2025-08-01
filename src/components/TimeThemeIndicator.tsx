"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TimeThemeIndicatorProps {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  emotion: string;
}

export default function TimeThemeIndicator({ timeOfDay, emotion }: TimeThemeIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showThemeTransition, setShowThemeTransition] = useState(false);
  const [previousTimeOfDay, setPreviousTimeOfDay] = useState(timeOfDay);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show theme transition when time of day changes
  useEffect(() => {
    if (previousTimeOfDay !== timeOfDay) {
      setShowThemeTransition(true);
      setPreviousTimeOfDay(timeOfDay);
      
      setTimeout(() => {
        setShowThemeTransition(false);
      }, 3000);
    }
  }, [timeOfDay, previousTimeOfDay]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getThemeName = () => {
    switch (timeOfDay) {
      case "morning": return "🌅 Morning Bliss";
      case "afternoon": return "☀️ Afternoon Calm";
      case "evening": return "🌆 Evening Serenity";
      case "night": return "🌙 Night Dreams";
      default: return "Default Theme";
    }
  };

  const getEmotionName = () => {
    switch (emotion) {
      case "happy": return "😊 Joyful";
      case "sad": return "😢 Melancholic";
      case "caring": return "💖 Compassionate";
      case "excited": return "🎉 Energetic";
      case "calm": return "😌 Peaceful";
      case "tired": return "😴 Restful";
      case "hurt": return "💔 Empathetic";
      default: return "⚖️ Balanced";
    }
  };

  const getCursorColor = () => {
    switch (emotion) {
      case "happy": return "rgba(250, 204, 21, 0.3)";
      case "sad": return "rgba(96, 165, 250, 0.3)";
      case "caring": return "rgba(244, 114, 182, 0.3)";
      case "excited": return "rgba(244, 114, 182, 0.4)";
      case "calm": return "rgba(74, 222, 128, 0.3)";
      case "tired": return "rgba(156, 163, 175, 0.3)";
      case "hurt": return "rgba(248, 113, 113, 0.3)";
      default: return "rgba(96, 165, 250, 0.3)";
    }
  };

  const getCursorSize = () => {
    switch (timeOfDay) {
      case "morning": return 20;
      case "afternoon": return 25;
      case "evening": return 30;
      case "night": return 35;
      default: return 25;
    }
  };

  return (
    <>
      {/* Theme Transition Notification */}
      {showThemeTransition && (
        <motion.div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl px-8 py-6 text-center shadow-2xl z-50"
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-3xl mb-2">{getThemeName().split(' ')[0]}</div>
          <div className="text-lg font-semibold text-gray-800 mb-1">
            {getThemeName().split(' ').slice(1).join(' ')}
          </div>
          <div className="text-sm text-gray-600">
            Theme activated
          </div>
        </motion.div>
      )}

      {/* Time and Theme Indicator */}
      <motion.div
        className="fixed top-4 right-4 bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 text-sm shadow-lg z-50"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-end space-y-1">
          <div className="text-lg font-bold text-gray-800">
            {currentTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="text-xs text-gray-600 capitalize">
            {getThemeName()} • {getEmotionName()}
          </div>
          <div className="text-xs text-gray-500">
            {currentTime.toLocaleDateString([], { 
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </motion.div>

      {/* Custom Cursor */}
      <motion.div
        className="fixed pointer-events-none z-50 rounded-full mix-blend-multiply"
        style={{
          left: cursorPosition.x - getCursorSize() / 2,
          top: cursorPosition.y - getCursorSize() / 2,
          width: getCursorSize(),
          height: getCursorSize(),
          backgroundColor: getCursorColor(),
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Cursor Trail */}
      <motion.div
        className="fixed pointer-events-none z-40 rounded-full"
        style={{
          left: cursorPosition.x - 5,
          top: cursorPosition.y - 5,
          width: 10,
          height: 10,
          backgroundColor: getCursorColor(),
        }}
        animate={{
          scale: [0.5, 1, 0.5],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );
} 