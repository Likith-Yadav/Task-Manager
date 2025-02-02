'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { format } from 'date-fns';
import type { Task } from '@/lib/models';
import { Timestamp } from 'firebase/firestore';

interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

export function TaskCalendar({ tasks, onTaskClick }: TaskCalendarProps) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const taskEvents = tasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const dueDate = (task.dueDate as Timestamp).toDate();
        return {
          id: task.id,
          title: task.title,
          start: format(dueDate, 'yyyy-MM-dd'),
          backgroundColor: getTaskColor(task.priority, task.status),
          borderColor: getTaskColor(task.priority, task.status),
          textColor: '#ffffff',
        };
      });

    setEvents(taskEvents);
  }, [tasks]);

  const getTaskColor = (priority: string, status: string) => {
    if (status === 'completed') return '#22c55e'; // green-500
    switch (priority) {
      case 'high':
        return '#ef4444'; // red-500
      case 'medium':
        return '#f97316'; // orange-500
      case 'low':
        return '#3b82f6'; // blue-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow task-calendar">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          if (info.event.id) {
            onTaskClick(info.event.id);
          }
        }}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        dayMaxEvents={3}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
      />
    </div>
  );
}
