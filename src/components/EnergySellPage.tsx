
import React from 'react';
import { SellEnergy } from '@/components/SellEnergy';
import { EnergyTransactions } from '@/components/EnergyTransactions';
import { useEnergyData } from '@/hooks/useEnergyData';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { CircleDollarSign, TrendingUp, Clock, LineChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const EnergySellPage = () => {
  const { transactions, batteryStorage, profile } = useEnergyData();
  
  // Calculate total earnings
  const totalEarnings = transactions.reduce((sum, t) => sum + t.earnings, 0);
  
  // Group transactions by date for chart
  const groupTransactionsByDate = () => {
    const grouped = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          earnings: 0,
          amount: 0
        };
      }
      acc[date].earnings += transaction.earnings;
      acc[date].amount += transaction.amount;
      return acc;
    }, {} as Record<string, { date: string, earnings: number, amount: number }>);
    
    return Object.values(grouped);
  };
  
  const chartData = groupTransactionsByDate();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Energy Market</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Available Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batteryStorage.currentCapacity.toLocaleString()} W</div>
            <p className="text-xs text-gray-500">Available to sell</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Current Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.currencySymbol || '$'}{profile?.sale_rate || 0.10}/kWh</div>
            <p className="text-xs text-gray-500">Sale price</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {profile?.currencySymbol || '$'}{totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <SellEnergy />
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5" />
                Earnings History
              </CardTitle>
              <CardDescription>Your energy sales over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                    <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="amount" name="Energy Sold (W)" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="earnings" name={`Earnings (${profile?.currencySymbol || '$'})`} fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No sales history</h3>
                  <p className="mt-1 text-sm text-gray-500">Start selling your excess energy to see data here</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <EnergyTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};
