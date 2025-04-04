
import { useState, useEffect, useCallback } from 'react';
import { useEnhancedApi } from '@/context/EnhancedApiContext';
import { NotificationData } from '@/services/api/notificationService';
import { toast } from "sonner";

export function useNotifications() {
  const { notificationService } = useEnhancedApi();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!notificationService) {
      console.warn('Notification service not available yet');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await notificationService.getNotifications();
      if (response.data) {
        setNotifications(response.data);
        // Count unread notifications
        setUnreadCount(response.data.filter(n => !n.read).length);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [notificationService]);
  
  // Mark a notification as read
  const markAsRead = async (id: string) => {
    if (!notificationService) return;
    
    try {
      const response = await notificationService.markAsRead(id);
      if (response.data) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!notificationService) return;
    
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };
  
  // Delete a notification
  const deleteNotification = async (id: string) => {
    if (!notificationService) return;
    
    try {
      await notificationService.deleteNotification(id);
      const notificationToRemove = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      // Update unread count if needed
      if (notificationToRemove && !notificationToRemove.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };
  
  // Subscribe to real-time updates
  useEffect(() => {
    // Skip if service is not available
    if (!notificationService) {
      console.warn('Notification service not available yet, skipping real-time subscription');
      return;
    }
    
    // Initial load
    loadNotifications();
    
    // Subscribe to real-time notifications
    const unsubscribe = notificationService.subscribeToRealTimeUpdates((newNotification) => {
      // Add the new notification to the list
      setNotifications(prev => [newNotification, ...prev]);
      
      // Update unread count
      if (!newNotification.read) {
        setUnreadCount(prev => prev + 1);
      }
      
      // Show a toast notification for the new notification
      toast(newNotification.title, {
        description: newNotification.message,
        action: {
          label: "View",
          onClick: () => {
            // Navigate to the relevant page if there's an action URL
            if (newNotification.actionUrl) {
              window.location.href = newNotification.actionUrl;
            }
            // Mark as read
            markAsRead(newNotification.id);
          },
        },
      });
    });
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [notificationService, loadNotifications]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications
  };
}
