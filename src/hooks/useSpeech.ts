// Hook for Text-to-Speech functionality
export const useSpeech = () => {
  const speak = (text: string, onEnd?: () => void) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nl-NL';
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      if (onEnd) {
        utterance.onend = onEnd;
      }

      // Small delay to ensure previous speech is cancelled
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);

      return utterance;
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return { speak, stop };
};
