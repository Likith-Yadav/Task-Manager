'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TaskPriority, TaskStatus } from '@/lib/models';

interface TaskFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TaskStatus | 'all') => void;
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  onSortChange: (sort: 'dueDate' | 'priority' | 'status' | 'title') => void;
}

export function TaskFilters({
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: TaskFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search tasks..."
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {isFiltersOpen && (
        <div className="grid gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
            >
              <option value="all">All</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              onChange={(e) =>
                onPriorityChange(e.target.value as TaskPriority | 'all')
              }
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              onChange={(e) =>
                onSortChange(
                  e.target.value as 'dueDate' | 'priority' | 'status' | 'title'
                )
              }
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
