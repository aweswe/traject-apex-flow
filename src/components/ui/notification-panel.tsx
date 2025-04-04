
import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, Info, X } from 'lucide-react';
import { NotificationData } from '@/services/api/notificationService';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import { format, formatDistance } from 'date-fns';

interface NotificationPanelProps {
  notifications: NotificationData[];
  unreadCount: number;
  onMarkRead: (id: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onClose,
  isOpen
}: NotificationPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Filter notifications based on selected tab
  const filteredNotifications = selectedTab === 'all' 
    ? notifications 
    : notifications.filter(notification => !notification.read);
  
  // Animation classes based on isOpen
  const animationClasses = isOpen
    ? 'translate-y-0 opacity-100'
    : 'translate-y-4 opacity-0 pointer-events-none';

  return (
    <div 
      ref={panelRef}
      className={`absolute right-0 top-16 w-80 md:w-96 bg-background border rounded-lg shadow-lg z-50 transition-all duration-200 ${animationClasses}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${selectedTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setSelectedTab('all')}
        >
          All
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${selectedTab === 'unread' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setSelectedTab('unread')}
        >
          Unread
        </button>
      </div>
      
      {/* Notification List */}
      <ScrollArea className="h-[400px]">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
                onClick={() => onMarkRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {notification.createdAt && formatDistance(new Date(notification.createdAt), new Date(), { addSuffix: true })}
                  </span>
                  {notification.read && (
                    <span className="flex items-center text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Read
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-3 border-t">
        <Button 
          variant="outline" 
          className="w-full text-sm" 
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </div>
    </div>
  );
}
