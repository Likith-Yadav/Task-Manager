'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useTaskStore } from '@/store/task-store';
import { TaskList } from '@/components/tasks/task-list';
import { TaskForm } from '@/components/tasks/task-form';
import { Button } from '@/components/ui/button';
import type { Task } from '@/lib/models';

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks = [], loading, fetchTasks, addTask, editTask, removeTask } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      fetchTasks(user.id);
    }
  }, [user, fetchTasks]);

  const handleCreateTask = async (data: any) => {
    if (!user) return;
    await addTask({
      ...data,
      userId: user.id,
    });
    setIsFormOpen(false);
  };

  const handleEditTask = async (data: any) => {
    if (!editingTask) return;
    await editTask(editingTask.id, data);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await removeTask(taskId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">Tasks</h1>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setIsFormOpen(true)}
        >
          Create New Task
        </Button>
      </div>

      {(isFormOpen || editingTask) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <TaskForm
              initialData={editingTask || undefined}
              onSubmit={editingTask ? handleEditTask : handleCreateTask}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
        <TaskList
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}
