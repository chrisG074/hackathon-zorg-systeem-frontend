import { ConversationMessage } from '../types.js';

export function ConversationBubble({ message }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isAssistant
            ? 'bg-gray-100 text-gray-900 rounded-tl-none'
            : 'bg-blue-600 text-white rounded-tr-none'
        }`}
      >
        <p className="text-base leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
