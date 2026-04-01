import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function VoiceVisualizer({ isListening }) {
  const [bars, setBars] = useState([]);
  const barCount = 40;

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setBars(Array.from({ length: barCount }, () => Math.random() * 80 + 20));
      }, 80);
      return () => clearInterval(interval);
    } else {
      setBars(Array.from({ length: barCount }, () => 15));
    }
  }, [isListening]);

  return (
    <div className="flex items-center justify-center gap-1 h-24 px-6 bg-slate-50/50 rounded-3xl border border-slate-100 backdrop-blur-sm">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${
            isListening 
              ? 'bg-gradient-to-t from-primary to-blue-400 shadow-[0_0_10px_rgba(15,76,129,0.3)]' 
              : 'bg-slate-300'
          }`}
          animate={{
            height: isListening ? `${bars[i] || 20}%` : '15%',
            opacity: isListening ? 1 : 0.6
          }}
          transition={{
            duration: 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}