
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEnergyData } from '@/hooks/useEnergyData';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, AlertTriangle, CheckCircle, Info, AlertCircle, Clock, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

export const NotificationsPage = () => {
  const { notifications, markNotificationRead } = useEnergyData();
  const [unreadOnly, setUnreadOnly] = useState(false);
  
  const displayNotifications = unreadOnly 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationRead.mutate(notification.id);
      }
    });
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead.mutate(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500">Stay updated on your energy system</p>
        </div>
        <div className="flex items-center space-x-3">
          <Toggle 
            pressed={unreadOnly} 
            onPressedChange={setUnreadOnly}
            aria-label="Show unread only"
          >
            <Bell className="h-4 w-4 mr-2" />
            Unread only
          </Toggle>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Notification Settings</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <Toggle aria-label="Toggle energy alerts" defaultPressed>
                <AlertTriangle className="h-4 w-4 mr-2" /> 
                Energy Alerts
              </Toggle>
              <Toggle aria-label="Toggle tips" defaultPressed>
                <Info className="h-4 w-4 mr-2" /> 
                Energy Tips
              </Toggle>
              <Toggle aria-label="Toggle device status" defaultPressed>
                <AlertCircle className="h-4 w-4 mr-2" /> 
                Device Status
              </Toggle>
              <Toggle aria-label="Toggle billing updates" defaultPressed>
                <CheckCircle className="h-4 w-4 mr-2" /> 
                Billing Updates
              </Toggle>
              <Toggle aria-label="Toggle system status" defaultPressed>
                <Bell className="h-4 w-4 mr-2" /> 
                System Status
              </Toggle>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Center
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500">{unreadCount} new</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-lg border flex items-start ${
                    notification.read ? 'bg-white' : 'bg-blue-50'
                  }`}
                >
                  <div className="mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {notification.title}
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 ml-2 rounded-full bg-blue-500"></span>
                        )}
                      </h3>
                      <button 
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => handleMarkRead(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
