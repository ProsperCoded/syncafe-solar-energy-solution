
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnergyData } from '@/hooks/useEnergyData';
import { Sun } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="solarProduction">Solar Production (watts)</Label>
        <div className="relative">
          <Input
            id="solarProduction"
            type="number"
            value={production}
            onChange={(e) => setProduction(e.target.value)}
            placeholder="e.g., 5000"
            required
            min="0"
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Sun className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full">Update Solar Production</Button>
    </form>
  );
};
