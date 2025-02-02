'use client';

import { useState } from 'react';
import { TaskStatus, TaskPriority } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { userId: string }) => void;
  onCancel: () => void;
}

interface Task {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Timestamp;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'todo');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate 
      ? new Date(initialData.dueDate.toMillis()).toISOString().split('T')[0]
      : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    onSubmit({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : undefined,
      userId: user.id,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full rounded-md bg-gray-800 border-gray-700 text-white"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full rounded-md bg-gray-800 border-gray-700 text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Due Date
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            {initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </div>
  );
}
