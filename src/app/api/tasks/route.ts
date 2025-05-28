import { NextRequest, NextResponse } from 'next/server';
import { createTask, getTasks, getTasksByMonth } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const userId = searchParams.get('userId');

    let tasks;
    if (year && month) {
      tasks = getTasksByMonth(parseInt(year), parseInt(month));
      if (userId && userId !== 'all') {
        tasks = tasks.filter(task => task.user_id === userId);
      }
    } else if (date) {
      tasks = getTasks(date, userId && userId !== 'all' ? userId : undefined);
    } else {
      tasks = getTasks(undefined, userId && userId !== 'all' ? userId : undefined);
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, date, user_id } = body;

    if (!title || !category || !date || !user_id) {
      return NextResponse.json(
        { error: 'Title, category, date, and user_id are required' },
        { status: 400 }
      );
    }

    const taskId = createTask({ title, description, category, date, user_id });
    return NextResponse.json({ id: taskId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
} 