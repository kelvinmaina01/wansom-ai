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
          className="relative w-[96vw] md:w-[70vw] lg:w-[50vw] max-w-[1200px] max-h-[95vh] h-auto flex flex-col md:flex-row bg-white rounded-3xl overflow-y-auto shadow-2xl scrollbar-hide"
        >
          {/* Left Panel (Summary) */}
          <div className="w-full md:w-[220px] bg-[#011b33] text-white p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="relative z-10">
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

            <div className="hidden md:block relative z-10">
               <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium bg-white/5 py-2 px-3 rounded-lg border border-white/10 w-max">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  Secured by Paystack
               </div>
            </div>
          </div>

          {/* Right Panel (Actions) */}
          <div className="flex-1 bg-white p-6 md:p-10 relative min-h-[400px] md:min-h-[480px] flex flex-col">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {step === 'method' && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-2xl font-black mb-8 text-[#011b33]">Choose payment method</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => setStep('card')}
                     className="w-full flex items-center justify-between p-5 bg-gray-50 border-2 border-gray-100 rounded-xl hover:border-blue-500 transition-all group"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          <CreditCard className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-bold text-[15px] text-[#011b33]">Card</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                   </button>
                   
                   {['Bank', 'Transfer', 'USSD', 'Visa QR'].map((item) => (
                     <button key={item} className="w-full flex items-center justify-between p-5 bg-gray-50 border-2 border-gray-100 rounded-xl opacity-50 cursor-not-allowed group">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                           <Globe className="w-5 h-5 text-gray-400" />
                         </div>
                         <span className="font-bold text-[15px] text-[#011b33]">{item}</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-gray-300" />
                     </button>
                   ))}
                </div>
              </div>
            )}

            {step === 'card' && (
              <div className="flex-1 flex flex-col">
                <button 
                   onClick={() => setStep('method')}
                   className="flex items-center gap-2 text-sm font-bold text-blue-500 mb-8 hover:underline w-max"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change payment method
                </button>
                <h3 className="text-2xl font-black mb-8 text-[#011b33]">Enter card details</h3>
                
                <div className="space-y-6">
                   <div>
                     <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">Card Number</label>
                     <input 
                       type="text" 
                       placeholder="0000 0000 0000 0000"
                       className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-[15px] font-mono tracking-widest focus:border-blue-500 outline-none transition-colors"
                       value={cardNumber}
                       onChange={e => setCardNumber(e.target.value)}
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-5">
                     <div>
                       <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">Expiry Date</label>
                       <input 
                         type="text" 
                         placeholder="MM / YY"
                         className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-[15px] focus:border-blue-500 outline-none transition-colors"
                         value={expiry}
                         onChange={e => setExpiry(e.target.value)}
                       />
                     </div>
                     <div>
                       <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">CVV</label>
                       <input 
                         type="text" 
                         placeholder="123"
                         className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-[15px] focus:border-blue-500 outline-none transition-colors"
                         value={cvv}
                         onChange={e => setCvv(e.target.value)}
                       />
                     </div>
                   </div>

                   <button 
                     onClick={handleProcessPayment}
                     disabled={!cardNumber}
                     className="w-full py-4 bg-[#3bb75e] hover:bg-[#2d9d4a] text-white text-[15px] font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-6 disabled:opacity-50 disabled:shadow-none"
                   >
                     Pay {currency} {amount.toLocaleString()}
                   </button>
                </div>
              </div>
            )}

             {step === 'processing' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-8" />
                 <h3 className="text-2xl font-black mb-3 text-[#011b33]">Processing Payment</h3>
                 <p className="text-[15px] font-medium text-gray-500 px-6 max-w-sm">Please do not close this window while we verify your transaction.</p>
              </div>
            )}

            {step === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <motion.div
                   initial={{ scale: 0.5, opacity: 0 }}
                   animate={{ scale: 1.2, opacity: 1 }}
                   className="w-24 h-24 bg-[#3bb75e]/10 text-[#3bb75e] border-2 border-[#3bb75e]/30 rounded-full flex items-center justify-center mb-8"
                 >
                   <CheckCircle2 className="w-12 h-12" />
                 </motion.div>
                 <h3 className="text-2xl font-black mb-3 text-[#011b33]">Payment Successful</h3>
                 <p className="text-[15px] font-medium text-gray-500 px-6">Redirecting you back to Lawlify AI...</p>
                 <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 text-[11px] text-gray-400 font-medium">
                    <span>Ref: PAY-LW-{(Math.random()*1000000).toFixed(0)}</span>
                 </div>
              </div>
            )}
            
            <div className="mt-auto pt-8 flex items-center justify-center opacity-40 gap-2">
               <ShieldCheck className="w-5 h-5 text-gray-500" />
               <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Simulated Environment</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentSimulationModal;
