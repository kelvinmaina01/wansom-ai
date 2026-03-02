import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Notification } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead,
  onDelete,
  onClearAll
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
      case 'error': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default: return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Case Law': return 'bg-purple-100 text-purple-700';
      case 'Regulation': return 'bg-blue-100 text-blue-700';
      case 'System': return 'bg-gray-100 text-gray-700';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) {
                onClose();
              }
            }}
            className="fixed top-0 right-0 z-[100] h-screen w-full sm:w-[450px] bg-white shadow-2xl border-l border-gray-100 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <BellIcon className="w-6 h-6 text-black" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[18px] text-center flex items-center justify-center">
                      {notifications.filter(n => !n.read).length > 99 ? '99+' : notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black tracking-tight">Notifications</h3>
                  <p className="text-xs text-gray-400 font-medium">{notifications.filter(n => !n.read).length} unread updates</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50/50">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BellIcon className="w-8 h-8 text-gray-300" />
                  </div>
                  <h4 className="text-sm font-bold text-black mb-1">All caught up!</h4>
                  <p className="text-xs text-gray-400">You have no new notifications at the moment.</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className={`p-4 rounded-2xl border transition-all group relative overflow-hidden ${
                      notification.read 
                        ? 'bg-white border-gray-100 hover:border-gray-200' 
                        : 'bg-white border-blue-100 shadow-sm shadow-blue-500/5'
                    }`}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                    )}
                    
                    <div className="flex gap-4">
                      <div className="mt-1 shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryColor(notification.category)}`}>
                            {notification.category || 'Update'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className={`text-sm font-bold mb-1 ${notification.read ? 'text-gray-600' : 'text-black'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.id); }}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-bold text-gray-600 transition-colors"
                            >
                              <CheckIcon className="w-3 h-3" />
                              Mark as read
                            </button>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg text-[10px] font-bold text-red-500 transition-colors ml-auto"
                          >
                            <TrashIcon className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
                <button 
                  onClick={onClearAll}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-black rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  Clear All Notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
