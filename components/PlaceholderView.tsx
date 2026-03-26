import React from 'react';
import { Scale } from 'lucide-react';

const PlaceholderView = ({ title, description }: { title: string; description?: string }) => (
  <div className="flex-1 flex items-center justify-center bg-white bg-dots">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20">
        <Scale className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-5xl font-bold text-black mb-4 tracking-tighter">{title}</h1>
      <p className="text-gray-400 font-bold text-[11px] leading-relaxed px-8">
        {description || `This module is currently being optimized for Kenyan Legal Standards. Please check back soon for the full release.`}
      </p>
    </div>
  </div>
);

export default PlaceholderView;
