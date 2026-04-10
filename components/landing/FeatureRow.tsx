import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

interface FeatureRowProps {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  badge: { text: string; variant: 'live' | 'new' | 'enterprise' | 'soon' };
  reverse?: boolean;
  children: React.ReactNode;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ number, title, description, bullets, badge, reverse, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const badgeStyles: Record<string, string> = {
    live: 'bg-green-500/10 text-green-400 border-green-500/25',
    new: 'bg-red-500/10 text-red-400 border-red-500/25',
    enterprise: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
    soon: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col lg:flex-row gap-10 max-w-[1340px] mx-auto px-6 py-16 items-center min-h-[580px] border-t border-white/5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}
    >
      {/* Text */}
      <div className={`w-full lg:w-[38%] ${reverse ? 'lg:order-2 lg:pl-10' : 'lg:pr-10'}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-px bg-primary block" />
          <span className="text-[10px] font-black tracking-[.15em] uppercase text-primary font-[Inter]">{number}</span>
        </div>
        <h3
          className="text-[clamp(24px,2.4vw,34px)] font-extrabold text-white leading-tight mb-4 tracking-tight"
          style={{ fontFamily: 'Poppins, sans-serif' }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-sm text-gray-400 leading-relaxed mb-6 font-[Inter]">{description}</p>
        <div className="flex flex-col gap-2.5 mb-7">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2.5 text-[13px] text-gray-300 font-[Inter]">
              <span className="w-[17px] h-[17px] rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={8} className="text-primary" strokeWidth={3} />
              </span>
              {b}
            </div>
          ))}
        </div>
        <span className={`inline-flex items-center text-[10px] font-black tracking-[.06em] uppercase border rounded-full px-3 py-1.5 font-[Inter] ${badgeStyles[badge.variant]}`}>
          <span className="w-[5px] h-[5px] rounded-full bg-current mr-1.5" />
          {badge.text}
        </span>
      </div>

      {/* Screen */}
      <div className={`relative w-full lg:w-[62%] h-[540px] ${reverse ? 'lg:order-1' : ''}`}>
        <div className="absolute inset-0 bg-white border border-gray-200/80 rounded-[14px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.09),0_0_0_1px_rgba(0,0,0,0.03)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FeatureRow;
