import React, { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';

interface MiniCardProps {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
  delay: number;
  soon?: boolean;
}

const MiniCard: React.FC<MiniCardProps> = ({ icon, bg, title, desc, delay, soon }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer transition-all duration-300 group hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-lg ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 border border-white/10 ${bg}`}>
        {icon}
      </div>
      <div className="text-sm font-bold text-white mb-1.5 font-[Inter]">{title}</div>
      <div className="text-xs text-gray-500 leading-relaxed font-[Inter]">{desc}</div>
      {soon && (
        <div className="text-[9px] font-black text-amber-500 uppercase tracking-wider mt-2.5 flex items-center gap-1 font-[Inter]">
          <Clock size={9} /> Coming Soon
        </div>
      )}
    </div>
  );
};

export default MiniCard;
