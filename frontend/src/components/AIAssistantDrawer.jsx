import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import MedicalDisclaimer from './MedicalDisclaimer';

export default function AIAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste. I am Prana, your empathetic wellness companion. I can suggest calming sequences, breathwork ratios, and mindful routines. How is your body and mind feeling right now?'
    }
  ]);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.sendAIChat(text, historyPayload);
      if (res?.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I invite you to pause and take a gentle breath. I encountered a brief pause connecting to the server, but remember to always honor your body and rest whenever needed.'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const suggestions = [
    'How do I ease neck tension after screen time?',
    'Teach me a soothing bedtime breath practice',
    'What are beginner modifications for Downward Dog?',
    'Gentle routine for anxious overwhelmed feelings'
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-sage-800 text-white shadow-xl hover:bg-sage-700 hover:scale-105 active:scale-95 transition-all duration-300 group"
          aria-label="Open Prana AI Wellness Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-sage-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-semibold tracking-wide pr-1">Ask Prana AI</span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-sage-200 flex flex-col animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sage-800 to-sage-900 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sage-700/80 flex items-center justify-center text-sage-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold leading-tight">Prana Wellness Guide</h3>
                <span className="text-[11px] text-sage-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Gemini-Powered Mindful Assistant
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Permanent Medical Disclaimer Banner (Requirement: Section 18) */}
          <div className="p-3 bg-amber-50 border-b border-amber-200/80">
            <MedicalDisclaimer compact={true} />
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sand-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 text-xs md:text-sm ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-sage-200 text-sage-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-sage-700 text-white rounded-tr-none'
                      : 'bg-white border border-sage-200/90 text-stone-800 shadow-sm rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-stone-300 text-stone-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3 text-xs text-stone-500 items-center">
                <div className="w-7 h-7 rounded-lg bg-sage-100 text-sage-700 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <span className="italic">Prana is contemplating a serene reply...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Starter Chips */}
          <div className="p-2.5 bg-white border-t border-sage-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-sage-50 hover:bg-sage-100 text-[11px] text-sage-800 border border-sage-200/60 font-medium transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-sage-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about poses, breath, or calming routines..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500 text-xs md:text-sm bg-sand-50/40"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-2.5 rounded-xl bg-sage-700 text-white hover:bg-sage-800 disabled:opacity-40 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
