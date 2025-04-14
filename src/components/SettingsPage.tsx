
import React, { useState } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { DollarSign, Sun, Zap, Bell, User, Shield, LogOut, Battery, Globe, Cog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { DevicePrioritization } from '@/components/DevicePrioritization';

export const SettingsPage = () => {
  const { profile, updateProfile, batteryStorage } = useEnergyData();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      gridRate: profile?.grid_rate || 0.15,
      saleRate: profile?.sale_rate || 0.10,
      batteryEfficiency: profile?.battery_efficiency || 0.85,
      currency: profile?.currency || 'USD',
    },
  });
  
  React.useEffect(() => {
    if (profile) {
      form.reset({
        gridRate: profile.grid_rate,
        saleRate: profile.sale_rate,
        batteryEfficiency: profile.battery_efficiency || 0.85,
        currency: profile.currency || 'USD',
      });
    }
  }, [profile, form]);
  
  const onSubmit = (data: any) => {
    updateProfile.mutate({
      grid_rate: Number(data.gridRate),
      sale_rate: Number(data.saleRate),
      battery_efficiency: Number(data.batteryEfficiency),
      currency: data.currency,
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
        <TabsList className="grid grid-cols-6 w-full max-w-3xl mb-6">
          <TabsTrigger value="rates" className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" /> Rates
          </TabsTrigger>
          <TabsTrigger value="battery" className="flex items-center">
            <Battery className="w-4 h-4 mr-2" /> Battery
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
                  
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="NGN">NGN (₦)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Rate Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="battery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Battery Storage Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Current Battery Status</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Capacity:</span>
                      <span className="font-medium">{batteryStorage.currentCapacity.toLocaleString()} W</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maximum Capacity:</span>
                      <span className="font-medium">{batteryStorage.maxCapacity.toLocaleString()} W</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Charging Status:</span>
                      <span className={batteryStorage.isCharging ? "text-green-600 font-medium" : "text-gray-600"}>
                        {batteryStorage.isCharging ? "Charging" : "Not Charging"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Charge Level:</span>
                      <span className="font-medium">
                        {Math.round((batteryStorage.currentCapacity / batteryStorage.maxCapacity) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="batteryEfficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Battery Efficiency (0-1)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Battery className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0.01" 
                            max="1" 
                            className="pl-10"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Label htmlFor="maxCapacity">Maximum Battery Capacity (W)</Label>
                  <Input 
                    id="maxCapacity" 
                    type="number" 
                    defaultValue={batteryStorage.maxCapacity} 
                    className="mt-1" 
                  />
                </div>
                
                <Button onClick={form.handleSubmit(onSubmit)}>Save Battery Settings</Button>
                
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <h3 className="font-medium">Auto Power Management</h3>
                    <p className="text-sm text-gray-500">Prioritize devices when battery is low</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
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
          <DevicePrioritization />
          
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
                    <h3 className="font-medium">Low Battery Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified when battery storage is low</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Energy Transaction Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified about energy sales</p>
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
