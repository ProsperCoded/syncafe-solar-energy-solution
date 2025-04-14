
import React from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp } from 'lucide-react';
import { formatDistanceToNow, addHours } from 'date-fns';

export const EnergyForecast = () => {
  const { batteryStorage, activeDevicesPower, solarProduction, powerBalance } = useEnergyData();
  
  // Generate forecast data
  const generateForecastData = () => {
    const data = [];
    const hourlyConsumption = activeDevicesPower;
    const now = new Date();
    
    // Calculate how long the battery will last at current drain rate
    let remainingCapacity = batteryStorage.currentCapacity;
    let hourCounter = 0;
    
    // Generate 24 hour forecast
    for (let i = 0; i < 24; i++) {
      const hour = addHours(now, i);
      // Simple solar model - no production at night
      const hourOfDay = hour.getHours();
      const isDayTime = hourOfDay >= 6 && hourOfDay <= 18;
      
      // Simplified solar production model (peak at noon)
      let hourSolarProduction = 0;
      if (isDayTime) {
        const solarFactor = 1 - Math.abs((hourOfDay - 12) / 6);
        hourSolarProduction = solarData?.is_on ? Math.round(solarData.production_amount * solarFactor) : 0;
      }
      
      const hourBalance = hourSolarProduction - hourlyConsumption;
      
      // Update remaining capacity
      if (hourBalance < 0) {
        remainingCapacity = Math.max(0, remainingCapacity + hourBalance);
      } else {
        remainingCapacity = Math.min(batteryStorage.maxCapacity, remainingCapacity + (hourBalance * (profile?.battery_efficiency || 0.85)));
      }
      
      // Check if battery will run out in this hour
      if (remainingCapacity === 0 && hourCounter === 0 && hourBalance < 0) {
        hourCounter = i;
      }
      
      data.push({
        hour: hourOfDay,
        time: `${hourOfDay}:00`,
        solarProduction: hourSolarProduction,
        consumption: hourlyConsumption,
        batteryLevel: remainingCapacity
      });
    }
    
    return { data, batteryDepletion: hourCounter };
  };
  
  const { data: forecastData, batteryDepletion } = generateForecastData();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Energy Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="solarProduction" name="Solar Production (W)" stroke="#82ca9d" />
            <Line type="monotone" dataKey="consumption" name="Power Consumption (W)" stroke="#8884d8" />
            <Line type="monotone" dataKey="batteryLevel" name="Battery Level (W)" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
        
        {batteryDepletion > 0 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-md flex items-start">
            <Clock className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-700">Battery Depletion Forecast</p>
              <p className="text-sm text-amber-600">
                At current usage rates, your battery will deplete in approximately {batteryDepletion} hours
                {batteryDepletion < 24 && ` (around ${addHours(new Date(), batteryDepletion).toLocaleTimeString()})`}.
              </p>
            </div>
          </div>
        )}
        
        {powerBalance >= 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-md flex items-start">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-700">Energy Surplus</p>
              <p className="text-sm text-green-600">
                You're currently generating more power than you're using. Your battery is charging at {powerBalance}W.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
