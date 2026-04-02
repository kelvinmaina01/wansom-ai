import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Briefcase, Plus, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const NewCaseModal: React.FC<NewCaseModalProps> = ({ isOpen, onClose, onSuccess, userId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    case_type: 'Litigation',
    priority: 'Medium',
    description: '',
    due_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('cases')
        .insert([{
          ...formData,
          user_id: userId,
          status: 'New'
        }]);

      if (error) throw error;
      
      onSuccess();
      onClose();
      setFormData({
        title: '',
        client_name: '',
        case_type: 'Litigation',
        priority: 'Medium',
        description: '',
        due_date: ''
      });
    } catch (err) {
      console.error('Error creating case:', err);
      alert('Failed to create case. Please try again.');
    } finally {
      setLoading(false);
    }
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
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-[25px] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600/10 text-red-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-gray-900 tracking-tight">Register New Case</h2>
                 <p className="text-xs text-gray-500 font-medium">Add a new legal matter to your dashboard</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200">
               <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Case Title / Suit Number</label>
                 <input 
                   required
                   type="text" 
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   placeholder="e.g. Zenith Bank Plc vs Kelvin Maina (LD/2345/2026)"
                   className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[15px] text-sm focus:border-red-600/50 focus:bg-white outline-none transition-all font-medium"
                 />
              </div>

              <div className="col-span-1">
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Client Name</label>
                 <input 
                   required
                   type="text" 
                   value={formData.client_name}
                   onChange={e => setFormData({...formData, client_name: e.target.value})}
                   placeholder="e.g. John Doe"
                   className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[15px] text-sm focus:border-red-600/50 focus:bg-white outline-none transition-all font-medium"
                 />
              </div>

              <div className="col-span-1">
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Case Type</label>
                 <select 
                   value={formData.case_type}
                   onChange={e => setFormData({...formData, case_type: e.target.value})}
                   className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[15px] text-sm focus:border-red-600/50 focus:bg-white outline-none transition-all font-medium"
                 >
                   <option>Litigation</option>
                   <option>Corporate</option>
                   <option>Conveyancing</option>
                   <option>Intellectual Property</option>
                   <option>Family Law</option>
                   <option>Other</option>
                 </select>
              </div>

              <div className="col-span-1">
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Priority Level</label>
                 <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({...formData, priority: p})}
                        className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                          formData.priority === p 
                          ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20' 
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="col-span-1">
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Due Date (Optional)</label>
                 <input 
                   type="date" 
                   value={formData.due_date}
                   onChange={e => setFormData({...formData, due_date: e.target.value})}
                   className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[15px] text-sm focus:border-red-600/50 focus:bg-white outline-none transition-all font-medium appearance-none"
                 />
              </div>

              <div className="col-span-2">
                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Matter Description</label>
                 <textarea 
                   rows={3}
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   placeholder="Brief overview of the matter, court division, and key objectives..."
                   className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[15px] text-sm focus:border-red-600/50 focus:bg-white outline-none transition-all font-medium resize-none"
                 />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
               <button 
                 type="button"
                 onClick={onClose}
                 className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-[15px] hover:bg-gray-50 transition-all"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 disabled={loading}
                 className="flex-[2] py-4 bg-red-600 text-white font-bold rounded-[15px] hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 {loading ? 'Registering...' : 'Register Matter'}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NewCaseModal;
