import React from 'react';
import { CalendarDay } from './CalendarDay';
import { CalendarTask } from '@/hooks/useCalendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface MonthlyViewProps {
  currentDate: Date;
  year: number;
  month: number;
  tasks: CalendarTask[];
  selectedUser: string;
  onAddTask: (task: Omit<CalendarTask, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTask: (id: number, updates: Partial<CalendarTask>) => void;
  onDeleteTask: (id: number) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  getTasksForDate: (date: string) => CalendarTask[];
  getCalendarDays: () => Date[];
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({
  currentDate,
  year,
  month,
  selectedUser,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onPreviousMonth,
  onNextMonth,
  getTasksForDate,
  getCalendarDays,
}) => {
  const calendarDays = getCalendarDays();
  const today = new Date();

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800 min-w-[200px] text-center">
          {MONTHS[month - 1]} {year}
        </h2>
        
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-px mb-px">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
        {calendarDays.map((date) => {
          const dateString = date.toISOString().split('T')[0];
          const dayTasks = getTasksForDate(dateString);
          
          return (
            <CalendarDay
              key={dateString}
              date={date}
              tasks={dayTasks}
              isCurrentMonth={isCurrentMonth(date)}
              isToday={isToday(date)}
              selectedUser={selectedUser}
              onAddTask={onAddTask}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
      </div>

      {/* Task count summary */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {calendarDays.filter(date => isCurrentMonth(date)).reduce((count, date) => {
          return count + getTasksForDate(date.toISOString().split('T')[0]).length;
        }, 0)} task{calendarDays.filter(date => isCurrentMonth(date)).reduce((count, date) => {
          return count + getTasksForDate(date.toISOString().split('T')[0]).length;
        }, 0) !== 1 ? 's' : ''} in {MONTHS[month - 1]} {year}
      </div>
    </div>
  );
}; 