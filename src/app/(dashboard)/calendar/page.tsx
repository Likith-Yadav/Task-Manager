'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useTaskStore } from '@/store/task-store';
import { TaskCalendar } from '@/components/tasks/task-calendar';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const { user } = useAuth();
  const { tasks = [], loading, fetchTasks } = useTaskStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchTasks(user.id);
    }
  }, [user, fetchTasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-gray-400">
        Loading...
      </div>
    );
  }

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  return (
    <div className="flex flex-col h-full p-8 bg-gray-900">
      <h1 className="text-2xl font-semibold text-white mb-8">Calendar</h1>
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <TaskCalendar tasks={tasks} onTaskClick={handleTaskClick} />
      </div>
    </div>
  );
}
