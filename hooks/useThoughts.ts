
import { useState, useCallback, useRef } from 'react';
import type { ThoughtEntry } from '../types';

export function useThoughts() {
  const [thoughts, setThoughts] = useState<ThoughtEntry[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const idCounter = useRef(0);

  const addThought = useCallback((thought: Omit<ThoughtEntry, 'id'>) => {
    const id = `thought-${++idCounter.current}`;
    setThoughts(prev => [...prev, { ...thought, id }]);
    return id;
  }, []);

  const updateThoughtStatus = useCallback((id: string, status: 'live' | 'done') => {
    setThoughts(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }, []);

  const clearThoughts = useCallback(() => {
    setThoughts([]);
    idCounter.current = 0;
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    thoughts,
    isOpen,
    addThought,
    updateThoughtStatus,
    clearThoughts,
    toggle,
  };
}
