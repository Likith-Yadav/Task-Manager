'use client';

import { create } from 'zustand';
import type { Project } from '@/lib/models';
import { createProject, getUserProjects, updateProject, deleteProject } from '@/lib/firebase-utils';

interface CreateProjectData {
  name: string;
  description?: string;
  userId: string;
}

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: (userId: string) => Promise<void>;
  addProject: (project: CreateProjectData) => Promise<void>;
  editProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  removeProject: (projectId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const projects = await getUserProjects(userId);
      set({ projects, loading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ error: 'Failed to fetch projects', loading: false });
    }
  },

  addProject: async (projectData: CreateProjectData) => {
    try {
      set({ loading: true, error: null });
      const newProject = await createProject(projectData);
      set((state) => ({
        projects: [newProject, ...state.projects],
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error adding project:', error);
      set({ error: 'Failed to add project', loading: false });
    }
  },

  editProject: async (projectId: string, updates: Partial<Project>) => {
    try {
      set({ loading: true, error: null });
      const updatedProject = await updateProject(projectId, updates);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId ? updatedProject : project
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error updating project:', error);
      set({ error: 'Failed to update project', loading: false });
    }
  },

  removeProject: async (projectId: string) => {
    try {
      set({ loading: true, error: null });
      await deleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== projectId),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error removing project:', error);
      set({ error: 'Failed to remove project', loading: false });
    }
  }
}));
