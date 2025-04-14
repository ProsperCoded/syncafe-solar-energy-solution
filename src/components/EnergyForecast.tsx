import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Battery, Clock, BatteryCharging } from 'lucide-react';

export const EnergyForecast = () => {
  const { batteryStorage, activeDevicesPower, solarProduction, profile } = useEnergyData();

  // Calculate how long the battery will last at current usage rate
  const calculateRemainingTime = () => {
    // If no power usage or battery is charging, return "Infinite"
    if (activeDevicesPower <= 0 || solarProduction > activeDevicesPower) {
      return "∞";
    }

    // Calculate hours remaining based on current battery capacity and power usage
    const hoursRemaining = batteryStorage.currentCapacity / activeDevicesPower;
    
    if (hoursRemaining < 1) {
      const minutesRemaining = Math.round(hoursRemaining * 60);
      return `${minutesRemaining} minute${minutesRemaining === 1 ? '' : 's'}`;
    } else {
      const hrs = Math.floor(hoursRemaining);
      const mins = Math.round((hoursRemaining - hrs) * 60);
      return `${hrs} hour${hrs === 1 ? '' : 's'}${mins > 0 ? ` ${mins} min` : ''}`;
    }
  };

  // Predict when battery will be fully charged
  const calculateChargingTime = () => {
    if (!batteryStorage.isCharging) return null;
    
    const powerSurplus = Math.max(0, solarProduction - activeDevicesPower);
    if (powerSurplus <= 0) return null;

    const remainingCapacity = batteryStorage.maxCapacity - batteryStorage.currentCapacity;
    // Factor in battery charging efficiency
    const hoursToCharge = remainingCapacity / (powerSurplus * (profile?.battery_efficiency || 0.85));
    
    if (hoursToCharge < 1) {
      const minutesToCharge = Math.round(hoursToCharge * 60);
      return `${minutesToCharge} minute${minutesToCharge === 1 ? '' : 's'}`;
    } else {
      const hrs = Math.floor(hoursToCharge);
      const mins = Math.round((hoursToCharge - hrs) * 60);
      return `${hrs} hour${hrs === 1 ? '' : 's'}${mins > 0 ? ` ${mins} min` : ''}`;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-500">Energy Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {batteryStorage.isCharging ? (
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <BatteryCharging className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Charging Battery</h3>
                {calculateChargingTime() ? (
                  <p className="text-sm text-gray-500">
                    Full in ~{calculateChargingTime()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Charging slowly</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Battery className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Battery Discharging</h3>
                <p className="text-sm text-gray-500">
                  Remaining time: ~{calculateRemainingTime()}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium">Peak Hours</h3>
              <p className="text-sm text-gray-500">
                Best sell time: 10:00 AM - 2:00 PM
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
