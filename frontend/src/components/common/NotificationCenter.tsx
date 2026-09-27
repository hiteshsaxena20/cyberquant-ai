import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Bell, ShieldAlert, Bot, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
import { mockNotifications, NotificationItem } from '../../data/mockData';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'risk' | 'ai' | 'compliance'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => filter === 'all' || n.type === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-dark-900 border-l border-dark-700/80 shadow-2xl h-full flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-dark-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyber-500/10 text-cyber-400 border border-cyber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Notifications</h2>
              <p className="text-xs text-dark-400">
                {unreadCount > 0 ? `${unreadCount} unread alerts requiring attention` : 'All caught up'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-dark-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {(['all', 'risk', 'ai', 'compliance'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  filter === cat
                    ? 'bg-cyber-600 text-white shadow-sm'
                    : 'text-dark-400 hover:bg-dark-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-cyber-400 hover:text-cyber-300 font-medium flex items-center gap-1 whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-dark-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-dark-600 mx-auto" />
              <p className="text-sm">No notifications found for this filter.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const Icon =
                item.type === 'risk'
                  ? ShieldAlert
                  : item.type === 'ai'
                  ? Bot
                  : item.type === 'compliance'
                  ? AlertTriangle
                  : Bell;

              const badgeColor =
                item.severity === 'critical'
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : item.severity === 'high'
                  ? 'border-orange-500/30 bg-orange-500/10 text-orange-400'
                  : item.severity === 'medium'
                  ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                  : 'border-blue-500/30 bg-blue-500/10 text-blue-400';

              return (
                <div
                  key={item.id}
                  onClick={() => markSingleAsRead(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    item.read
                      ? 'bg-dark-950/40 border-dark-800 text-dark-300 opacity-75'
                      : 'glass-card border-dark-700 hover:border-cyber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${badgeColor} flex-shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        {!item.read && <div className="w-2 h-2 rounded-full bg-cyber-500" />}
                      </div>
                      <p className="text-xs text-dark-300 leading-relaxed">{item.message}</p>
                      <div className="flex items-center justify-between pt-2 text-[10px] text-dark-500">
                        <span>{item.timestamp}</span>
                        {item.link && (
                          <Link
                            to={item.link}
                            onClick={onClose}
                            className="text-cyber-400 hover:underline font-medium"
                          >
                            View details →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-800 bg-dark-950/80 text-center">
          <Link
            to="/audit"
            onClick={onClose}
            className="text-xs text-dark-400 hover:text-white transition-colors"
          >
            View full Audit Logs & System Activity →
          </Link>
        </div>
      </div>
    </div>
  );
}
