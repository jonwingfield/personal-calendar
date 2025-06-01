import { useState, useEffect } from 'react';

export type ViewMode = 'daily' | 'weekly' | 'monthly';

export const useViewMode = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile on mount and window resize
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768; // Tailwind's md breakpoint
      setIsMobile(mobile);
      
      // Set default view mode based on device
      if (mobile && viewMode === 'monthly') {
        setViewMode('weekly');
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [viewMode]);

  return {
    viewMode,
    setViewMode,
    isMobile,
  };
}; 