
import React, { useState } from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';

export const PowerChart = () => {
  const { devices, activeDevicesPower, solarProduction } = useEnergyData();
  const [timeRange, setTimeRange] = useState('day');

  // Generate mock data based on current values
  const generateTimeSeriesData = () => {
    const hours = timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : 30;
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < hours; i++) {
      const time = new Date(now);
      time.setHours(now.getHours() - (hours - i));
      
      // Simulate fluctuations in power usage and solar production
      const randomFactor = 0.8 + Math.random() * 0.4;  // 80% to 120%
      const solarFactor = timeRange === 'day' 
        ? Math.sin((i / 24) * Math.PI) * 0.8 + 0.2  // Day cycle, peak at noon
        : 0.7 + Math.random() * 0.5;  // Week/month
      
      data.push({
        time: timeRange === 'day' 
          ? time.getHours() + ':00' 
          : timeRange === 'week'
            ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][time.getDay()]
            : time.getDate(),
        powerUsage: Math.round(activeDevicesPower * randomFactor),
        solarProduction: Math.round(solarProduction * solarFactor * randomFactor),
      });
    }
    
    return data;
  };

  // Prepare pie chart data for device power distribution
  const deviceData = devices.map(device => ({
    name: device.name,
    value: device.is_on ? device.power_usage : 0,
  })).filter(item => item.value > 0);

  // Colors for pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="line" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="line" className="flex items-center">
              <LineChartIcon className="w-4 h-4 mr-2" />
              Line
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Bar
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center">
              <PieChartIcon className="w-4 h-4 mr-2" />
              Devices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="line" className="mt-4">
            <ChartContainer config={{ line1: { color: '#8884d8' }, line2: { color: '#82ca9d' } }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateTimeSeriesData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="powerUsage" name="Power Usage (W)" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="solarProduction" name="Solar Production (W)" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="bar" className="mt-4">
            <ChartContainer config={{ bar1: { color: '#8884d8' }, bar2: { color: '#82ca9d' } }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={generateTimeSeriesData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="powerUsage" name="Power Usage (W)" fill="#8884d8" />
                  <Bar dataKey="solarProduction" name="Solar Production (W)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="pie" className="mt-4">
            <div className="text-center mb-2 text-sm text-gray-500">Device Power Distribution</div>
            <ChartContainer config={{ pie: { color: '#8884d8' } }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData.length > 0 ? deviceData : [{ name: 'No active devices', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
        
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === 'day' ? 'default' : 'outline'}
            onClick={() => setTimeRange('day')}
            size="sm"
          >
            Day
          </Button>
          <Button 
            variant={timeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeRange('week')}
            size="sm"
          >
            Week
          </Button>
          <Button 
            variant={timeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeRange('month')}
            size="sm"
          >
            Month
          </Button>
        </div>
      </div>
    </div>
  );
};
