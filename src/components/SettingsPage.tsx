
import React, { useState } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { DollarSign, Sun, Zap, Bell, User, Shield, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const SettingsPage = () => {
  const { profile, updateProfile } = useEnergyData();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      gridRate: profile?.grid_rate || 0.15,
      saleRate: profile?.sale_rate || 0.10,
    },
  });
  
  React.useEffect(() => {
    if (profile) {
      form.reset({
        gridRate: profile.grid_rate,
        saleRate: profile.sale_rate,
      });
    }
  }, [profile, form]);
  
  const onSubmit = (data: { gridRate: number; saleRate: number }) => {
    updateProfile.mutate({
      grid_rate: Number(data.gridRate),
      sale_rate: Number(data.saleRate),
    });
  };

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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <Tabs defaultValue="rates" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mb-6">
          <TabsTrigger value="rates" className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" /> Rates
          </TabsTrigger>
          <TabsTrigger value="solar" className="flex items-center">
            <Sun className="w-4 h-4 mr-2" /> Solar
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center">
            <Zap className="w-4 h-4 mr-2" /> Devices
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center">
            <User className="w-4 h-4 mr-2" /> Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Energy Rate Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="gridRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grid Rate ($ per kWh)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0.01" 
                              className="pl-10"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="saleRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Rate ($ per kWh)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0.01" 
                              className="pl-10"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Rate Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="solar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solar Panel Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-Detect Weather</h3>
                    <p className="text-sm text-gray-500">Adjust solar production based on local weather</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Panel Health Monitoring</h3>
                    <p className="text-sm text-gray-500">Get notifications about panel performance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="pt-4">
                  <Label htmlFor="panelCount">Number of Solar Panels</Label>
                  <Input id="panelCount" type="number" defaultValue="12" className="mt-1" />
                </div>
                
                <div className="pt-4">
                  <Label htmlFor="panelWattage">Panel Wattage (W)</Label>
                  <Input id="panelWattage" type="number" defaultValue="320" className="mt-1" />
                </div>
                
                <Button>Save Solar Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto Power Management</h3>
                    <p className="text-sm text-gray-500">Automatically manage device power based on solar production</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Smart Scheduling</h3>
                    <p className="text-sm text-gray-500">Schedule devices to run during peak solar hours</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Device Health Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified about unusual power consumption</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button>Save Device Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive energy reports via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Power Saving Tips</h3>
                    <p className="text-sm text-gray-500">Receive tips to optimize your energy usage</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified about critical issues</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="pt-4">
                  <Label htmlFor="emailAddress">Notification Email</Label>
                  <Input id="emailAddress" type="email" placeholder="your@email.com" className="mt-1" />
                </div>
                
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="pt-4">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" className="mt-1" />
                </div>
                
                <div className="pt-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" className="mt-1" />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-gray-500">Use dark theme for the application</p>
                  </div>
                  <Switch 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <Button>Update Account</Button>
                
                <hr className="my-6" />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-gray-500" />
                      Security
                    </h3>
                    <Button variant="outline" className="mt-2">Change Password</Button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium flex items-center text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </h3>
                    <Button 
                      variant="destructive" 
                      className="mt-2"
                      onClick={handleLogout}
                    >
                      Log Out from All Devices
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
