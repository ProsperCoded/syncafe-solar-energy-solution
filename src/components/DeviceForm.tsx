
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnergyData } from '@/hooks/useEnergyData';
import { Zap } from 'lucide-react';

export const DeviceForm = () => {
  const [name, setName] = useState('');
  const [powerUsage, setPowerUsage] = useState('');
  const { addDevice } = useEnergyData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !powerUsage) return;

    addDevice.mutate({
      name,
      power_usage: parseInt(powerUsage, 10)
    });

    setName('');
    setPowerUsage('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="deviceName">Device Name</Label>
        <Input
          id="deviceName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Air Conditioner"
          required
        />
      </div>
      <div>
        <Label htmlFor="powerUsage">Power Usage (watts)</Label>
        <div className="relative">
          <Input
            id="powerUsage"
            type="number"
            value={powerUsage}
            onChange={(e) => setPowerUsage(e.target.value)}
            placeholder="e.g., 1000"
            required
            min="0"
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Zap className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full">Add Device</Button>
    </form>
  );
};
