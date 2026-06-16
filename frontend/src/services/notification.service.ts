import http from './http';

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  content: string;
  refType: string | null;
  refId: number | null;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getList: (isRead?: boolean) =>
    http.get('/notification', { params: isRead !== undefined ? { isRead } : {} }),

  getUnreadCount: () =>
    http.get('/notification/unread-count'),

  markRead: (id: number) =>
    http.post(`/notification/${id}/read`),

  markAllRead: () =>
    http.post('/notification/read-all'),
};
