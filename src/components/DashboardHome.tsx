
import React, { useState } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { DeviceForm } from '@/components/DeviceForm';
import { SolarForm } from '@/components/SolarForm';
import { EnergyStatus } from '@/components/EnergyStatus';
import { PowerChart } from '@/components/PowerChart';
import { DevicesList } from '@/components/DevicesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle } from 'lucide-react';
import { BatteryStorage } from '@/components/BatteryStorage';
import { RealTimeUsage } from '@/components/RealTimeUsage';
import { EnergyForecast } from '@/components/EnergyForecast';

export const DashboardHome = () => {
  const { 
    activeDevicesPower, 
    solarProduction, 
    powerBalance,
    financials,
    devices,
    batteryStorage
  } = useEnergyData();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Energy Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
          <div className={`px-3 py-1 rounded-full flex items-center ${
            powerBalance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <span className="text-sm font-medium">
              {powerBalance >= 0 ? 'Energy Surplus' : 'Energy Deficit'}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Device Power</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDevicesPower} W</div>
            <p className="text-xs text-gray-500">From {devices.filter(d => d.is_on).length} active devices</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Solar Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{solarProduction} W</div>
            <p className="text-xs text-gray-500">Current generation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Battery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batteryStorage.currentCapacity} W
            </div>
            <p className="text-xs text-gray-500">
              {Math.round((batteryStorage.currentCapacity / batteryStorage.maxCapacity) * 100)}% capacity
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Financial Impact</CardTitle>
          </CardHeader>
          <CardContent>
            {powerBalance >= 0 ? (
              <div className="text-2xl font-bold text-green-600">+${financials.earnings.toFixed(2)}</div>
            ) : (
              <div className="text-2xl font-bold text-red-600">-${financials.costs.toFixed(2)}</div>
            )}
            <p className="text-xs text-gray-500">Estimated hourly {powerBalance >= 0 ? 'earnings' : 'cost'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Energy Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <PowerChart />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="devices">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="devices">Add Device</TabsTrigger>
                  <TabsTrigger value="solar">Solar Production</TabsTrigger>
                </TabsList>
                <TabsContent value="devices">
                  <DeviceForm />
                </TabsContent>
                <TabsContent value="solar">
                  <SolarForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <BatteryStorage />
            <RealTimeUsage />
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Energy Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <EnergyForecast />
            </CardContent>
          </Card>
          
          <DevicesList />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Energy Status</CardTitle>
            </CardHeader>
            <CardContent>
              <EnergyStatus />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                Energy Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-800">Peak Hours Alert</p>
                <p className="text-blue-700">Consider scheduling high-consumption activities outside of 5-8 PM when grid rates are higher.</p>
              </div>
              <div className="text-sm bg-green-50 p-3 rounded-lg">
                <p className="font-medium text-green-800">Energy Saving Tip</p>
                <p className="text-green-700">Adjusting your thermostat by just 1°C can reduce energy consumption by up to 10%.</p>
              </div>
              <Button variant="outline" className="w-full mt-2">View All Tips</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
