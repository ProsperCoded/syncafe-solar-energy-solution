
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";

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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Energy Dashboard</h1>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p>Welcome to your Solar Energy Dashboard! More features coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
