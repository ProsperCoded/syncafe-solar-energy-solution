import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Device, SolarData, Profile, EnergyTransaction } from "@/types/energy";

interface DataContextType {
  devices: Device[];
  solarData: SolarData | null;
  profile: Profile | null;
  transactions: EnergyTransaction[];
  updateDevice: (id: string, isOn: boolean) => Promise<void>;
  updateDevicePriority: (
    deviceId: string,
    newPriority: number
  ) => Promise<void>;
  updateSolarData: (data: Omit<SolarData, "id">) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  addDevice: (device: Omit<Device, "id" | "is_on">) => Promise<void>;
  sellEnergy: (
    amount: number
  ) => Promise<{ amount: number; earnings: number } | undefined>;
  isLoading: boolean;
  refetchData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  const { user } = useAuth();
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [devices, setDevices] = useState<Device[]>([]);
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<EnergyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch function with throttling
  const fetchDataFromSupabase = async (forceRefresh = false) => {
    if (!user) {
      setDevices([]);
      setSolarData(null);
      setProfile(null);
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    // Only refetch if it's been more than 5 seconds since the last fetch or forced refresh
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime < 5000) {
      return;
    }

    setIsLoading(true);

    try {
      // Fetch devices
      const { data: devicesData, error: devicesError } = await supabase
        .from("devices")
        .select("*")
        .eq("user_id", user.id);

      if (devicesError) throw devicesError;
      setDevices(devicesData as Device[]);

      // Fetch solar data
      const { data: solarDataResult, error: solarError } = await supabase
        .from("solar_data")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (solarError && solarError.code !== "PGRST116") {
        throw solarError;
      } else if (!solarError) {
        setSolarData(solarDataResult as SolarData);
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData as Profile);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } =
        await supabase
          .from("energy_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("timestamp", { ascending: false });

      if (transactionsError) throw transactionsError;
      setTransactions(
        transactionsData.map((t) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })) as EnergyTransaction[]
      );

      setLastFetchTime(now);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update a device's status
  const updateDevice = async (id: string, is_on: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("devices")
        .update({ is_on })
        .eq("id", id);

      if (error) throw error;

      // Optimistically update local state
      setDevices((prev) =>
        prev.map((device) => (device.id === id ? { ...device, is_on } : device))
      );
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  // Update a device's priority
  const updateDevicePriority = async (
    deviceId: string,
    newPriority: number
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("devices")
        .update({ priority: newPriority })
        .eq("id", deviceId);

      if (error) throw error;

      // Optimistically update local state
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId ? { ...device, priority: newPriority } : device
        )
      );
    } catch (error) {
      console.error("Error updating device priority:", error);
    }
  };

  // Update solar data
  const updateSolarData = async (data: Omit<SolarData, "id">) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("solar_data")
        .upsert([{ ...data, user_id: user.id }]);

      if (error) throw error;

      // Optimistically update local state
      setSolarData((prev) =>
        prev ? { ...prev, ...data } : ({ id: "temp-id", ...data } as SolarData)
      );
    } catch (error) {
      console.error("Error updating solar data:", error);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) throw error;

      // Optimistically update local state
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Add new device
  const addDevice = async (device: Omit<Device, "id" | "is_on">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("devices")
        .insert([{ ...device, is_on: false, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Update local state with the new device
      setDevices((prev) => [...prev, data as Device]);
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  // Sell energy
  const sellEnergy = async (amount: number) => {
    if (!user || !profile) return;

    try {
      // Calculate earnings based on sale rate
      const rate = profile.sale_rate || 0.1;
      const earnings = (amount * rate) / 1000; // Convert watts to kWh

      const { data, error } = await supabase
        .from("energy_transactions")
        .insert([
          {
            user_id: user.id,
            amount,
            rate,
            earnings,
            timestamp: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update local transactions state
      const newTransaction = {
        ...data,
        timestamp: new Date(data.timestamp),
      } as EnergyTransaction;

      setTransactions((prev) => [newTransaction, ...prev]);

      return { amount, earnings };
    } catch (error) {
      console.error("Error selling energy:", error);
    }
  };

  // Initialize data on mount and when user changes
  useEffect(() => {
    fetchDataFromSupabase(true);

    // Set up periodic refresh (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchDataFromSupabase();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [user]);

  // Manual refetch function
  const refetchData = async () => {
    await fetchDataFromSupabase(true);
  };

  return (
    <DataContext.Provider
      value={{
        devices,
        solarData,
        profile,
        transactions,
        updateDevice,
        updateDevicePriority,
        updateSolarData,
        updateProfile,
        addDevice,
        sellEnergy,
        isLoading,
        refetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Hook to use the data context
export function useDataProvider() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataProvider must be used within a DataProvider");
  }
  return context;
}
