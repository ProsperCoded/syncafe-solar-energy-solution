import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationsPage = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    isLoading,
  } = useNotifications();
  const [unreadOnly, setUnreadOnly] = useState(false);

  const displayNotifications = unreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex md:flex-row flex-col md:justify-between md:items-center mb-6">
        <div>
          <h1 className="flex items-center font-bold text-gray-800 text-3xl">
            <Bell className="mr-2 w-6 h-6" /> Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} New
              </Badge>
            )}
          </h1>
          <p className="text-gray-500">Stay updated on your energy system</p>
        </div>
        <div className="flex items-center space-x-3">
          <Toggle
            pressed={unreadOnly}
            onPressedChange={setUnreadOnly}
            aria-label="Show unread only"
          >
            <Bell className="mr-2 w-4 h-4" />
            Unread only
          </Toggle>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllNotificationsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 font-medium text-lg">Notification Settings</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <Toggle aria-label="Toggle energy alerts" defaultPressed>
                <AlertTriangle className="mr-2 w-4 h-4" />
                Energy Alerts
              </Toggle>
              <Toggle aria-label="Toggle battery updates" defaultPressed>
                <Info className="mr-2 w-4 h-4" />
                Battery Updates
              </Toggle>
              <Toggle aria-label="Toggle device notifications" defaultPressed>
                <AlertCircle className="mr-2 w-4 h-4" />
                Device Notifications
              </Toggle>
              <Toggle aria-label="Toggle system messages" defaultPressed>
                <CheckCircle className="mr-2 w-4 h-4" />
                System Messages
              </Toggle>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center items-center p-6">
              <span className="text-gray-500">Loading notifications...</span>
            </CardContent>
          </Card>
        ) : displayNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="mx-auto w-12 h-12 text-gray-300" />
              <h3 className="mt-2 font-medium text-lg">No notifications</h3>
              <p className="text-gray-500">
                You don't have any {unreadOnly ? "unread " : ""}notifications.
              </p>
            </CardContent>
          </Card>
        ) : (
          displayNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? "bg-white" : "bg-blue-50"}
            >
              <CardContent className="flex justify-between items-start p-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-gray-600">{notification.message}</p>
                    <div className="flex items-center mt-1 text-gray-500 text-xs">
                      <Clock className="mr-1 w-3 h-3" />
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
