
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

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
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Solar Production</h3>
        <div className="flex items-center justify-between mb-2">
          <span>Current Production: {solarProduction}W</span>
          <Switch
            checked={solarData?.is_on || false}
            onCheckedChange={toggleSolar}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Devices</h3>
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{device.name}</p>
                <p className="text-sm text-gray-500">{device.power_usage}W</p>
              </div>
              <Switch
                checked={device.is_on}
                onCheckedChange={() => toggleDevice(device.id, device.is_on)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-600 to-blue-500 text-white">
        <h3 className="text-lg font-semibold mb-4">Power Balance</h3>
        <div className="space-y-2">
          <p>Total Device Usage: {activeDevicesPower}W</p>
          <p>Solar Production: {solarProduction}W</p>
          <div className="h-2 bg-white/20 rounded-full mt-2">
            <div
              className={`h-full rounded-full transition-all ${
                powerBalance >= 0 ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{
                width: `${Math.min(
                  Math.abs(powerBalance) / Math.max(activeDevicesPower, solarProduction) * 100,
                  100
                )}%`
              }}
            />
          </div>
          {powerBalance > 0 ? (
            <p className="text-green-300">Power Saved: {powerBalance}W (${financials.earnings.toFixed(2)})</p>
          ) : (
            <p className="text-red-300">Power Deficit: {Math.abs(powerBalance)}W (${financials.costs.toFixed(2)})</p>
          )}
        </div>
      </Card>
    </div>
  );
};
