import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Check, Scale } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ConnectorRequestFormProps {
  onClose: () => void;
  userEmail?: string;
}

const ConnectorRequestForm: React.FC<ConnectorRequestFormProps> = ({ onClose, userEmail = '' }) => {
  const [step, setStep] = useState(1);
  const [connectorName, setConnectorName] = useState('');
  const [email, setEmail] = useState(userEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!connectorName || !email) return;
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('connector_requests').insert({
        connector_name: connectorName,
        user_email: email,
        user_id: user?.id
      });

      if (error) throw error;
      setIsSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error('Error submitting connector request:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (step === 1 && connectorName) setStep(2);
      else if (step === 2 && email) handleSubmit();
    } else if (e.key === 'Enter' && step === 1 && connectorName) {
      setStep(2);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col font-sans overflow-hidden">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
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
                      {step === 1 ? (
                        <>Which data connector would you like us to add next?<span className="text-primary">*</span></>
                      ) : (
                        <>What's the email associated with your Lawlify account?<span className="text-primary">*</span></>
                      )}
                    </h2>
                    {step === 2 && (
                      <p className="text-gray-500 text-lg">
                        If necessary, we'll only contact you regarding your answer, not for marketing purposes.
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative pl-10">
                  <input
                    autoFocus
                    type={step === 1 ? "text" : "email"}
                    placeholder={step === 1 ? "Type your answer here..." : "name@example.com"}
                    value={step === 1 ? connectorName : email}
                    onChange={(e) => step === 1 ? setConnectorName(e.target.value) : setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full text-3xl text-primary placeholder-gray-200 border-b-2 border-gray-100 focus:border-primary focus:outline-none py-2 bg-transparent transition-colors"
                  />
                  
                  <div className="mt-8 flex items-center gap-4">
                    {step === 1 ? (
                      <button
                        onClick={() => connectorName && setStep(2)}
                        disabled={!connectorName}
                        className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
                      >
                        OK
                      </button>
                    ) : (
                      <div className="flex items-center gap-6">
                        <button
                          onClick={handleSubmit}
                          disabled={!email || isSubmitting}
                          className="bg-primary text-white px-10 py-3 rounded-lg text-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95 flex items-center gap-2"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit'}
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
                <h2 className="text-4xl font-bold text-black">Thank you!</h2>
                <p className="text-xl text-gray-500">Your request has been registered. We're prioritizing our next bridges based on your feedback.</p>
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
            onClick={() => setStep(1)}
            className="p-3 bg-white hover:bg-gray-50 text-primary disabled:opacity-30 disabled:text-gray-300 transition-colors border-r border-gray-100"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button 
            disabled={step === 2 || !connectorName}
            onClick={() => setStep(2)}
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

export default ConnectorRequestForm;
