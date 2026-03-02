import React, { useState } from 'react';
import { Check, HelpCircle, Building2, GraduationCap, Heart, School } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onGetStarted }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
      {/* Header */}
      <div className="pt-24 pb-12 text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
        >
          Simple, transparent pricing
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-500 font-medium"
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
          <div className="bg-gray-100 p-1 rounded-full flex items-center relative">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 ${!isAnnual ? 'text-black' : 'text-gray-500'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 ${isAnnual ? 'text-black' : 'text-gray-500'}`}
            >
              Annual
            </button>
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ${isAnnual ? 'left-[calc(50%+2px)]' : 'left-1'}`}
            />
          </div>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
            Save 20%
          </span>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-[2.5rem] border border-gray-200 bg-white hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-gray-500 text-sm font-medium mb-6 min-h-[40px]">For individuals exploring AI-powered legal work</p>
            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight">$0</span>
              <span className="text-gray-400 font-medium">/mo</span>
            </div>
            
            <button onClick={onGetStarted} className="w-full py-4 rounded-2xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors mb-8">
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
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-600">
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
            className="p-8 rounded-[2.5rem] border-2 border-black bg-black text-white relative transform md:-translate-y-4 shadow-2xl"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Personal</h3>
            <p className="text-gray-400 text-sm font-medium mb-6 min-h-[40px]">Best for solo practitioners who want to do more</p>
            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight">${isAnnual ? '12' : '15'}</span>
              <span className="text-gray-400 font-medium">/mo</span>
              {isAnnual && <p className="text-xs text-gray-500 mt-1">Billed annually ($144)</p>}
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
            className="p-8 rounded-[2.5rem] border border-gray-200 bg-white hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-2xl font-bold mb-2">Teams</h3>
            <p className="text-gray-500 text-sm font-medium mb-6 min-h-[40px]">Collaborate on client matters with your whole firm</p>
            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight">${isAnnual ? '12' : '15'}</span>
              <span className="text-gray-400 font-medium">/seat/mo</span>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">New seats billed prorated when members join</p>
            </div>
            
            <button onClick={onGetStarted} className="w-full py-4 rounded-2xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors mb-8">
              Start Teams Plan
            </button>

            <ul className="space-y-4">
              <li className="font-bold text-sm text-black">Everything in Personal, plus:</li>
              {[
                'Unlimited AI Associates',
                '50 GB Document Vault Storage',
                'Role-based access control',
                'Team collaboration tools',
                'Custom workflows & integrations',
                'Custom deployments',
                'Team training & priority support'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-600">
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
          className="mt-12 p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-2">Need a custom enterprise solution?</h3>
            <p className="text-gray-500 font-medium max-w-2xl">
              Large law firms and legal departments can get custom pricing, on-premise deployments, SSO, advanced audit logs, and dedicated account management.
            </p>
          </div>
          <button className="px-8 py-4 bg-white border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors whitespace-nowrap shadow-sm">
            Book a Demo
          </button>
        </motion.div>

        {/* Teams Note */}
        <p className="text-center text-gray-400 text-sm mt-8 font-medium">
          All plans start with a single seat. Teams plan seats are billed monthly — remove a member and the seat is released at the next renewal.
        </p>
      </div>

      {/* Education Support Section */}
      <div className="bg-[#F8F9FF] py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-xs uppercase tracking-widest mb-6">
              <Heart className="w-4 h-4" />
              <span>Supporting Education</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">We believe in empowering the next generation</h2>
            <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
              The future of law depends on accessible tools. That's why we offer students and academic researchers massive discounts because breakthrough legal work shouldn't be limited by budget.
            </p>
          </div>

          <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-indigo-50 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel: Discounts List */}
            <div className="flex-1 p-10 space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">90% Student Discount</h3>
                  <p className="text-gray-500 text-sm font-medium">Full Personal features for just $1.50/month. Same powerful AI, same unlimited analysis.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">50% Academic Institution</h3>
                  <p className="text-gray-500 text-sm font-medium">Universities, research institutions, and legal clinics qualify for institutional discounts on team plans.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Non-Profit Organizations</h3>
                  <p className="text-gray-500 text-sm font-medium">Registered non-profits advancing justice receive 50% off all plans.</p>
                </div>
              </div>
            </div>

            {/* Right Panel: Verification Card */}
            <div className="w-full md:w-[400px] bg-gray-50 rounded-[2rem] p-10 flex flex-col justify-center border border-gray-100">
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-400 line-through text-lg font-medium">$15</span>
                  <span className="text-5xl font-bold text-indigo-600">$1.50</span>
                  <span className="text-gray-400 font-medium">/mo</span>
                </div>
                <p className="text-sm text-gray-500 font-medium mt-2">Personal plan with student discount</p>
              </div>

              <ul className="space-y-3 mb-8">
                {['Full AI analysis suite', 'Unlimited workspaces', '5 GB storage', 'Priority support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Check className="w-4 h-4 text-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Verify Student Status
              </button>
              <p className="text-center text-xs text-gray-400 font-medium mt-4">
                Instant verification with .edu email
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Back Button */}
      <div className="py-12 text-center">
        <button 
          onClick={onBack}
          className="text-gray-500 font-bold hover:text-black transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PricingPage;
