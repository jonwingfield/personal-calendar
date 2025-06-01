import React from 'react';
import { CalendarDay } from './CalendarDay';
import { CalendarTask } from '@/hooks/useCalendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface DailyViewProps {
  currentDate: Date;
  tasks: CalendarTask[];
  selectedUser: string;
  onAddTask: (task: Omit<CalendarTask, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTask: (id: number, updates: Partial<CalendarTask>) => void;
  onDeleteTask: (id: number) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  getTasksForDate: (date: string) => CalendarTask[];
}

export const DailyView: React.FC<DailyViewProps> = ({
  currentDate,
  selectedUser,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onPreviousDay,
  onNextDay,
  getTasksForDate,
}) => {
  const today = new Date();
  const isToday = currentDate.toDateString() === today.toDateString();
  const dayName = DAYS_OF_WEEK[currentDate.getDay()];
  const monthName = MONTHS[currentDate.getMonth()];
  const dayTasks = getTasksForDate(currentDate.toISOString().split('T')[0]);

  return (
    <div className="max-w-md mx-auto">
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPreviousDay}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {dayName}
          </h2>
          <p className="text-lg text-gray-600">
            {monthName} {currentDate.getDate()}, {currentDate.getFullYear()}
          </p>
        </div>
        
        <button
          onClick={onNextDay}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <CalendarDay
          date={currentDate}
          tasks={dayTasks}
          isCurrentMonth={true}
          isToday={isToday}
          selectedUser={selectedUser}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
    </div>
  );
}; 