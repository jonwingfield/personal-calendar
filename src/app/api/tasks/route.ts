import { NextRequest, NextResponse } from 'next/server';
import { createTask, getTasks, getTasksByMonth } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let tasks;
    if (year && month) {
      tasks = getTasksByMonth(parseInt(year), parseInt(month));
    } else if (date) {
      tasks = getTasks(date);
    } else {
      tasks = getTasks();
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
    const { title, description, category, date } = body;

    if (!title || !category || !date) {
      return NextResponse.json(
        { error: 'Title, category, and date are required' },
        { status: 400 }
      );
    }

    const taskId = createTask({ title, description, category, date });
    return NextResponse.json({ id: taskId, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
} 