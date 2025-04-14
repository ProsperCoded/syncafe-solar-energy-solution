
import React from 'react';
import { SolarForm } from '@/components/SolarForm';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

export const SolarPage = () => {
  const { solarData, updateSolarData, solarProduction } = useEnergyData();

  const toggleSolar = () => {
    if (!solarData) return;
    
    updateSolarData.mutate({
      production_amount: solarData.production_amount,
      is_on: !solarData.is_on
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Solar Production</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Solar Production Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <SolarForm />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Solar Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  solarData?.is_on ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Sun className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Solar Panel System</h3>
                  <p className="text-sm text-gray-500">
                    {solarData?.is_on ? 'Currently active' : 'Currently inactive'}
                  </p>
                </div>
              </div>
              <Switch
                checked={solarData?.is_on || false}
                onCheckedChange={toggleSolar}
              />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">Simulate Weather Conditions</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center p-3 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
                  <Sun className="h-6 w-6 mb-1" />
                  <span className="text-xs">Sunny</span>
                </button>
                
                <button className="flex flex-col items-center p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                  <Cloud className="h-6 w-6 mb-1" />
                  <span className="text-xs">Partly Cloudy</span>
                </button>
                
                <button className="flex flex-col items-center p-3 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                  <CloudRain className="h-6 w-6 mb-1" />
                  <span className="text-xs">Rainy</span>
                </button>
                
                <button className="flex flex-col items-center p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <CloudLightning className="h-6 w-6 mb-1" />
                  <span className="text-xs">Stormy</span>
                </button>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium">Current Production: {solarProduction} W</h4>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${Math.min((solarProduction / 10000) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>0 W</span>
                  <span>5000 W</span>
                  <span>10000 W</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
