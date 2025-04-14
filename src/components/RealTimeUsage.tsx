
import React from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowDown, ArrowUp, Battery, Zap, Sun } from 'lucide-react';

export const RealTimeUsage = () => {
  const { 
    batteryStorage,
    activeDevicesPower,
    solarProduction,
    powerBalance,
    devices,
    profile
  } = useEnergyData();

  const maxValue = Math.max(activeDevicesPower, solarProduction, 100);
  
  // Calculate energy flow percentages for visualization
  const deviceUsagePercent = (activeDevicesPower / maxValue) * 100;
  const solarProductionPercent = (solarProduction / maxValue) * 100;
  const batteryPercent = (batteryStorage.currentCapacity / batteryStorage.maxCapacity) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Real-time Energy Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Solar Production */}
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <Sun className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">Solar Panel</span>
              </div>
              <span className="text-sm font-medium">{solarProduction}W</span>
            </div>
            <Progress value={solarProductionPercent} className="h-2 bg-gray-100" />
          </div>
          
          {/* Battery Storage */}
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <Battery className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm font-medium">Battery Storage</span>
              </div>
              <span className="text-sm font-medium">
                {batteryStorage.currentCapacity}W ({batteryPercent.toFixed(0)}%)
              </span>
            </div>
            <Progress 
              value={batteryPercent} 
              className={`h-2 ${
                batteryPercent < 20 ? 'bg-red-100' : 'bg-gray-100'
              }`} 
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0W</span>
              <span>{batteryStorage.maxCapacity}W</span>
            </div>
          </div>
          
          {/* Device Usage */}
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm font-medium">Device Usage</span>
              </div>
              <span className="text-sm font-medium">{activeDevicesPower}W</span>
            </div>
            <Progress value={deviceUsagePercent} className="h-2 bg-gray-100" />
            <div className="text-xs text-gray-500 mt-1">
              {devices.filter(d => d.is_on).length} active devices
            </div>
          </div>
          
          {/* Power Balance Indicator */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Power Balance</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {powerBalance >= 0 ? (
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-5 w-5 mr-1" />
                    <span className="font-medium">Surplus</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <ArrowDown className="h-5 w-5 mr-1" />
                    <span className="font-medium">Deficit</span>
                  </div>
                )}
              </div>
              <span className={`text-lg font-bold ${
                powerBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {powerBalance >= 0 ? '+' : ''}{powerBalance}W
              </span>
            </div>
            <div className="h-2 bg-white/50 rounded-full mt-2">
              <div
                className={`h-full rounded-full transition-all ${
                  powerBalance >= 0 ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{
                  width: `${Math.min(
                    Math.abs(powerBalance) / maxValue * 100,
                    100
                  )}%`
                }}
              />
            </div>
            <div className="mt-2 text-sm">
              {powerBalance >= 0 ? (
                <div className="text-green-700">
                  Earning {profile?.currencySymbol || '$'}{((powerBalance * (profile?.sale_rate || 0.10)) / 1000).toFixed(3)}/hr
                </div>
              ) : (
                <div className="text-red-700">
                  Costing {profile?.currencySymbol || '$'}{((Math.abs(powerBalance) * (profile?.grid_rate || 0.15)) / 1000).toFixed(3)}/hr
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
