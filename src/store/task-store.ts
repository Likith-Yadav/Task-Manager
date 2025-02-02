'use client';

import { create } from 'zustand';
import { Task, Category } from '@/lib/models';
import { createTask, updateTask, deleteTask, getUserTasks } from '@/lib/firebase-utils';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface TaskStore {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchTasks: (userId: string) => Promise<void>;
  fetchCategories: (userId: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  categories: [],
  loading: false,
  error: null,

  fetchTasks: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const tasks = await getUserTasks(userId);
      set({ tasks, loading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },

  fetchCategories: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const categories: Category[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as Category));

      set({ categories, loading: false });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: 'Failed to fetch categories', loading: false });
    }
  },

  addCategory: async (category) => {
    try {
      set({ loading: true, error: null });
      const categoriesRef = collection(db, 'categories');
      const docRef = await addDoc(categoriesRef, category);
      
      set((state) => ({
        categories: [...state.categories, { id: docRef.id, ...category }],
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      set({ error: 'Failed to add category', loading: false });
    }
  },

  removeCategory: async (categoryId: string) => {
    try {
      set({ loading: true, error: null });
      const categoryRef = doc(db, 'categories', categoryId);
      await deleteDoc(categoryRef);
      
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== categoryId),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error removing category:', error);
      set({ error: 'Failed to remove category', loading: false });
    }
  },

  addTask: async (task) => {
    try {
      set({ loading: true, error: null });
      const newTask = await createTask(task);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task', loading: false });
    }
  },

  editTask: async (taskId, updates) => {
    try {
      set({ loading: true, error: null });
      const updatedTask = await updateTask(taskId, updates);
      set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === taskId ? updatedTask : task
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: 'Failed to update task', loading: false });
    }
  },

  removeTask: async (taskId) => {
    try {
      set({ loading: true, error: null });
      await deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error removing task:', error);
      set({ error: 'Failed to remove task', loading: false });
    }
  },
}));