'use client';

import React from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { TaskItem } from './TaskItem';
import { DailyView } from './DailyView';
import { WeeklyView } from './WeeklyView';
import { MonthlyView } from './MonthlyView';
import { ViewModeToggle } from './ViewModeToggle';
import { useCalendar, CalendarTask } from '@/hooks/useCalendar';
import { useViewMode } from '@/hooks/useViewMode';
import { Calendar as CalendarIcon, User } from 'lucide-react';
import { useState } from 'react';
import { USERS, ALL_USERS_OPTION } from '@/lib/users';

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
    goToPreviousDay,
    goToNextDay,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    getTasksForDate,
    getCalendarDays,
    getWeekDays,
  } = useCalendar();

  const { viewMode, setViewMode, isMobile } = useViewMode();
  const [activeTask, setActiveTask] = useState<CalendarTask | null>(null);

  // Configure sensors for both mouse and touch support
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'daily':
        return (
          <DailyView
            currentDate={currentDate}
            tasks={tasks}
            selectedUser={selectedUser}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onPreviousDay={goToPreviousDay}
            onNextDay={goToNextDay}
            getTasksForDate={getTasksForDate}
          />
        );
      case 'weekly':
        return (
          <WeeklyView
            currentDate={currentDate}
            tasks={tasks}
            selectedUser={selectedUser}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onPreviousWeek={goToPreviousWeek}
            onNextWeek={goToNextWeek}
            getTasksForDate={getTasksForDate}
            getWeekDays={getWeekDays}
          />
        );
      case 'monthly':
        return (
          <MonthlyView
            currentDate={currentDate}
            year={year}
            month={month}
            tasks={tasks}
            selectedUser={selectedUser}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            getTasksForDate={getTasksForDate}
            getCalendarDays={getCalendarDays}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className={`flex items-center justify-between mb-6 ${isMobile ? 'flex-col gap-4' : ''}`}>
          <div className={`flex items-center gap-4 ${isMobile ? 'w-full justify-center' : ''}`}>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                Personal Calendar
              </h1>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Today
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className={`flex items-center gap-4 ${isMobile ? 'w-full justify-center' : ''}`}>
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isMobile={isMobile}
            />
          </div>

          {/* User Selection */}
          <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
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
        </div>

        {/* Current View */}
        {renderCurrentView()}
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