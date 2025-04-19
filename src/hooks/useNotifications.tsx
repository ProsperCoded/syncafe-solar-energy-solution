import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EnergyNotification } from "@/types/energy";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/sonner";

// Define context type
interface NotificationsContextType {
  notifications: EnergyNotification[];
  addNotification: (
    notification: Omit<
      EnergyNotification,
      "id" | "userId" | "timestamp" | "read"
    >
  ) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  isLoading: boolean;
  refetch: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(
  null
);

// Provider component
export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<EnergyNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastLoadTime, setLastLoadTime] = useState(0);

  // Fetch notifications - will be throttled
  const fetchNotifications = async (forceRefresh = false) => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    // Only refetch if it's been more than 5 seconds since the last fetch or forced refresh
    const now = Date.now();
    if (!forceRefresh && now - lastLoadTime < 5000) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false });

      if (error) throw error;

      setNotifications(
        data.map((notification) => ({
          ...notification,
          timestamp: new Date(notification.timestamp),
        }))
      );
      setLastLoadTime(now);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new notification
  const addNotification = async (
    notification: Omit<
      EnergyNotification,
      "id" | "userId" | "timestamp" | "read"
    >
  ) => {
    if (!user) return;

    try {
      const newNotification = {
        user_id: user.id,
        ...notification,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const { data, error } = await supabase
        .from("notifications")
        .insert([newNotification])
        .select()
        .single();

      if (error) throw error;

      // Optimistically update the local state
      setNotifications((prev) => [
        {
          ...data,
          timestamp: new Date(data.timestamp),
        } as EnergyNotification,
        ...prev,
      ]);
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  // Mark a notification as read
  const markNotificationRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;

      // Optimistically update the UI
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsRead = async () => {
    if (!user || notifications.every((n) => n.read)) return;

    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);

      if (error) throw error;

      // Optimistically update the UI
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Initial fetch when the user changes
  useEffect(() => {
    fetchNotifications(true);

    // Set up periodic refresh (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [user]);

  // Manually trigger a refetch
  const refetch = () => fetchNotifications(true);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        isLoading,
        refetch,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// Hook to use the notifications context
export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
}
