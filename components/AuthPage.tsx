import React, { useState, useEffect } from 'react';
import { Scale, ShieldCheck, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onLogin: () => void;
}

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Lawlify has completely transformed how our firm handles case preparation. The AI accuracy on Kenyan case law is unmatched.",
    author: "Sarah Kimani",
    role: "Senior Partner, Kimani & Associates",
    location: "Nairobi, Kenya",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: 2,
    quote: "As a corporate lawyer in Tanzania, the cross-border regulatory analysis saves me hours of research every week. It's indispensable.",
    author: "Juma Mwakipesile",
    role: "Legal Counsel, Dar es Salaam Corp",
    location: "Dar es Salaam, Tanzania",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juma"
  },
  {
    id: 3,
    quote: "The automated contract review features are a game-changer for our practice in Kampala. We can turn around agreements 3x faster.",
    author: "Grace Nakato",
    role: "Managing Partner, Nakato Law",
    location: "Kampala, Uganda",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace"
  },
  {
    id: 4,
    quote: "Finally, a legal AI tool that truly understands the nuances of Rwandan civil law. The document vault is incredibly secure and easy to use.",
    author: "Jean-Paul Ndayishimiye",
    role: "Advocate, Kigali Legal Chambers",
    location: "Kigali, Rwanda",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean"
  },
  {
    id: 5,
    quote: "Lawlify's ability to synthesize EAC regional treaties with local statutes has elevated our advisory capabilities significantly.",
    author: "Amina Hassan",
    role: "Regional Director, East Africa Law Society",
    location: "Arusha, Tanzania",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina"
  }
];

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111] p-10 rounded-[2.5rem] border border-white/10 shadow-2xl absolute bottom-0 left-0 right-0"
            >
              <div className="flex gap-1.5 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-[#FF4444] fill-[#FF4444]" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-2xl font-medium mb-8 leading-snug tracking-tight text-white">"{TESTIMONIALS[currentTestimonial].quote}"</p>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-800 rounded-full overflow-hidden shrink-0 border-2 border-white/10">
                  <img src={TESTIMONIALS[currentTestimonial].avatar} alt={TESTIMONIALS[currentTestimonial].author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-lg text-white">{TESTIMONIALS[currentTestimonial].author}</p>
                  <p className="text-sm text-gray-400 font-medium">{TESTIMONIALS[currentTestimonial].role}</p>
                  <p className="text-xs text-[#FF4444] font-bold mt-1 uppercase tracking-wider">{TESTIMONIALS[currentTestimonial].location}</p>
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
            <p className="text-gray-500 font-medium">Sign in to access your workspace</p>
          </div>

          <div className="space-y-4">
            <SocialButton 
              icon="https://www.svgrepo.com/show/475656/google-color.svg" 
              label="Continue with Google" 
              onClick={onLogin} 
            />
            <SocialButton 
              icon="https://www.svgrepo.com/show/448234/microsoft.svg" 
              label="Continue with Microsoft" 
              onClick={onLogin} 
            />
            <SocialButton 
              icon="https://www.svgrepo.com/show/448239/linkedin.svg" 
              label="Continue with LinkedIn" 
              onClick={onLogin} 
            />
            <SocialButton 
              icon="https://www.svgrepo.com/show/448205/apple.svg" 
              label="Continue with Apple" 
              onClick={onLogin} 
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400 font-medium">Or for Enterprise</span>
            </div>
          </div>

          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg shadow-black/10 group"
          >
            <Building2 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            Continue with SSO
          </button>

          <p className="text-center text-xs text-gray-400 font-medium mt-8">
            By clicking continue, you agree to our <a href="#" className="underline hover:text-black">Terms of Service</a> and <a href="#" className="underline hover:text-black">Privacy Policy</a>.
          </p>
        </div>
      </div>
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
