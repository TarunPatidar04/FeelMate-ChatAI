"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface EmotionBackgroundProps {
  emotion: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

export default function EmotionBackground({ emotion, timeOfDay }: EmotionBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; type: string; size: number }>>([]);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Generate varied particles for animations
    const particleTypes = ['circle', 'square', 'triangle', 'star', 'wave'];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, [emotion]); // Regenerate particles when emotion changes

  // Change animation phase every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getBackgroundStyle = () => {
    const baseStyle = "fixed inset-0 -z-10 transition-all duration-1000";
    
    switch (emotion) {
      case "happy":
        return `${baseStyle} bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-100`;
      case "sad":
        return `${baseStyle} bg-gradient-to-br from-blue-200 via-purple-100 to-indigo-100`;
      case "caring":
        return `${baseStyle} bg-gradient-to-br from-pink-200 via-purple-100 to-blue-100`;
      case "excited":
        return `${baseStyle} bg-gradient-to-br from-pink-200 via-red-100 to-orange-100`;
      case "calm":
        return `${baseStyle} bg-gradient-to-br from-green-200 via-teal-100 to-blue-100`;
      case "tired":
        return `${baseStyle} bg-gradient-to-br from-gray-200 via-slate-100 to-zinc-100`;
      case "hurt":
        return `${baseStyle} bg-gradient-to-br from-red-200 via-pink-100 to-purple-100`;
      default:
        return `${baseStyle} bg-gradient-to-br from-blue-200 via-purple-100 to-indigo-100`;
    }
  };

  const getTimeStyle = () => {
    switch (timeOfDay) {
      case "morning":
        return "brightness-110";
      case "afternoon":
        return "brightness-100";
      case "evening":
        return "brightness-90";
      case "night":
        return "brightness-70";
      default:
        return "brightness-100";
    }
  };

    const getParticleStyle = (particle: any) => {
    const baseStyle = `absolute opacity-60`;
    const size = particle.size;
    
    switch (particle.type) {
      case 'circle':
        return `${baseStyle} w-${size} h-${size} rounded-full`;
      case 'square':
        return `${baseStyle} w-${size} h-${size}`;
      case 'triangle':
        return `${baseStyle} w-0 h-0 border-l-${size} border-r-${size} border-b-${size * 2} border-transparent border-b-current`;
      case 'star':
        return `${baseStyle} w-${size} h-${size} transform rotate-45`;
      case 'wave':
        return `${baseStyle} w-${size * 2} h-${size} rounded-full`;
      default:
        return `${baseStyle} w-${size} h-${size} rounded-full`;
    }
  };

  const getEmotionColor = () => {
    switch (emotion) {
      case "happy": return "bg-yellow-400";
      case "sad": return "bg-blue-400";
      case "caring": return "bg-pink-400";
      case "excited": return "bg-pink-400";
      case "calm": return "bg-green-400";
      case "tired": return "bg-gray-400";
      case "hurt": return "bg-red-400";
      default: return "bg-blue-400";
    }
  };

  const getEmotionColorValue = () => {
    switch (emotion) {
      case "happy": return "rgb(250 204 21)";
      case "sad": return "rgb(96 165 250)";
      case "caring": return "rgb(244 114 182)";
      case "excited": return "rgb(244 114 182)";
      case "calm": return "rgb(74 222 128)";
      case "tired": return "rgb(156 163 175)";
      case "hurt": return "rgb(248 113 113)";
      default: return "rgb(96 165 250)";
    }
  };

  const renderEmotionParticles = () => {

    const getAnimationVariants = (particle: any) => {
      const baseVariants = {
        phase0: {
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        },
        phase1: {
          y: [0, -30, 0],
          x: [0, -15, 0],
          opacity: [0.3, 0.9, 0.3],
          scale: [1, 1.5, 1],
          rotate: [0, -180, -360],
        },
        phase2: {
          y: [0, -25, 0],
          x: [0, 20, 0],
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 180],
        },
        phase3: {
          y: [0, -15, 0],
          x: [0, -25, 0],
          opacity: [0.6, 0.8, 0.6],
          scale: [1, 1.4, 1],
          rotate: [0, -90, -180],
        }
      };

      return baseVariants[`phase${animationPhase}` as keyof typeof baseVariants] || baseVariants.phase0;
    };

    return particles.map((particle) => (
      <motion.div
        key={particle.id}
        className={`${getParticleStyle(particle)} ${getEmotionColor()}`}
        style={{ 
          left: `${particle.x}%`, 
          top: `${particle.y}%`,
          width: `${particle.size * 4}px`,
          height: `${particle.size * 4}px`
        }}
        animate={getAnimationVariants(particle)}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: particle.delay,
          ease: "easeInOut"
        }}
      />
    ));
  };

  return (
    <div className={`${getBackgroundStyle()} ${getTimeStyle()}`}>
      {renderEmotionParticles()}
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-32 h-32 rounded-full opacity-10 blur-xl"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              background: `radial-gradient(circle, ${getEmotionColorValue()} 0%, transparent 70%)`
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Wave effects */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute w-full h-full"
            style={{
              background: `linear-gradient(45deg, transparent 30%, ${getEmotionColorValue()} 50%, transparent 70%)`,
              opacity: 0.1 + i * 0.05,
              bottom: i * 10
            }}
            animate={{
              x: [0, -100, 0],
              scaleY: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
    </div>
  );
} 