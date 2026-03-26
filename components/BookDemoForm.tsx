import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Check, Scale, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const BookDemoForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !firmName || !email || !useCase) return;
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('demo_requests').insert({
        full_name: fullName,
        firm_name: firmName,
        email: email,
        use_case: useCase,
        user_id: user?.id
      });

      if (error) throw error;
      setIsSuccess(true);
      setTimeout(() => navigate(-1), 3000);
    } catch (err) {
      console.error('Error submitting demo request:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (step < 4 && getCurrentValue()) setStep(prev => prev + 1);
      else if (step === 4 && useCase) handleSubmit();
    } else if (e.key === 'Enter' && step < 4 && getCurrentValue()) {
      setStep(prev => prev + 1);
    }
  };

  const getCurrentValue = () => {
    switch (step) {
      case 1: return fullName;
      case 2: return firmName;
      case 3: return email;
      case 4: return useCase;
      default: return '';
    }
  };

  const updateCurrentValue = (val: string) => {
    switch (step) {
      case 1: setFullName(val); break;
      case 2: setFirmName(val); break;
      case 3: setEmail(val); break;
      case 4: setUseCase(val); break;
    }
  };

  const getQuestion = () => {
    switch (step) {
      case 1: return <>What's your full name?<span className="text-primary">*</span></>;
      case 2: return <>What's your firm or organization's name?<span className="text-primary">*</span></>;
      case 3: return <>What's your work email?<span className="text-primary">*</span></>;
      case 4: return <>Tell us a bit about your use case for Lawlify Enterprise.<span className="text-primary">*</span></>;
      default: return '';
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case 1: return "Type your answer here...";
      case 2: return "Firm name...";
      case 3: return "name@company.com";
      case 4: return "Type your use case here...";
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col font-sans overflow-hidden">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-black transition-colors group z-10"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Back</span>
      </button>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-8"
              >
                <div className="flex items-start gap-4">
                  <span className="bg-primary text-white w-6 h-6 flex items-center justify-center rounded text-xs font-bold mt-1.5 shrink-0">
                    {step}
                  </span>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-medium text-black leading-tight">
                      {getQuestion()}
                    </h2>
                    {step === 3 && (
                      <p className="text-gray-500 text-lg">
                        We'll use this to coordinate with your team. No marketing spam, ever.
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative pl-10">
                  {step === 4 ? (
                    <textarea
                      autoFocus
                      placeholder={getPlaceholder()}
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full text-3xl text-primary placeholder-gray-200 border-b-2 border-gray-100 focus:border-primary focus:outline-none py-2 bg-transparent transition-colors min-h-[150px] resize-none"
                    />
                  ) : (
                    <input
                      autoFocus
                      type={step === 3 ? "email" : "text"}
                      placeholder={getPlaceholder()}
                      value={getCurrentValue()}
                      onChange={(e) => updateCurrentValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full text-3xl text-primary placeholder-gray-200 border-b-2 border-gray-100 focus:border-primary focus:outline-none py-2 bg-transparent transition-colors"
                    />
                  )}
                  
                  <div className="mt-8 flex items-center gap-4">
                    {step < 4 ? (
                      <button
                        onClick={() => getCurrentValue() && setStep(prev => prev + 1)}
                        disabled={!getCurrentValue()}
                        className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
                      >
                        OK
                      </button>
                    ) : (
                      <div className="flex items-center gap-6">
                        <button
                          onClick={handleSubmit}
                          disabled={!useCase || isSubmitting}
                          className="bg-primary text-white px-10 py-3 rounded-lg text-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95 flex items-center gap-2"
                        >
                          {isSubmitting ? 'Submitting...' : 'Book My Demo'}
                        </button>
                        <span className="text-sm text-gray-400 font-medium">
                          press <span className="font-bold">Ctrl + Enter</span> ↵
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-4xl font-bold text-black">We've received your request!</h2>
                <p className="text-xl text-gray-500">A Lawlify Enterprise specialist will reach out to you within 24 hours to schedule your walkthrough.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="absolute bottom-12 right-12 flex items-center gap-1">
        <div className="flex rounded-lg overflow-hidden border border-gray-100 shadow-sm">
          <button 
            disabled={step === 1}
            onClick={() => setStep(prev => prev - 1)}
            className="p-3 bg-white hover:bg-gray-50 text-primary disabled:opacity-30 disabled:text-gray-300 transition-colors border-r border-gray-100"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button 
            disabled={step === 4 || !getCurrentValue()}
            onClick={() => setStep(prev => prev + 1)}
            className="p-3 bg-white hover:bg-gray-50 text-primary disabled:opacity-30 disabled:text-gray-300 transition-colors"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-12 flex items-center gap-4 group">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xs ring-8 ring-primary/5 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
          <Scale className="w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-black uppercase tracking-[0.3em] font-display">Lawlify AI</span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-60">Intelligence Sovereign</span>
        </div>
      </div>
    </div>
  );
};

export default BookDemoForm;
