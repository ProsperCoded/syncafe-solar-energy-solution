import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { BatteryStorage, EnergyTransaction, EnergyNotification, Profile } from '@/types/energy';

export interface Device {
  id: string;
  name: string;
  power_usage: number;
  is_on: boolean;
  priority?: number;
}

export interface SolarData {
  id: string;
  production_amount: number;
  is_on: boolean;
}

export const useEnergyData = () => {
  const queryClient = useQueryClient();
  const [batteryStorage, setBatteryStorage] = useState<BatteryStorage & { isCharging: boolean }>({
    currentCapacity: 0,
    maxCapacity: 10000,
    efficiency: 0.85,
    lastUpdated: new Date(),
    isCharging: false
  });

  // Get devices
  const { data: devices = [] } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as Device[];
    }
  });

  // Get solar data
  const { data: solarData } = useQuery({
    queryKey: ['solar_data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('solar_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') return null;
      return data as SolarData;
    }
  });

  // Get profile (including energy rates)
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    }
  });

  // Get energy transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('energy_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data as unknown as EnergyTransaction[];
    }
  });

  // Get notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data as unknown as EnergyNotification[];
    }
  });

  // Add device mutation
  const addDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id' | 'is_on'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('devices')
        .insert([{ ...device, is_on: false, user_id: user.id }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device added successfully');
      addNotification.mutate({
        type: 'success',
        title: 'Device Added',
        message: 'New device added to your system.'
      });
    }
  });

  // Update device mutation
  const updateDevice = useMutation({
    mutationFn: async ({ id, is_on }: Pick<Device, 'id' | 'is_on'>) => {
      const { error } = await supabase
        .from('devices')
        .update({ is_on })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      const device = devices.find(d => d.id === variables.id);
      addNotification.mutate({
        type: 'info',
        title: 'Device Status Updated',
        message: `${device?.name || 'Device'} turned ${variables.is_on ? 'ON' : 'OFF'}.`
      });
    }
  });

  // Update device priorities
  const updateDevicePriorities = useMutation({
    mutationFn: async ({ deviceId, newPriority }: { deviceId: string, newPriority: number }) => {
      const { error } = await supabase
        .from('devices')
        .update({ priority: newPriority })
        .eq('id', deviceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device priorities updated');
    }
  });

  // Update solar data mutation
  const updateSolarData = useMutation({
    mutationFn: async (data: Omit<SolarData, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('solar_data')
        .upsert([{ ...data, user_id: user.id }]);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['solar_data'] });
      toast.success('Solar production updated');
      addNotification.mutate({
        type: 'info',
        title: 'Solar Status Updated',
        message: `Solar production ${variables.is_on ? 'started' : 'stopped'}.`
      });
    }
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (rates: Partial<Profile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update(rates)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Settings updated successfully');
      addNotification.mutate({
        type: 'success',
        title: 'Settings Updated',
        message: 'Your energy settings have been updated.'
      });
    }
  });

  // Sell energy mutation
  const sellEnergy = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      if (amount > batteryStorage.currentCapacity) {
        throw new Error("Not enough energy stored");
      }
      
      // Calculate earnings based on sale rate
      const rate = profile?.sale_rate || 0.10;
      const earnings = (amount * rate) / 1000; // Convert watts to kWh
      
      const { error } = await supabase
        .from('energy_transactions')
        .insert([{
          user_id: user.id,
          amount,
          rate,
          earnings,
          timestamp: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      // Update battery storage
      setBatteryStorage(prev => ({
        ...prev,
        currentCapacity: Math.max(0, prev.currentCapacity - amount)
      }));
      
      return { amount, earnings };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success(`Successfully sold ${data.amount}W for ${profile?.currency_symbol || '$'}${data.earnings.toFixed(2)}`);
      addNotification.mutate({
        type: 'success',
        title: 'Energy Sold',
        message: `Sold ${data.amount}W for ${profile?.currency_symbol || '$'}${data.earnings.toFixed(2)}`
      });
    }
  });

  // Add notification mutation
  const addNotification = useMutation({
    mutationFn: async (notification: Omit<EnergyNotification, 'id' | 'userId' | 'timestamp' | 'read'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          ...notification,
          timestamp: new Date().toISOString(),
          read: false
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mark notification as read
  const markNotificationRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Battery simulation logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBatteryStorage(prev => {
        const now = new Date();
        const secondsElapsed = (now.getTime() - prev.lastUpdated.getTime()) / 1000;
        
        // Only update if at least 1 second has passed
        if (secondsElapsed < 1) return prev;
        
        // Calculate power balance (watts)
        const activeDevicesPower = devices
          .filter(d => d.is_on)
          .reduce((sum, device) => sum + device.power_usage, 0);
          
        const solarProduction = (solarData?.is_on ? solarData.production_amount : 0) || 0;
        const powerBalance = solarProduction - activeDevicesPower;
        
        let newCapacity = prev.currentCapacity;
        let isCharging = false;
        
        // If producing more than using, add to battery with efficiency loss
        if (powerBalance > 0) {
          // energy gained per second = watts * seconds * efficiency
          const energyGained = powerBalance * secondsElapsed * (profile?.battery_efficiency || prev.efficiency);
          newCapacity = Math.min(prev.maxCapacity, prev.currentCapacity + energyGained);
          isCharging = true;
          
          // If battery was previously depleted and now charging, create notification
          if (prev.currentCapacity <= 0 && newCapacity > 0) {
            addNotification.mutate({
              type: 'info',
              title: 'Battery Charging',
              message: 'Your battery storage is now charging.'
            });
          }
          
          // If battery is fully charged, create notification
          if (prev.currentCapacity < prev.maxCapacity && newCapacity >= prev.maxCapacity) {
            addNotification.mutate({
              type: 'success',
              title: 'Battery Full',
              message: 'Your battery storage is now fully charged!'
            });
          }
        } 
        // If using more than producing, drain the battery
        else if (powerBalance < 0) {
          // energy used per second = watts * seconds
          const energyUsed = Math.abs(powerBalance) * secondsElapsed;
          newCapacity = Math.max(0, prev.currentCapacity - energyUsed);
          
          // If battery gets low, create notification
          if (prev.currentCapacity > prev.maxCapacity * 0.1 && newCapacity <= prev.maxCapacity * 0.1) {
            addNotification.mutate({
              type: 'warning',
              title: 'Battery Low',
              message: 'Your battery storage is below 10%. Consider turning off devices.'
            });
          }
          
          // If battery is completely drained, create notification
          if (prev.currentCapacity > 0 && newCapacity <= 0) {
            addNotification.mutate({
              type: 'error',
              title: 'Battery Depleted',
              message: 'Your battery storage is now empty!'
            });
          }
        }
        
        return {
          ...prev,
          currentCapacity: newCapacity,
          lastUpdated: now,
          isCharging
        };
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [devices, solarData, profile]);

  // Calculate totals
  const activeDevicesPower = devices
    .filter(d => d.is_on)
    .reduce((sum, device) => sum + device.power_usage, 0);

  const solarProduction = (solarData?.is_on ? solarData.production_amount : 0) || 0;
  const powerBalance = solarProduction - activeDevicesPower;

  const financials = {
    earnings: powerBalance > 0 ? powerBalance * (profile?.sale_rate || 0.10) / 1000 : 0,
    costs: powerBalance < 0 ? Math.abs(powerBalance) * (profile?.grid_rate || 0.15) / 1000 : 0
  };

  return {
    devices,
    solarData,
    profile,
    batteryStorage,
    addDevice,
    updateDevice,
    updateSolarData,
    updateProfile,
    updateDevicePriorities,
    sellEnergy,
    transactions,
    notifications,
    markNotificationRead,
    activeDevicesPower,
    solarProduction,
    powerBalance,
    financials
  };
};
