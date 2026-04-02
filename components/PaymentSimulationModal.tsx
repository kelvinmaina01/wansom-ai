import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, CreditCard, ChevronRight, 
  CheckCircle2, AlertCircle, Loader2, Globe,
  Lock, ArrowLeft
} from 'lucide-react';

interface PaymentSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  currency?: string;
  email: string;
}

const PaymentSimulationModal: React.FC<PaymentSimulationModalProps> = ({ 
  isOpen, onClose, onSuccess, amount, currency = 'NGN', email 
}) => {
  const [step, setStep] = useState<'method' | 'card' | 'processing' | 'success'>('method');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setStep('method');
      setCardNumber('');
      setExpiry('');
      setCvv('');
    }
  }, [isOpen]);

  const handleProcessPayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[20px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Left Panel (Summary) */}
          <div className="w-full md:w-[160px] bg-[#011b33] text-white p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            <div>
               <div className="flex items-center gap-2 mb-8">
                 <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-tighter">Paystack UI</span>
               </div>
               
               <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Pay</p>
               <h2 className="text-xl font-black mb-1">{currency} {amount.toLocaleString()}</h2>
               <p className="text-[10px] text-gray-400 font-medium truncate">{email}</p>
            </div>

            <div className="hidden md:block">
               <div className="flex items-center gap-2 text-[9px] text-gray-400 font-medium">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  Secured by Paystack
               </div>
            </div>
          </div>

          {/* Right Panel (Actions) */}
          <div className="flex-1 bg-white p-8 relative min-h-[400px] flex flex-col">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {step === 'method' && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-6 text-[#011b33]">Choose payment method</h3>
                <div className="space-y-3">
                   <button 
                     onClick={() => setStep('card')}
                     className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-500 transition-all group"
                   >
                     <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="font-bold text-sm text-[#011b33]">Card</span>
                     </div>
                     <ChevronRight className="w-4 h-4 text-gray-300" />
                   </button>
                   
                   {['Bank', 'Transfer', 'USSD', 'Visa QR'].map((item) => (
                     <button key={item} className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-50 cursor-not-allowed group">
                       <div className="flex items-center gap-3">
                         <Globe className="w-5 h-5 text-gray-400" />
                         <span className="font-bold text-sm text-[#011b33]">{item}</span>
                       </div>
                       <ChevronRight className="w-4 h-4 text-gray-300" />
                     </button>
                   ))}
                </div>
              </div>
            )}

            {step === 'card' && (
              <div className="flex-1 flex flex-col">
                <button 
                   onClick={() => setStep('method')}
                   className="flex items-center gap-2 text-xs font-bold text-blue-500 mb-6 hover:underline"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Change payment method
                </button>
                <h3 className="text-lg font-bold mb-6 text-[#011b33]">Enter your card details</h3>
                
                <div className="space-y-4">
                   <div>
                     <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Card Number</label>
                     <input 
                       type="text" 
                       placeholder="0000 0000 0000 0000"
                       className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                       value={cardNumber}
                       onChange={e => setCardNumber(e.target.value)}
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Expiry Date</label>
                       <input 
                         type="text" 
                         placeholder="MM / YY"
                         className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                         value={expiry}
                         onChange={e => setExpiry(e.target.value)}
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">CVV</label>
                       <input 
                         type="text" 
                         placeholder="123"
                         className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                         value={cvv}
                         onChange={e => setCvv(e.target.value)}
                       />
                     </div>
                   </div>

                   <button 
                     onClick={handleProcessPayment}
                     disabled={!cardNumber}
                     className="w-full py-4 bg-[#3bb75e] hover:bg-[#2d9d4a] text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-4 disabled:opacity-50 disabled:shadow-none"
                   >
                     Pay {currency} {amount.toLocaleString()}
                   </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                 <h3 className="text-xl font-bold mb-2 text-[#011b33]">Processing Payment</h3>
                 <p className="text-sm text-gray-500 px-6">Please do not close this window while we verify your transaction.</p>
              </div>
            )}

            {step === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <motion.div
                   initial={{ scale: 0.5, opacity: 0 }}
                   animate={{ scale: 1.2, opacity: 1 }}
                   className="w-16 h-16 bg-[#3bb75e]/10 text-[#3bb75e] rounded-full flex items-center justify-center mb-6"
                 >
                   <CheckCircle2 className="w-10 h-10" />
                 </motion.div>
                 <h3 className="text-xl font-bold mb-2 text-[#011b33]">Payment Successful</h3>
                 <p className="text-sm text-gray-500 px-6">Redirecting you back to Lawlify AI...</p>
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 text-[9px] text-gray-400 font-medium">
                    <span>Ref: PAY-LW-{(Math.random()*1000000).toFixed(0)}</span>
                 </div>
              </div>
            )}
            
            <div className="mt-auto pt-6 flex items-center justify-center opacity-30 gap-2">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Simulated Environment</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentSimulationModal;
