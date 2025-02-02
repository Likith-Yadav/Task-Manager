'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useTaskStore } from '@/store/task-store';
import { useProjectStore } from '@/store/project-store';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks = [], loading: tasksLoading, fetchTasks } = useTaskStore();
  const { projects = [], loading: projectsLoading, fetchProjects } = useProjectStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchTasks(user.id);
      fetchProjects(user.id);
    }
  }, [user, fetchTasks, fetchProjects]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-gray-400">
        Loading...
      </div>
    );
  }

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-8 bg-gray-900">
      <h1 className="text-2xl font-semibold text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-white">Total Tasks</h2>
          <p className="text-3xl font-bold text-indigo-500 mt-2">{tasks?.length || 0}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-white">Active Projects</h2>
          <p className="text-3xl font-bold text-indigo-500 mt-2">{projects?.length || 0}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-white">Completed Tasks</h2>
          <p className="text-3xl font-bold text-indigo-500 mt-2">{tasks?.filter((task) => task.status === 'completed')?.length || 0}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-white">Pending Tasks</h2>
          <p className="text-3xl font-bold text-indigo-500 mt-2">{tasks?.filter((task) => task.status !== 'completed')?.length || 0}</p>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
          <Link href="/projects">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
          {projects && projects.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="p-4 hover:bg-gray-900/80 transition-colors"
                >
                  <h3 className="font-medium text-white">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No projects found. Create your first project to get started!
            </div>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
          <Link href="/tasks">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </Link>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
          {tasks && tasks.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-900/80 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-white">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-900/50 text-green-400'
                          : task.status === 'in_progress'
                          ? 'bg-blue-900/50 text-blue-400'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-900/50 text-red-400'
                          : task.priority === 'medium'
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : 'bg-green-900/50 text-green-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No tasks found. Create your first task to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
