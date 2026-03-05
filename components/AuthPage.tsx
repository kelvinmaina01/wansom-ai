import React, { useState, useEffect } from 'react';
import { Scale, ShieldCheck, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TermsModal from './TermsModal';

interface AuthPageProps {
  onLogin: () => void;
}
//moock testimonials data to be replaced with real data from the backend 
const TESTIMONIALS = [
  {
    id: 1,
    quote: "Lawlify has completely transformed how our firm handles case preparation. The AI accuracy on Kenyan case law is unmatched.",
    author: "Sarah Kimani",
    role: "Senior Partner, Kimani & Associates",
    location: "Nairobi, Kenya",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces"
  },
  {
    id: 2,
    quote: "As a corporate lawyer in Tanzania, the cross-border regulatory analysis saves me hours of research every week. It's indispensable.",
    author: "Juma Mwakipesile",
    role: "Legal Counsel, Dar es Salaam Corp",
    location: "Dar es Salaam, Tanzania",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
  },
  {
    id: 3,
    quote: "The automated contract review features are a game-changer for our practice in Kampala. We can turn around agreements 3x faster.",
    author: "Grace Nakato",
    role: "Managing Partner, Nakato Law",
    location: "Kampala, Uganda",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces"
  },
  {
    id: 4,
    quote: "Finally, a legal AI tool that truly understands the nuances of Rwandan civil law. The document vault is incredibly secure and easy to use.",
    author: "Jean-Paul Ndayishimiye",
    role: "Advocate, Kigali Legal Chambers",
    location: "Kigali, Rwanda",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces"
  },
  {
    id: 5,
    quote: "Lawlify's ability to synthesize EAC regional treaties with local statutes has elevated our advisory capabilities significantly.",
    author: "Amina Hassan",
    role: "Regional Director, East Africa Law Society",
    location: "Arusha, Tanzania",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces"
  }
  
];


const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy'>('terms');

  const openTermsModal = (type: 'terms' | 'privacy') => {
    setTermsModalType(type);
    setTermsModalOpen(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000); // Change every 5 seconds for better readability
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-black">
      {/* Left Panel - Branding & Testimonial */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-black text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">Lawlify AI</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
              The AI co-pilot for <span className="text-primary">legal excellence</span>.
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              Join thousands of legal professionals across East Africa who use Lawlify to draft faster, research smarter, and secure their data.
            </p>
          </div>
        </div>

        <div className="relative z-10 h-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111] p-6 rounded-[2rem] border border-white/10 shadow-2xl absolute bottom-0 left-0 right-0"
            >
              <div className="flex gap-1.5 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-[#FF4444] fill-[#FF4444]" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xl font-medium mb-6 leading-snug tracking-tight text-white">"{TESTIMONIALS[currentTestimonial].quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden shrink-0 border-2 border-white/10">
                  <img src={TESTIMONIALS[currentTestimonial].avatar} alt={TESTIMONIALS[currentTestimonial].author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-base text-white">{TESTIMONIALS[currentTestimonial].author}</p>
                  <p className="text-sm text-gray-400 font-medium">{TESTIMONIALS[currentTestimonial].role}</p>
                  <p className="text-xs text-[#FF4444] font-bold mt-0.5 uppercase tracking-wider">{TESTIMONIALS[currentTestimonial].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Carousel Indicators */}
          <div className="absolute -bottom-10 left-0 flex gap-3">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentTestimonial ? 'w-10 bg-[#FF4444]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mt-12">
          <ShieldCheck className="w-4 h-4" />
          <span>Enterprise-Grade Security • ISO 27001 Certified</span>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-2">Welcome back</h2>
            <p className="text-red-500 font-medium">Sign in to access your workspace</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.99]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button 
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.99]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A4EF">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
              </svg>
              Continue with Microsoft
            </button>
            <button 
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.99]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </button>
            <button 
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.99]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-red-500 font-medium">Or for Enterprise</span>
            </div>
          </div>

          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg shadow-black/10 group"
          >
            <Building2 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            Continue with SSO
          </button>

          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex flex-col items-center gap-1.5">
              <img src="/badges/gdpr-compliant.png" alt="GDPR Compliant" className="h-12 object-contain hover:scale-105 transition-transform" />
              <span className="text-[9px] text-red-500 font-medium text-center leading-tight">Your data, always your property</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <img src="/badges/aicpa-soc.png" alt="AICPA SOC" className="h-12 object-contain hover:scale-105 transition-transform" />
              <span className="text-[9px] text-red-500 font-medium text-center leading-tight">Audited controls protect every case</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <img src="/badges/iso-42001.png" alt="ISO 42001" className="h-12 object-contain hover:scale-105 transition-transform" />
              <span className="text-[9px] text-red-500 font-medium text-center leading-tight">Responsible AI, ethically governed</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 font-medium mt-4">
            By clicking continue, you agree to our{' '}
            <button onClick={() => openTermsModal('terms')} className="underline hover:text-black">
              Terms of Service
            </button>{' '}
            and{' '}
            <button onClick={() => openTermsModal('privacy')} className="underline hover:text-black">
              Privacy Policy
            </button>.
          </p>
        </div>
      </div>

      <TermsModal 
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        type={termsModalType}
      />
    </div>
  );
};

const SocialButton = ({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.99]"
  >
    <img src={icon} alt="" className="w-5 h-5" />
    {label}
  </button>
);

export default AuthPage;
