"use client";

import { useState } from "react";

const moods = ["Happy", "Sad", "Excited", "Angry"];

type Props = {
  onSubmit: (mood: string) => void;
};

export default function MoodSelector({ onSubmit }: Props) {
  const [selectedMood, setSelectedMood] = useState("");

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
    onSubmit(mood); // 📤 pass mood to parent
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Select Your Mood:</h2>
      <div className="flex gap-3 flex-wrap justify-center mb-4">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => handleMoodClick(mood)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedMood === mood
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-600"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}
