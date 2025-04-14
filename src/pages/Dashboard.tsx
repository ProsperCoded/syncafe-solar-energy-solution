
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { DeviceForm } from '@/components/DeviceForm';
import { SolarForm } from '@/components/SolarForm';
import { EnergyStatus } from '@/components/EnergyStatus';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error('Logout failed', { description: error.message });
    } else {
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Energy Dashboard</h1>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DeviceForm />
          <SolarForm />
        </div>

        <EnergyStatus />
      </div>
    </div>
  );
};

export default Dashboard;
