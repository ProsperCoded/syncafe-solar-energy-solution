
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface Device {
  id: string;
  name: string;
  power_usage: number;
  is_on: boolean;
}

export interface SolarData {
  id: string;
  production_amount: number;
  is_on: boolean;
}

export interface Profile {
  grid_rate: number;
  sale_rate: number;
}

export const useEnergyData = () => {
  const queryClient = useQueryClient();

  const { data: devices = [] } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Device[];
    }
  });

  const { data: solarData } = useQuery({
    queryKey: ['solar_data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') return null;
      return data as SolarData;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('grid_rate, sale_rate')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    }
  });

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
    }
  });

  const updateDevice = useMutation({
    mutationFn: async ({ id, is_on }: Pick<Device, 'id' | 'is_on'>) => {
      const { error } = await supabase
        .from('devices')
        .update({ is_on })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    }
  });

  const updateSolarData = useMutation({
    mutationFn: async (data: Omit<SolarData, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('solar_data')
        .upsert([{ ...data, user_id: user.id }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solar_data'] });
      toast.success('Solar production updated');
    }
  });

  const updateProfile = useMutation({
    mutationFn: async (rates: Profile) => {
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
      toast.success('Rates updated successfully');
    }
  });

  // Calculate totals
  const activeDevicesPower = devices
    .filter(d => d.is_on)
    .reduce((sum, device) => sum + device.power_usage, 0);

  const solarProduction = (solarData?.is_on ? solarData.production_amount : 0) || 0;
  const powerBalance = solarProduction - activeDevicesPower;

  const financials = {
    earnings: powerBalance > 0 ? powerBalance * (profile?.sale_rate || 0.10) : 0,
    costs: powerBalance < 0 ? Math.abs(powerBalance) * (profile?.grid_rate || 0.15) : 0
  };

  return {
    devices,
    solarData,
    profile,
    addDevice,
    updateDevice,
    updateSolarData,
    updateProfile,
    activeDevicesPower,
    solarProduction,
    powerBalance,
    financials
  };
};
