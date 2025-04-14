
import React from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Battery, BatteryCharging, BatteryWarning } from 'lucide-react';

export const BatteryStorage = () => {
  const { batteryStorage } = useEnergyData();
  
  const percentFull = Math.min(
    Math.round((batteryStorage.currentCapacity / batteryStorage.maxCapacity) * 100),
    100
  );
  
  const getBatteryIcon = () => {
    if (percentFull < 10) {
      return <BatteryWarning className="h-8 w-8 text-red-500 animate-pulse" />;
    } else if (batteryStorage.isCharging) {
      return <BatteryCharging className="h-8 w-8 text-green-500" />;
    } else {
      return <Battery className="h-8 w-8 text-blue-500" />;
    }
  };
  
  const getBatteryColor = () => {
    if (percentFull < 10) return 'bg-red-500';
    if (percentFull < 30) return 'bg-orange-500';
    return 'bg-green-500';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-500">Battery Storage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          {getBatteryIcon()}
          <div className="ml-3">
            <div className="text-2xl font-bold">{batteryStorage.currentCapacity.toLocaleString()} W</div>
            <p className="text-xs text-gray-500">
              {batteryStorage.isCharging ? 'Charging' : 'Discharging'}
            </p>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>{percentFull}%</span>
            <span>{batteryStorage.maxCapacity.toLocaleString()} W max</span>
          </div>
          <Progress value={percentFull} className={`h-3 ${getBatteryColor()}`} />
        </div>
        
        {percentFull < 10 && (
          <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-sm">
            ⚠️ Battery storage critically low
          </div>
        )}
      </CardContent>
    </Card>
  );
};
