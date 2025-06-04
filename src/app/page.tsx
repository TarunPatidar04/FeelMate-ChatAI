"use client";

import { useState } from "react";
import MoodSelector from "@/components/MoodSelector";

export default function Home() {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (mood: string) => {
    console.log("Selected mood:", mood);
    setLoading(true);
    setReply("");

    try {
      const res = await fetch("http://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: mood }), // 💡 Use "message" key as expected by backend
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response from FeelMate");
      }

      const data = await res.json();
      console.log("FeelMate says:", data.reply);
    } catch (error) {
      console.error("Error fetching mood response:", error);
      setReply("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-10 text-blue-700">FeelMate</h1>

      <MoodSelector onSubmit={handleSubmit} />

      <div className="mt-8 text-lg text-gray-800 max-w-xl text-center">
        {loading ? "Thinking..." : reply}
      </div>
    </main>
  );
}
