import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/database';
import { ALL_USERS_OPTION } from '@/lib/users';

export interface CalendarTask extends Task {
  id: number;
}

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>(ALL_USERS_OPTION.id);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/tasks', window.location.origin);
      url.searchParams.set('year', year.toString());
      url.searchParams.set('month', month.toString());
      url.searchParams.set('userId', selectedUser);
      
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [year, month, selectedUser]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task: Omit<CalendarTask, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      
      if (response.ok) {
        await fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id: number, updates: Partial<CalendarTask>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        await fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.date === date);
  };

  // Get all days in the current month with surrounding days for calendar grid
  const getCalendarDays = () => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    // Adjust to start on Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());
    // Adjust to end on Saturday
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  return {
    currentDate,
    tasks,
    loading,
    year,
    month,
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
    fetchTasks,
  };
}; 