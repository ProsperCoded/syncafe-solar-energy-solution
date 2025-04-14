
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnergyData } from '@/hooks/useEnergyData';

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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
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
        <Input
          id="powerUsage"
          type="number"
          value={powerUsage}
          onChange={(e) => setPowerUsage(e.target.value)}
          placeholder="e.g., 1000"
          required
          min="0"
        />
      </div>
      <Button type="submit" className="w-full">Add Device</Button>
    </form>
  );
};
