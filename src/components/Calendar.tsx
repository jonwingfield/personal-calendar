'use client';

import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { CalendarDay } from './CalendarDay';
import { TaskItem } from './TaskItem';
import { useCalendar, CalendarTask } from '@/hooks/useCalendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User } from 'lucide-react';
import { useState } from 'react';
import { USERS, ALL_USERS_OPTION } from '@/lib/users';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Calendar: React.FC = () => {
  const {
    currentDate,
    year,
    month,
    tasks,
    loading,
    selectedUser,
    setSelectedUser,
    addTask,
    updateTask,
    deleteTask,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getTasksForDate,
    getCalendarDays,
  } = useCalendar();

  const [activeTask, setActiveTask] = useState<CalendarTask | null>(null);

  const calendarDays = getCalendarDays();
  const today = new Date();

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current as CalendarTask;
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const task = active.data.current as CalendarTask;
      const newDate = over.id as string;
      
      if (task && task.id) {
        updateTask(task.id, { date: newDate });
      }
    }
    
    setActiveTask(null);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Personal Calendar</h1>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* User Selection Dropdown */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={ALL_USERS_OPTION.id}>{ALL_USERS_OPTION.name}</option>
                {USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-800 min-w-[200px] text-center">
              {MONTHS[month - 1]} {year}
            </h2>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
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
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
              />
            );
          })}
        </div>

        {/* Task count summary */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} in {MONTHS[month - 1]} {year}
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeTask ? (
          <TaskItem
            task={activeTask}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}; 