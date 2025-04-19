import { useState, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BatteryStorage, BatteryStorageDB } from "@/types/energy";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/sonner";

// Define context type
interface BatteryStorageContextType {
  batteryStorage: BatteryStorage & { isCharging: boolean };
  setBatteryStorage: React.Dispatch<
    React.SetStateAction<BatteryStorage & { isCharging: boolean }>
  >;
  updateBatteryStorage: (data: Partial<BatteryStorageDB>) => void;
  updateBatterySettings: (data: {
    maxCapacity: number;
    efficiency: number;
  }) => void;
  isLoading: boolean;
}

const BatteryStorageContext = createContext<BatteryStorageContextType | null>(
  null
);

// Provider component
export function BatteryStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [batteryStorage, setBatteryStorage] = useState<
    BatteryStorage & { isCharging: boolean }
  >({
    currentCapacity: 0,
    maxCapacity: 10000,
    efficiency: 0.85,
    lastUpdated: new Date(),
    isCharging: false,
  });

  // Fetch battery data from database
  const { data: batteryData, isLoading } = useQuery({
    queryKey: ["battery_storage", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("battery_storage")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // If no record exists, create one
        if (error.code === "PGRST116") {
          const defaultBattery = {
            user_id: user.id,
            current_capacity: 0,
            max_capacity: 10000,
            efficiency: 0.85,
            last_updated: new Date().toISOString(),
            is_charging: false,
          };

          const { data: newData, error: insertError } = await supabase
            .from("battery_storage")
            .insert([defaultBattery])
            .select()
            .single();

          if (insertError) throw insertError;
          return newData as BatteryStorageDB;
        }
        throw error;
      }

      return data as BatteryStorageDB;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!user,
  });

  // Update battery storage in database (throttled)
  const updateBatteryStorage = (batteryData: Partial<BatteryStorageDB>) => {
    if (!user) return;

    // Only update if we haven't synced in the last 5 seconds
    const now = new Date();
    if (now.getTime() - lastSyncTime.getTime() < 5000) {
      return;
    }

    setLastSyncTime(now);

    // Update in database
    supabase
      .from("battery_storage")
      .update({
        ...batteryData,
        last_updated: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating battery storage:", error);
        }
      });
  };

  // Update battery settings like max capacity
  const updateBatterySettings = ({
    maxCapacity,
    efficiency,
  }: {
    maxCapacity: number;
    efficiency: number;
  }) => {
    if (!user) return;

    // Update locally first
    setBatteryStorage((prev) => ({
      ...prev,
      maxCapacity,
      efficiency,
    }));

    // Update in database
    supabase
      .from("battery_storage")
      .update({
        max_capacity: maxCapacity,
        efficiency: efficiency,
        last_updated: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating battery settings:", error);
          toast.error("Failed to update battery settings");
        } else {
          queryClient.invalidateQueries({
            queryKey: ["battery_storage", user.id],
          });
          toast.success("Battery settings updated successfully");
        }
      });
  };

  // Set battery state from database on initial load
  useEffect(() => {
    if (batteryData && !isLoading) {
      setBatteryStorage({
        currentCapacity: batteryData.current_capacity,
        maxCapacity: batteryData.max_capacity,
        efficiency: batteryData.efficiency,
        lastUpdated: new Date(batteryData.last_updated),
        isCharging: batteryData.is_charging,
      });
    }
  }, [batteryData, isLoading]);

  // Sync before user leaves the page
  useEffect(() => {
    const syncBatteryData = () => {
      if (!user) return;

      updateBatteryStorage({
        current_capacity: batteryStorage.currentCapacity,
        max_capacity: batteryStorage.maxCapacity,
        efficiency: batteryStorage.efficiency,
        is_charging: batteryStorage.isCharging,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        syncBatteryData();
      }
    };

    const handleBeforeUnload = () => {
      syncBatteryData();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [batteryStorage, user]);

  return (
    <BatteryStorageContext.Provider
      value={{
        batteryStorage,
        setBatteryStorage,
        updateBatteryStorage,
        updateBatterySettings,
        isLoading,
      }}
    >
      {children}
    </BatteryStorageContext.Provider>
  );
}

// Hook to use the battery storage context
export function useBatteryStorage() {
  const context = useContext(BatteryStorageContext);
  if (!context) {
    throw new Error(
      "useBatteryStorage must be used within a BatteryStorageProvider"
    );
  }
  return context;
}
