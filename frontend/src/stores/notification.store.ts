import { create } from 'zustand';
import { notificationApi, NotificationItem } from '../services/notification.service';

interface NotificationState {
  unreadCount: number;
  list: NotificationItem[];
  loading: boolean;

  fetchUnreadCount: () => Promise<void>;
  fetchList: (isRead?: boolean) => Promise<void>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  startPolling: () => () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  list: [],
  loading: false,

  fetchUnreadCount: async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      set({ unreadCount: typeof res.data === 'number' ? res.data : 0 });
    } catch { /* ignore */ }
  },

  fetchList: async (isRead?: boolean) => {
    set({ loading: true });
    try {
      const res = await notificationApi.getList(isRead);
      set({ list: res.data || [] });
    } catch { /* ignore */ }
    finally { set({ loading: false }); }
  },

  markRead: async (id: number) => {
    try {
      await notificationApi.markRead(id);
      set((s) => ({
        list: s.list.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }));
    } catch { /* ignore */ }
  },

  markAllRead: async () => {
    try {
      await notificationApi.markAllRead();
      set((s) => ({
        list: s.list.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch { /* ignore */ }
  },

  startPolling: () => {
    get().fetchUnreadCount();
    const timer = setInterval(() => get().fetchUnreadCount(), 30000);
    return () => clearInterval(timer);
  },
}));
