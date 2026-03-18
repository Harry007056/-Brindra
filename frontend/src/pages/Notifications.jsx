import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, MessageCircle, FileText, UserCheck, CalendarClock, X } from 'lucide-react';

const notifications = [
  { id: 1, type: 'task', title: 'Task assigned to you', message: 'Review Q3 Design System - Due Oct 15', time: '2h ago', read: false },
  { id: 2, type: 'mention', title: '@You mentioned in chat', message: 'Priya in #design: Great feedback on the wireframes!', time: '5h ago', read: true },
  { id: 3, type: 'project', title: 'Project milestone reached', message: 'Backend Sprint completed ahead of schedule', time: '1d ago', read: false },
  { id: 4, type: 'file', title: 'New file shared', message: 'API docs updated by Harshal', time: '1d ago', read: false },
  { id: 5, type: 'deadline', title: 'Upcoming deadline', message: 'Client Presentation Deck due tomorrow', time: '2d ago', read: true },
];

const typeIcons = {
  task: UserCheck,
  mention: MessageCircle,
  project: CheckCircle,
  file: FileText,
  deadline: CalendarClock,
};

export default function Notifications() {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => filter === 'all' || n.type === filter);

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent-warm-grey">Notifications</h1>
          <p className="text-text-default mt-1">Stay updated with team activity</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20 transition-all">Mark All Read</button>
          <button className="px-4 py-2 bg-primary-dusty-blue text-background-warm-off-white rounded-xl hover:bg-primary-soft-sky transition-all font-medium">Clear All</button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'task', 'mention', 'project', 'file', 'deadline'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === type
                ? 'bg-primary-dusty-blue text-background-warm-off-white shadow-md'
                : 'bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20'
            }`}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification) => {
          const Icon = typeIcons[notification.type];
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group relative p-4 rounded-2xl border transition-all ${
                notification.read
                  ? 'border-[#88C0D0]/25 bg-background-warm-off-white hover:shadow-md'
                  : 'border-primary-soft-sky/50 bg-primary-soft-sky/10 ring-2 ring-primary-soft-sky/20 shadow-lg hover:shadow-xl'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-primary-dusty-blue to-primary-soft-sky text-background-warm-off-white shadow-md mt-0.5`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-accent-warm-grey leading-tight pr-6">{notification.title}</h3>
                    <span className="text-xs text-text-muted whitespace-nowrap flex-shrink-0 ml-4">{notification.time}</span>
                  </div>
                  <p className="text-sm text-text-default mb-2">{notification.message}</p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0 w-2 h-2 bg-primary-dusty-blue rounded-full mt-2 animate-pulse" />
                )}
              </div>
            </motion.div>
          );
        })}
        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-2xl border-2 border-dashed border-[#88C0D0]/25 bg-background-warm-off-white"
          >
            <Bell className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-main mb-2">No notifications</h3>
            <p className="text-text-muted">You're all caught up!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

