import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationStore = create()(
    persist(
        (set) => ({
            notifications: [],
            unreadCount: 0,

            addNotification: (notification) =>
                set((state) => {
                    // Check if notification already exists
                    const exists = state.notifications.some((n) => n._id === notification._id);
                    if (exists) return state;

                    const newNotifications = [notification, ...state.notifications];
                    const unreadCount = newNotifications.filter((n) => !n.read).length;

                    return {
                        notifications: newNotifications,
                        unreadCount
                    };
                }),

            markAsRead: (notificationId) =>
                set((state) => {
                    const updatedNotifications = state.notifications.map((notification) =>
                        notification._id === notificationId
                            ? { ...notification, read: true }
                            : notification
                    );

                    const unreadCount = updatedNotifications.filter((n) => !n.read).length;

                    return {
                        notifications: updatedNotifications,
                        unreadCount
                    };
                }),

            markAllAsRead: () =>
                set((state) => ({
                    notifications: state.notifications.map((notification) => ({
                        ...notification,
                        read: true
                    })),
                    unreadCount: 0
                })),

            clearNotifications: () =>
                set({ notifications: [], unreadCount: 0 }),
        }),
        {
            name: 'notifications-storage',
        }
    )
);
