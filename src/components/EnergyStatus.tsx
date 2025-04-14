
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowDown, ArrowUp, Zap, Sun } from 'lucide-react';

export const EnergyStatus = () => {
  const {
    devices,
    solarData,
    updateDevice,
    updateSolarData,
    activeDevicesPower,
    solarProduction,
    powerBalance,
    financials
  } = useEnergyData();

  const toggleDevice = (id: string, currentState: boolean) => {
    updateDevice.mutate({ id, is_on: !currentState });
  };

  const toggleSolar = () => {
    if (!solarData) return;
    updateSolarData.mutate({
      production_amount: solarData.production_amount,
      is_on: !solarData.is_on
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Energy Balance</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>Device Usage:</span>
            <span className="font-semibold">{activeDevicesPower}W</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Solar Production:</span>
            <span className="font-semibold">{solarProduction}W</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full mt-2">
            <div
              className={`h-full rounded-full transition-all ${
                powerBalance >= 0 ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{
                width: `${Math.min(
                  Math.abs(powerBalance) / Math.max(activeDevicesPower, solarProduction, 1) * 100,
                  100
                )}%`
              }}
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            {powerBalance > 0 ? (
              <div className="flex items-center text-green-300">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>Surplus: {powerBalance}W</span>
              </div>
            ) : (
              <div className="flex items-center text-red-300">
                <ArrowDown className="w-4 h-4 mr-1" />
                <span>Deficit: {Math.abs(powerBalance)}W</span>
              </div>
            )}
            
            <div className="text-sm font-medium">
              {powerBalance >= 0
                ? `+$${financials.earnings.toFixed(2)}/hr`
                : `-$${financials.costs.toFixed(2)}/hr`
              }
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <Sun className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Solar Production</p>
              <p className="text-sm text-gray-500">{solarProduction}W</p>
            </div>
          </div>
          <Switch
            checked={solarData?.is_on || false}
            onCheckedChange={toggleSolar}
          />
        </div>
        
        {devices.map((device) => (
          <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">{device.name}</p>
                <p className="text-sm text-gray-500">{device.power_usage}W</p>
              </div>
            </div>
            <Switch
              checked={device.is_on}
              onCheckedChange={() => toggleDevice(device.id, device.is_on)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
