import React, { useState } from 'react';
import { Check, HelpCircle, Building2, GraduationCap, Heart, School, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onGetStarted }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-ai-studio text-white font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tighter">Lawlify</span>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </nav>

      {/* Header */}
      <div className="pt-40 pb-12 text-center px-4 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[0.9]"
        >
          Simple, transparent <span className="text-primary font-bold">pricing</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 font-medium max-w-2xl mx-auto"
        >
          Start free. Scale as you grow. No hidden fees.
        </motion.p>

        {/* Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <div className="bg-white/5 border border-white/10 p-1 rounded-full flex items-center relative backdrop-blur-sm">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 ${!isAnnual ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 ${isAnnual ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Annual
            </button>
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full shadow-lg shadow-primary/20 transition-all duration-300 ${isAnnual ? 'left-[calc(50%+2px)]' : 'left-1'}`}
            />
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg border border-primary/20 uppercase tracking-wider">
            Save 20%
          </span>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md hover:border-white/20 transition-all duration-300 group"
          >
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-gray-400 text-sm font-medium mb-6 min-h-[40px]">For individuals exploring AI-powered legal work</p>
            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight">$0</span>
              <span className="text-gray-500 font-medium">/mo</span>
            </div>
            
            <button onClick={onGetStarted} className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-colors mb-8 text-white">
              Get Started Free
            </button>

            <ul className="space-y-4">
              {[
                '2 client/matter workspaces',
                '8 AI Responses per month',
                '500 MB Document Vault Storage',
                'Basic AI legal tools',
                'Community support',
                'AI Associates',
                'Calendar & Draft integrations',
                'Team collaboration'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Personal Plan (Most Popular) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-[2.5rem] border border-primary/50 bg-[#0a0a0a] relative transform md:-translate-y-4 shadow-2xl shadow-primary/10"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Personal</h3>
            <p className="text-gray-400 text-sm font-medium mb-6 min-h-[40px]">Best for solo practitioners who want to do more</p>
            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight text-white">${isAnnual ? '12' : '15'}</span>
              <span className="text-gray-500 font-medium">/mo</span>
              {isAnnual && <p className="text-xs text-primary mt-1 font-bold">Billed annually ($144)</p>}
            </div>
            
            <button onClick={onGetStarted} className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors mb-8 shadow-lg shadow-primary/20">
              Upgrade Now
            </button>

            <ul className="space-y-4">
              {[
                'Unlimited client/matter workspaces',
                'Unlimited AI Responses',
                '5 GB Document Vault Storage',
                'Up to 10 AI Associates',
                'Google Calendar & Email integrations',
                'Priority email support',
                'Team collaboration',
                'Custom workflows & deployments'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-300">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Teams Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md hover:border-white/20 transition-all duration-300 group"
          >
            <h3 className="text-2xl font-bold mb-2">Teams</h3>
            <p className="text-gray-400 text-sm font-medium mb-6 min-h-[40px]">Collaborate on client matters with your whole firm</p>
            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight">${isAnnual ? '12' : '15'}</span>
              <span className="text-gray-500 font-medium">/seat/mo</span>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">New seats billed prorated when members join</p>
            </div>
            
            <button onClick={onGetStarted} className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-colors mb-8 text-white">
              Start Teams Plan
            </button>

            <ul className="space-y-4">
              <li className="font-bold text-sm text-white">Everything in Personal, plus:</li>
              {[
                'Unlimited AI Associates',
                '50 GB Document Vault Storage',
                'Role-based access control',
                'Team collaboration tools',
                'Custom workflows & integrations',
                'Custom deployments',
                'Team training & priority support'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Enterprise Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm"
        >
          <div>
            <h3 className="text-2xl font-bold mb-2">Need a custom enterprise solution?</h3>
            <p className="text-gray-400 font-medium max-w-2xl">
              Large law firms and legal departments can get custom pricing, on-premise deployments, SSO, advanced audit logs, and dedicated account management.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-black border border-white rounded-2xl font-bold hover:bg-gray-200 transition-colors whitespace-nowrap shadow-lg shadow-white/10">
            Book a Demo
          </button>
        </motion.div>

        {/* Teams Note */}
        <p className="text-center text-gray-500 text-sm mt-8 font-medium">
          All plans start with a single seat. Teams plan seats are billed monthly — remove a member and the seat is released at the next renewal.
        </p>
      </div>

      {/* Education Support Section */}
      <div className="relative py-24 px-6 border-t border-white/5">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest mb-6 border border-primary/20">
              <Heart className="w-3 h-3" />
              <span>Supporting Education</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">We believe in empowering the next generation</h2>
            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
              The future of law depends on accessible tools. That's why we offer students and academic researchers massive discounts because breakthrough legal work shouldn't be limited by budget.
            </p>
          </div>

          <div className="bg-[#0a0a0a] p-2 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-white/10 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel: Discounts List */}
            <div className="flex-1 p-10 space-y-8">
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">90% Student Discount</h3>
                  <p className="text-gray-400 text-sm font-medium">Full Personal features for just $1.50/month. Same powerful AI, same unlimited analysis.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-blue-500 transition-colors">50% Academic Institution</h3>
                  <p className="text-gray-400 text-sm font-medium">Universities, research institutions, and legal clinics qualify for institutional discounts on team plans.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-green-500 transition-colors">Non-Profit Organizations</h3>
                  <p className="text-gray-400 text-sm font-medium">Registered non-profits advancing justice receive 50% off all plans.</p>
                </div>
              </div>
            </div>

            {/* Right Panel: Verification Card */}
            <div className="w-full md:w-[400px] bg-white/5 rounded-[2rem] p-10 flex flex-col justify-center border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>
              
              <div className="mb-6 relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-500 line-through text-lg font-medium">$15</span>
                  <span className="text-5xl font-bold text-primary">$1.50</span>
                  <span className="text-gray-400 font-medium">/mo</span>
                </div>
                <p className="text-sm text-gray-400 font-medium mt-2">Personal plan with student discount</p>
              </div>

              <ul className="space-y-3 mb-8 relative z-10">
                {['Full AI analysis suite', 'Unlimited workspaces', '5 GB storage', 'Priority support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Check className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 relative z-10">
                Verify Student Status
              </button>
              <p className="text-center text-xs text-gray-500 font-medium mt-4 relative z-10">
                Instant verification with .edu email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
