'use client';

import { useState } from 'react';
import { Task } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const [sortField, setSortField] = useState<keyof Task>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp || !(timestamp instanceof Timestamp)) {
      return '-';
    }
    return timestamp.toDate().toLocaleDateString();
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortField === 'createdAt' || sortField === 'dueDate') {
      const aValue = a[sortField] instanceof Timestamp ? (a[sortField] as Timestamp).toMillis() : 0;
      const bValue = b[sortField] instanceof Timestamp ? (b[sortField] as Timestamp).toMillis() : 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  const handleSort = (field: keyof Task) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatStatus = (status: string) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : '';
  };

  const formatPriority = (priority: string | undefined) => {
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'None';
  };

  const renderSortIndicator = (field: keyof Task) => {
    return sortField === field && (
      <span className="ml-1" key={`sort-${field}`}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tasks found. Create a new task to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead key="header">
          <tr className="border-b border-gray-800">
            <th
              className="px-4 py-3 text-left cursor-pointer text-gray-400 hover:text-white"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center">
                Title
                {renderSortIndicator('title')}
              </div>
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer text-gray-400 hover:text-white"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                {renderSortIndicator('status')}
              </div>
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer text-gray-400 hover:text-white"
              onClick={() => handleSort('priority')}
            >
              <div className="flex items-center">
                Priority
                {renderSortIndicator('priority')}
              </div>
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer text-gray-400 hover:text-white"
              onClick={() => handleSort('dueDate')}
            >
              <div className="flex items-center">
                Due Date
                {renderSortIndicator('dueDate')}
              </div>
            </th>
            <th className="px-4 py-3 text-right text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody key="task-list">
          {sortedTasks.map((task) => (
            <tr key={`task-${task.id}`} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium text-white">{task.title}</div>
                  {task.description && (
                    <div className="text-gray-400 truncate max-w-md">
                      {task.description}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    task.status === 'completed'
                      ? 'bg-green-900/50 text-green-400'
                      : task.status === 'in_progress'
                      ? 'bg-blue-900/50 text-blue-400'
                      : 'bg-gray-900/50 text-gray-400'
                  }`}
                >
                  {formatStatus(task.status)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    task.priority === 'high'
                      ? 'bg-red-900/50 text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-yellow-900/50 text-yellow-400'
                      : task.priority === undefined
                      ? 'bg-gray-900/50 text-gray-400'
                      : 'bg-green-900/50 text-green-400'
                  }`}
                >
                  {formatPriority(task.priority)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400">
                {formatDate(task.dueDate as Timestamp)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end space-x-2">
                  <Button
                    key={`edit-${task.id}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    key={`delete-${task.id}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-gray-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
