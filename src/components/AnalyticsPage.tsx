
import React from 'react';
import { PowerChart } from '@/components/PowerChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const AnalyticsPage = () => {
  const { activeDevicesPower, solarProduction, powerBalance, financials } = useEnergyData();

  // Mock data for additional charts
  const mockDailyData = [
    { name: 'Mon', usage: 2400, production: 1800 },
    { name: 'Tue', usage: 3000, production: 2800 },
    { name: 'Wed', usage: 2000, production: 2500 },
    { name: 'Thu', usage: 2780, production: 2200 },
    { name: 'Fri', usage: 1890, production: 2100 },
    { name: 'Sat', usage: 2390, production: 2700 },
    { name: 'Sun', usage: 3490, production: 3200 },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Power Analytics</h1>
        <Button variant="outline" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Active Power</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDevicesPower} W</div>
            <p className="text-xs text-gray-500">Current consumption</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Solar Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{solarProduction} W</div>
            <p className="text-xs text-gray-500">Current generation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Projected Monthly Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${powerBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {powerBalance >= 0 
                ? `$${(financials.earnings * 24 * 30).toFixed(2)}` 
                : `-$${(financials.costs * 24 * 30).toFixed(2)}`}
            </div>
            <p className="text-xs text-gray-500">Based on current status</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Carbon Offset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(solarProduction * 24 * 30 * 0.0005).toFixed(1)} kg
            </div>
            <p className="text-xs text-gray-500">Monthly CO₂ reduction</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Balance Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <PowerChart />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Efficiency Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-green-500 stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2.5 * Math.PI * 40}`}
                    strokeDashoffset={`${2.5 * Math.PI * 40 * (1 - 0.82)}`}
                    transform="rotate(-90 50 50)"
                  ></circle>
                  <text x="50" y="50" fontFamily="sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle" alignmentBaseline="central">
                    82%
                  </text>
                </svg>
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="font-medium">Your energy efficiency rating is excellent!</h3>
              <p className="text-sm text-gray-500 mt-1">
                You're in the top 15% of households in your area
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Usage Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800">Optimal Solar Usage</h4>
                <p className="text-sm text-blue-700">Run high-consumption devices between 10 AM and 2 PM to maximize solar utilization.</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-green-800">Cost Savings</h4>
                <p className="text-sm text-green-700">Increase your solar production by 10% to reach net-zero energy consumption.</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="font-medium text-purple-800">Device Optimization</h4>
                <p className="text-sm text-purple-700">Consider replacing your refrigerator for potential savings of $120/year.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
