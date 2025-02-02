'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useProjectStore } from '@/store/project-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { Project } from '@/lib/models';

export default function ProjectsPage() {
  const { user } = useAuth();
  const { projects = [], loading, fetchProjects, addProject, editProject, removeProject } = useProjectStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    if (user) {
      fetchProjects(user.id);
    }
  }, [user, fetchProjects]);

  const handleCreateProject = async () => {
    if (!user || !projectName.trim()) return;
    
    try {
      await addProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
        userId: user.id
      });
      setIsFormOpen(false);
      setProjectName('');
      setProjectDescription('');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleEditProject = async () => {
    if (!user || !editingProject || !projectName.trim()) return;
    
    try {
      await editProject(editingProject.id!, {
        name: projectName.trim(),
        description: projectDescription.trim()
      });
      setEditingProject(null);
      setProjectName('');
      setProjectDescription('');
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await removeProject(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {(isFormOpen || editingProject) && (
        <div className="mb-8 p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h2 className="text-lg font-medium text-white mb-4">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Name
              </label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <Input
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Enter project description"
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={editingProject ? handleEditProject : handleCreateProject}>
                {editingProject ? 'Update' : 'Create'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingProject(null);
                  setProjectName('');
                  setProjectDescription('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 rounded-xl border border-gray-800 bg-gray-900/50"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-medium text-white">{project.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(project)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id!)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {project.description && (
              <p className="text-sm text-gray-400">{project.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
