import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function VoiceVisualizer({ isListening }) {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setBars(Array.from({ length: 50 }, () => Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setBars(Array.from({ length: 50 }, () => 20));
    }
  }, [isListening]);

  return (
    <div className="flex items-center justify-center gap-1 h-20 px-4">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${
            isListening ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          animate={{
            height: isListening ? `${bars[i] || 20}%` : '20%',
          }}
          transition={{
            duration: 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
