"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AskStock({ stock }: { stock: string }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation variants
  const letterVariant = {
    hidden: { opacity: 0, y: 5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.01, duration: 0.05 },
    }),
  };

  async function handleAsk() {
    if (!stock || !question) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ask-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock, question }),
      });

      const data = await res.json();
      setAnswer(data.answer || data.error);
      setQuestion("");
    } catch {
      setAnswer("Error fetching response.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='py-4 w-full'>
      <div className='flex flex-row gap-4'>
        <input
          placeholder='Ask your question...'
          className='border p-2 w-full rounded'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={handleAsk}
          className='bg-gray-700 text-white px-4 py-2 rounded cursor-pointer w-20'
          disabled={loading}
        >
          {loading ? (
            <div className='flex space-x-2'>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className='w-2 h-2 bg-green-900 rounded-full'
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2, // stagger each dot
                  }}
                />
              ))}
            </div>
          ) : (
            "Ask"
          )}
        </button>
      </div>
      {answer && (
        <div className='mt-4 border p-3 rounded bg-gray-700 text-white'>
          <p className='whitespace-pre-wrap'>
            {answer.split("").map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariant}
                initial='hidden'
                animate='visible'
                custom={i}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
