import { motion } from 'motion/react';
import { User, Bot } from 'lucide-react';

export function ConversationBubble({ message }) {
  const isAssistant = message.role === 'assistant';
  const containsHTML = /<[^>]*>/.test(message.content);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isAssistant ? 'justify-start' : 'justify-end'} mb-6`}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}
      
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 shadow-sm border ${
          isAssistant
            ? 'bg-white text-slate-800 rounded-bl-none border-slate-100'
            : 'bg-primary text-white rounded-br-none border-primary/20 shadow-blue-100'
        }`}
      >
        {containsHTML ? (
          <div
            className="text-[15px] leading-relaxed prose prose-slate"
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        ) : (
          <p className="text-[15px] leading-relaxed font-medium">
            {message.content}
          </p>
        )}
        
        <div className={`text-[10px] mt-1.5 opacity-50 font-bold uppercase tracking-wider ${isAssistant ? 'text-slate-400' : 'text-blue-100'}`}>
          {isAssistant ? 'Simo Assistent' : 'Jij'}
        </div>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </motion.div>
  );
}