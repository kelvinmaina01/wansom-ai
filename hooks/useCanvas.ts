
import { useState, useCallback } from 'react';
import type { CanvasState } from '../types';

export function useCanvas() {
  const [canvas, setCanvas] = useState<CanvasState>({
    isOpen: false,
    activeTab: 'preview',
    documentHtml: '',
    documentTitle: '',
  });

  const openCanvas = useCallback((tab: 'preview' | 'code' | 'editor' = 'preview', html?: string, title?: string) => {
    setCanvas(prev => ({
      ...prev,
      isOpen: true,
      activeTab: tab,
      ...(html !== undefined ? { documentHtml: html } : {}),
      ...(title !== undefined ? { documentTitle: title } : {}),
    }));
  }, []);

  const closeCanvas = useCallback(() => {
    setCanvas(prev => ({ ...prev, isOpen: false }));
  }, []);

  const switchTab = useCallback((tab: 'preview' | 'code' | 'editor') => {
    setCanvas(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const updateDocument = useCallback((html: string) => {
    setCanvas(prev => ({ ...prev, documentHtml: html }));
  }, []);

  return {
    canvas,
    openCanvas,
    closeCanvas,
    switchTab,
    updateDocument,
  };
}
