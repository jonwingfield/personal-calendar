import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskItem } from './TaskItem';
import { CalendarTask } from '@/hooks/useCalendar';
import { Plus } from 'lucide-react';
import { CATEGORIES, DEFAULT_CATEGORY } from '@/lib/categories';
import { DEFAULT_USER, USERS } from '@/lib/users';

interface CalendarDayProps {
  date: Date;
  tasks: CalendarTask[];
  isCurrentMonth: boolean;
  isToday: boolean;
  selectedUser: string;
  onAddTask: (task: Omit<CalendarTask, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTask: (id: number, updates: Partial<CalendarTask>) => void;
  onDeleteTask: (id: number) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  tasks,
  isCurrentMonth,
  isToday,
  selectedUser,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Use the selected user as default, but fall back to DEFAULT_USER if "all" is selected
  const defaultUserForNewTask = selectedUser === 'all' ? DEFAULT_USER : selectedUser;
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: DEFAULT_CATEGORY,
    user_id: defaultUserForNewTask,
  });

  const dateString = date.toISOString().split('T')[0];
  const dayNumber = date.getDate();

  const { isOver, setNodeRef } = useDroppable({
    id: dateString,
  });

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      onAddTask({
        ...newTask,
        date: dateString,
      });
      setNewTask({ title: '', description: '', category: DEFAULT_CATEGORY, user_id: defaultUserForNewTask });
      setShowAddForm(false);
    }
  };

  const handleCancel = () => {
    setNewTask({ title: '', description: '', category: DEFAULT_CATEGORY, user_id: defaultUserForNewTask });
    setShowAddForm(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[120px] p-2 border border-gray-200 bg-white
        ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
        ${isToday ? 'bg-blue-50 border-blue-300' : ''}
        ${isOver ? 'bg-green-50 border-green-300' : ''}
        transition-colors duration-200
      `}
    >
      {/* Date header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`
            text-sm font-medium
            ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
          `}
        >
          {dayNumber}
        </span>
        {isCurrentMonth && (
          <button
            onClick={() => setShowAddForm(true)}
            className="p-1 hover:bg-gray-200 rounded opacity-60 hover:opacity-100 transition-opacity"
            title="Add task"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Add task form */}
      {showAddForm && (
        <div className="mb-2 p-2 bg-gray-50 rounded border">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
            className="w-full text-sm p-1 border rounded mb-1"
            autoFocus
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full text-xs p-1 border rounded mb-1 resize-none"
            rows={2}
          />
          <select
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            className="w-full text-xs p-1 border rounded mb-1"
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <select
            value={newTask.user_id}
            onChange={(e) => setNewTask({ ...newTask, user_id: e.target.value })}
            className="w-full text-xs p-1 border rounded mb-2"
          >
            {USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <div className="flex gap-1">
            <button
              onClick={handleAddTask}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      {/* Drop indicator */}
      {isOver && (
        <div className="border-2 border-dashed border-green-400 rounded p-2 mt-2 text-center text-green-600 text-xs">
          Drop task here
        </div>
      )}
    </div>
  );
}; 