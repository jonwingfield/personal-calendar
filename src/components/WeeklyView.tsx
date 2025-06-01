import React, { useEffect, useRef } from 'react';
import { CalendarDay } from './CalendarDay';
import { CalendarTask } from '@/hooks/useCalendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface WeeklyViewProps {
  currentDate: Date;
  tasks: CalendarTask[];
  selectedUser: string;
  onAddTask: (task: Omit<CalendarTask, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTask: (id: number, updates: Partial<CalendarTask>) => void;
  onDeleteTask: (id: number) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  getTasksForDate: (date: string) => CalendarTask[];
  getWeekDays: () => Date[];
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  currentDate,
  selectedUser,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onPreviousWeek,
  onNextWeek,
  getTasksForDate,
  getWeekDays,
}) => {
  const weekDays = getWeekDays();
  const today = new Date();
  const todayRef = useRef<HTMLDivElement>(null);

  // Get week range for header
  const startOfWeek = weekDays[0];
  const endOfWeek = weekDays[6];
  const startMonth = MONTHS[startOfWeek.getMonth()];
  const endMonth = MONTHS[endOfWeek.getMonth()];
  const startYear = startOfWeek.getFullYear();
  const endYear = endOfWeek.getFullYear();

  let weekRange = '';
  if (startMonth === endMonth && startYear === endYear) {
    weekRange = `${startMonth} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${startYear}`;
  } else if (startYear === endYear) {
    weekRange = `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${startYear}`;
  } else {
    weekRange = `${startMonth} ${startOfWeek.getDate()}, ${startYear} - ${endMonth} ${endOfWeek.getDate()}, ${endYear}`;
  }

  // Scroll to today when component mounts or week changes
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [currentDate]);

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Week View
          </h2>
          <p className="text-sm text-gray-600">
            {weekRange}
          </p>
        </div>
        
        <button
          onClick={onNextWeek}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Days container - vertically stacked */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {weekDays.map((date) => {
          const dateString = date.toISOString().split('T')[0];
          const dayTasks = getTasksForDate(dateString);
          const dayName = DAYS_OF_WEEK[date.getDay()];
          const isTodayDate = isToday(date);
          
          return (
            <div 
              key={dateString}
              ref={isTodayDate ? todayRef : null}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Day header */}
              <div className={`p-3 border-b border-gray-200 ${isTodayDate ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${isTodayDate ? 'text-blue-900' : 'text-gray-900'}`}>
                      {dayName}
                    </h3>
                    <p className={`text-sm ${isTodayDate ? 'text-blue-700' : 'text-gray-600'}`}>
                      {MONTHS[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
                    </p>
                  </div>
                  {isTodayDate && (
                    <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                      Today
                    </span>
                  )}
                </div>
              </div>
              
              {/* Day content */}
              <div className="min-h-[100px]">
                <CalendarDay
                  date={date}
                  tasks={dayTasks}
                  isCurrentMonth={isCurrentMonth(date)}
                  isToday={isTodayDate}
                  selectedUser={selectedUser}
                  onAddTask={onAddTask}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 