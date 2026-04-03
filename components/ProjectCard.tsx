import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  icon: Icon,
  actionLabel,
  onAction,
  children,
  description,
  className = ''
}) => {
  return (
    <div className={`bg-[#F8F9FA] border border-gray-100 rounded-[24px] p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-primary/20 transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group/title">
          <h3 className="text-xl font-bold text-black group-hover/title:text-primary transition-colors flex items-center gap-2">
            {title}
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover/title:text-primary transition-all group-hover/title:translate-x-1" />
          </h3>
        </div>
        {actionLabel && (
          <button
            onClick={onAction}
            className="text-primary text-sm font-bold hover:underline transition-all"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {description && (
        <p className="text-gray-400 text-sm font-medium leading-relaxed">
          {description}
        </p>
      )}

      {/* Content */}
      <div className="flex-1 relative z-10">
        {children}
      </div>

      {/* Background Icon (Premium subtle touch) */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        <Icon className="w-32 h-32" />
      </div>
    </div>
  );
};

export default ProjectCard;
