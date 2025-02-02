'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { Task } from '@/lib/models';
import { Timestamp } from 'firebase/firestore';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  priority: 'low' | 'medium' | 'high';
}

interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

export function TaskCalendar({ tasks, onTaskClick }: TaskCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const taskEvents = tasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const dueDate = (task.dueDate as Timestamp).toDate();
        return {
          id: task.id,
          title: task.title,
          start: dueDate,
          end: dueDate,
          priority: task.priority as 'low' | 'medium' | 'high',
        };
      });

    setEvents(taskEvents);
  }, [tasks]);

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
