import React from 'react';
import { ViewMode } from '@/hooks/useViewMode';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isMobile: boolean;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  isMobile,
}) => {
  const viewModes = [
    {
      key: 'daily' as ViewMode,
      label: isMobile ? 'Day' : 'Daily',
      icon: CalendarDays,
    },
    {
      key: 'weekly' as ViewMode,
      label: isMobile ? 'Week' : 'Weekly',
      icon: CalendarRange,
    },
    ...(!isMobile ? [{
      key: 'monthly' as ViewMode,
      label: isMobile ? 'Month' : 'Monthly',
      icon: Calendar,
    }] : []),
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {viewModes.map((mode) => {
        const Icon = mode.icon;
        const isActive = viewMode === mode.key;
        
        return (
          <button
            key={mode.key}
            onClick={() => onViewModeChange(mode.key)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
              ${isActive 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
              ${isMobile ? 'px-2 text-xs' : ''}
            `}
          >
            <Icon className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
            <span className={isMobile ? 'hidden sm:inline' : ''}>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}; 