import React from 'react';
import { CheckCircle2, Circle, Clock, User, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    status: 'pending' | 'completed';
    assigned_to?: string;
    due_date?: string;
  };
  onToggleStatus: (id: string, current: string) => void;
  onDelete?: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleStatus, onDelete }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[16px] hover:border-gray-200 hover:shadow-sm transition-all group">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => onToggleStatus(task.id, task.status)}
          className={`flex-shrink-0 transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-primary'}`}
        >
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </button>
        
        <div className="flex-1">
          <h4 className={`text-sm font-bold transition-all ${isCompleted ? 'text-gray-400 line-through' : 'text-black'}`}>
            {task.title}
          </h4>
          <div className="flex items-center gap-4 mt-1">
            {task.due_date && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <User className="w-3 h-3" />
              {task.assigned_to ? 'Assigned' : 'Unassigned'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete?.(task.id)}
          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
