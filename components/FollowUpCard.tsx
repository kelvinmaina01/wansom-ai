import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface Question {
  id: string;
  text: string;
  type: 'choice' | 'multi-choice' | 'text';
  options?: string[];
  placeholder?: string;
}

interface FollowUpCardProps {
  questions: Question[];
  onSubmit: (answers: Record<string, string | string[]>) => void;
  onClose: () => void;
}

const FollowUpCard: React.FC<FollowUpCardProps> = ({ questions, onSubmit, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [customInput, setCustomInput] = useState('');

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (option: string) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    if (currentQuestion.type === 'choice') {
      setAnswers(updatedAnswers);
      if (!isLast) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onSubmit(updatedAnswers);
      }
    } else {
      const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(a => a !== option)
        : [...currentAnswers, option];
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: newAnswers }));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-8"
    >
      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <h3 className="text-xl font-medium text-gray-900 tracking-tight">
          {currentQuestion.text}
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
            <button 
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="p-1 hover:text-black disabled:opacity-30 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="tabular-nums">{currentIndex + 1} of {questions.length}</span>
            <button 
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] && currentQuestion.type !== 'text'}
              className="p-1 hover:text-black disabled:opacity-30 transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Options List */}
      <div className="p-8 space-y-3">
        {currentQuestion.options?.map((option, idx) => {
          const isSelected = currentQuestion.type === 'choice' 
            ? answers[currentQuestion.id] === option
            : (answers[currentQuestion.id] as string[] || []).includes(option);

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 group ${
                isSelected 
                  ? 'bg-white border-black shadow-md ring-1 ring-black/5' 
                  : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                isSelected ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
              }`}>
                {idx + 1}
              </div>
              <span className={`flex-1 text-left font-medium ${isSelected ? 'text-black' : 'text-gray-600'}`}>
                {option}
              </span>
              {isSelected && <CheckCircleIcon className="w-5 h-5 text-primary" />}
            </button>
          );
        })}

        {/* Custom Input / "Something else" */}
        <div className="pt-4 border-t border-gray-100 mt-6">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
              <PencilIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Something else"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customInput.trim()) {
                  setAnswers(prev => ({ ...prev, [currentQuestion.id]: customInput }));
                  setCustomInput('');
                  handleNext();
                }
              }}
              className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-200 rounded-2xl py-4 pl-14 pr-24 text-sm font-medium transition-all outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
               <button 
                onClick={handleNext}
                className="px-6 py-2 bg-white border border-gray-200 text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
               >
                 {isLast ? 'Submit' : 'Skip'}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Instructions (Claude style) */}
      <div className="px-8 py-3 bg-gray-50/50 flex items-center justify-center gap-6 border-t border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="bg-gray-200 px-1 rounded">↑</span>
          <span className="bg-gray-200 px-1 rounded">↓</span>
          to navigate
        </span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="bg-gray-200 px-1 rounded">Enter</span>
          to select
        </span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="bg-gray-200 px-1 rounded">Esc</span>
          to skip
        </span>
      </div>
    </motion.div>
  );
};

export default FollowUpCard;
