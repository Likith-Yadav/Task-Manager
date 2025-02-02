import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  projectId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  categoryIds?: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCategory {
  taskId: string;
  categoryId: string;
}
