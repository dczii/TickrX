"use client";

import { motion } from "framer-motion";
import React from "react";

type TickrXSpinnerProps = {
  size?: number; // px
  accent?: string; // e.g. "text-emerald-400"
  className?: string;
};

export default function TickrXSpinner({
  size = 32,
  accent = "text-emerald-400",
  className = "",
}: TickrXSpinnerProps) {
  const s = `${size}px`;

  return (
    <div
      role='status'
      aria-label='Loading'
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: s, height: s }}
    >
      <svg viewBox='0 0 40 40' className='w-full h-full' fill='none'>
        {/* white ring */}
        <circle cx='20' cy='20' r='16' className='stroke-white/25' strokeWidth='4' />
        {/* rotating arc */}
        <motion.circle
          cx='20'
          cy='20'
          r='16'
          className='stroke-white'
          strokeWidth='4'
          strokeLinecap='round'
          strokeDasharray='50'
          strokeDashoffset='20'
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* tiny rising tick (logo callback) */}
        <motion.path
          d='M15 24 L19 20 L22 22 L26 18'
          className={`${accent}`}
          stroke='currentColor'
          strokeWidth='3.5'
          strokeLinecap='round'
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0.2, 1, 0.2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
