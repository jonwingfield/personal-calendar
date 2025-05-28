import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CalendarTask } from '@/hooks/useCalendar';
import { Trash2, Edit3, GripVertical } from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS } from '@/lib/categories';
import { USERS, USER_COLORS, USER_AVATAR_COLORS } from '@/lib/users';

interface TaskItemProps {
  task: CalendarTask;
  onUpdate: (id: number, updates: Partial<CalendarTask>) => void;
  onDelete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editCategory, setEditCategory] = useState(task.category);
  const [editUserId, setEditUserId] = useState(task.user_id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id!.toString(),
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleSave = () => {
    onUpdate(task.id!, {
      title: editTitle,
      description: editDescription,
      category: editCategory,
      user_id: editUserId,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCategory(task.category);
    setEditUserId(task.user_id);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);
    if (confirmed) {
      onDelete(task.id!);
    }
  };

  // Get user info for display
  const user = USERS.find(u => u.id === task.user_id);
  const userInitials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  if (isEditing) {
    return (
      <div className="bg-white p-2 rounded border border-gray-200 shadow-sm">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-sm font-medium mb-1 p-1 border rounded"
          placeholder="Task title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full text-xs mb-1 p-1 border rounded resize-none"
          placeholder="Description (optional)"
          rows={2}
        />
        <select
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
          className="w-full text-xs mb-1 p-1 border rounded"
        >
          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
        <select
          value={editUserId}
          onChange={(e) => setEditUserId(e.target.value)}
          className="w-full text-xs mb-2 p-1 border rounded"
        >
          {USERS.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        touchAction: 'none'
      }}
      className={`
        bg-white p-2 rounded border shadow-sm group border-l-4
        ${CATEGORY_COLORS[task.category] || CATEGORY_COLORS.other}
        ${USER_COLORS[task.user_id] || ''}
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : 'hover:shadow-md'}
        transition-all duration-200
      `}
    >
      {/* Title row with drag handle and action buttons */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-start gap-1 flex-1 min-w-0">
          <div 
            className="cursor-move p-1 hover:bg-white/50 rounded flex-shrink-0 mt-0.5"
            style={{ touchAction: 'none' }}
            {...listeners}
            {...attributes}
            title="Drag to move task"
          >
            <GripVertical className="w-3 h-3 opacity-50" />
          </div>
          <h4 className="text-base font-medium leading-tight break-words flex-1">{task.title}</h4>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 hover:bg-white/50 rounded"
            title="Edit task"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1 hover:bg-red-200 rounded"
            title="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Description spans full width */}
      {task.description && (
        <p className="text-sm opacity-80 leading-tight break-words mb-1">{task.description}</p>
      )}

      {/* Bottom row with category and user avatar */}
      <div className="flex items-center justify-between">
        <span className="text-xs opacity-60 capitalize">{task.category}</span>
        <div 
          className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${USER_AVATAR_COLORS[task.user_id] || 'bg-gray-500'}`}
          title={user?.name || 'Unknown user'}
        >
          {userInitials}
        </div>
      </div>
    </div>
  );
}; 