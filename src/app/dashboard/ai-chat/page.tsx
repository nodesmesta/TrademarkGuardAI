"use client";
import ChatBot from '@/features/dashboard/components/ChatBot';

const SUGGESTED = [
  'What are the most common trademark violations?',
  'How do I take down a counterfeit listing on Amazon?',
  'Difference between trademark and copyright?',
  'How to protect my brand on social media?',
];

export default function AIChatPage() {
  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Chat</h1>
        <p className="text-sm text-gray-500 mt-1">Ask TradeGuard AI about trademark protection, violations, and IP strategy.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('input[placeholder*="trademark"]');
              if (input) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                nativeInputValueSetter?.call(input, s);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.focus();
              }
            }}
            className="text-left text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
      <ChatBot />
    </div>
  );
}
