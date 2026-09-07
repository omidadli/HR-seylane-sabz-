import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  Command,
  ArrowUp,
  Plus,
  X,
  SlidersHorizontal,
  Bot,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingQuickActionsProps {
  onOpenVoiceAssistant: () => void;
  onOpenJobGenerator: () => void;
  onOpenCommandPalette: () => void;
}

export const FloatingQuickActions: React.FC<FloatingQuickActionsProps> = ({
  onOpenVoiceAssistant,
  onOpenJobGenerator,
  onOpenCommandPalette,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2.5">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-start gap-2 mb-1"
          >
            {/* Action 1: Voice AI */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenVoiceAssistant();
              }}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-700/30 text-xs font-bold transition-all transform active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>دستیار صوتی هوش مصنوعی</span>
            </button>

            {/* Action 2: Job Ad Generator */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenJobGenerator();
              }}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-300 shadow-lg text-xs font-bold transition-all transform active:scale-95 cursor-pointer border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>تولید هوشمند آگهی استخدام</span>
            </button>

            {/* Action 3: Spotlight Search (3 clicks / 1 keystroke) */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCommandPalette();
              }}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 shadow-lg text-xs font-bold transition-all transform active:scale-95 cursor-pointer border border-slate-200"
            >
              <Command className="w-4 h-4 text-emerald-600" />
              <span>جستجوی سریع (Ctrl+K)</span>
            </button>

            {/* Action 4: Scroll Top */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                scrollToTop();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>بازگشت به بالا</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-xl transition-all transform active:scale-95 cursor-pointer ${
          isOpen
            ? 'bg-slate-900 text-white rotate-45 border border-slate-700'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
        }`}
        title="دسترسی سریع به امکانات هوشمند"
        aria-label="دسترسی سریع هوشمند"
      >
        {isOpen ? <Plus className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>
    </div>
  );
};
