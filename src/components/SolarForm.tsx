
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnergyData } from '@/hooks/useEnergyData';

export const SolarForm = () => {
  const [production, setProduction] = useState('');
  const { updateSolarData } = useEnergyData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!production) return;

    updateSolarData.mutate({
      production_amount: parseInt(production, 10),
      is_on: true
    });

    setProduction('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
      <div>
        <Label htmlFor="solarProduction">Solar Production (watts)</Label>
        <Input
          id="solarProduction"
          type="number"
          value={production}
          onChange={(e) => setProduction(e.target.value)}
          placeholder="e.g., 5000"
          required
          min="0"
        />
      </div>
      <Button type="submit" className="w-full">Update Solar Production</Button>
    </form>
  );
};
