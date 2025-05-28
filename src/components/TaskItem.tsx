import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CalendarTask } from '@/hooks/useCalendar';
import { Trash2, Edit3, GripVertical } from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS } from '@/lib/categories';

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
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCategory(task.category);
    setIsEditing(false);
  };

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
          className="w-full text-xs mb-2 p-1 border rounded"
        >
          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
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
      style={style}
      className={`
        bg-white p-2 rounded border shadow-sm group
        ${CATEGORY_COLORS[task.category] || CATEGORY_COLORS.other}
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : 'hover:shadow-md'}
        transition-all duration-200
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-1 mb-1">
            <div 
              className="cursor-move p-1 hover:bg-white/50 rounded flex-shrink-0 mt-0.5"
              {...listeners}
              {...attributes}
              title="Drag to move task"
            >
              <GripVertical className="w-3 h-3 opacity-50" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-medium leading-tight break-words">{task.title}</h4>
              {task.description && (
                <p className="text-sm opacity-80 mt-1 leading-tight break-words">{task.description}</p>
              )}
            </div>
          </div>
          <span className="text-xs opacity-60 capitalize">{task.category}</span>
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
              onDelete(task.id!);
            }}
            className="p-1 hover:bg-red-200 rounded"
            title="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}; 