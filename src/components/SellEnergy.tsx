
import { useState } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleDollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export const SellEnergy = () => {
  const [sellAmount, setSellAmount] = useState('');
  const { batteryStorage, sellEnergy, profile } = useEnergyData();

  const handleSell = () => {
    const amount = parseInt(sellAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount to sell");
      return;
    }

    if (amount > batteryStorage.currentCapacity) {
      toast.error("You don't have enough stored energy to sell");
      return;
    }

    sellEnergy.mutate({ amount });
    setSellAmount('');
  };

  const calculateEarnings = () => {
    const amount = parseInt(sellAmount, 10);
    if (isNaN(amount)) return 0;
    
    return amount * (profile?.sale_rate || 0.10) / 1000; // Convert to kWh
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CircleDollarSign className="mr-2 h-5 w-5 text-green-500" />
          Sell Energy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="sellAmount">Energy to sell (watts)</Label>
          <div className="relative">
            <Input
              id="sellAmount"
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              placeholder="Enter watts to sell"
              min="0"
              max={batteryStorage.currentCapacity}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {parseInt(sellAmount, 10) > batteryStorage.currentCapacity && (
            <div className="mt-1 text-sm flex items-center text-red-500">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>Amount exceeds available storage ({batteryStorage.currentCapacity}W)</span>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <div className="flex justify-between text-sm">
            <span>Current stored energy:</span>
            <span className="font-medium">{batteryStorage.currentCapacity}W</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Selling price:</span>
            <span className="font-medium">{profile?.sale_rate || 0.10} per kWh</span>
          </div>
          <div className="flex justify-between text-sm mt-1 text-green-600">
            <span>Estimated earnings:</span>
            <span className="font-bold">{profile?.currencySymbol || '$'}{calculateEarnings().toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleSell} 
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!sellAmount || parseInt(sellAmount, 10) <= 0 || parseInt(sellAmount, 10) > batteryStorage.currentCapacity}
        >
          Sell Energy Now
        </Button>
      </CardContent>
    </Card>
  );
};
