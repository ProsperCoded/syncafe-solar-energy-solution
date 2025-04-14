
import React from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Tv, Cpu, Fan, Smartphone, Coffee, Lamp, Refrigerator, Wifi, Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Map device names to appropriate icons
const getDeviceIcon = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('tv')) return <Tv />;
  if (nameLower.includes('computer') || nameLower.includes('pc')) return <Cpu />;
  if (nameLower.includes('fan') || nameLower.includes('air')) return <Fan />;
  if (nameLower.includes('phone')) return <Smartphone />;
  if (nameLower.includes('coffee')) return <Coffee />;
  if (nameLower.includes('light') || nameLower.includes('lamp')) return <Lamp />;
  if (nameLower.includes('fridge') || nameLower.includes('refrigerator')) return <Refrigerator />;
  if (nameLower.includes('router') || nameLower.includes('wifi')) return <Wifi />;
  return <Zap />;
};

// Helper function to determine power consumption level
const getPowerLevel = (watts: number) => {
  if (watts > 1000) return { label: 'High', color: 'bg-red-100 text-red-800' };
  if (watts > 500) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
  return { label: 'Low', color: 'bg-green-100 text-green-800' };
};

export const DevicesList = () => {
  const { devices, updateDevice } = useEnergyData();

  const handleToggleDevice = (id: string, currentState: boolean) => {
    updateDevice.mutate({ id, is_on: !currentState });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Devices</CardTitle>
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Zap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No devices</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a device.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Power Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Toggle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => {
                const powerLevel = getPowerLevel(device.power_usage);
                
                return (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-gray-100 p-2 mr-3 text-gray-600">
                          {getDeviceIcon(device.name)}
                        </div>
                        <span className="font-medium">{device.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Badge variant="outline" className={powerLevel.color + ' mr-2'}>
                          {powerLevel.label}
                        </Badge>
                        <span>{device.power_usage} W</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={device.is_on ? 'bg-green-500' : 'bg-gray-500'}>
                        {device.is_on ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={device.is_on}
                        onCheckedChange={() => handleToggleDevice(device.id, device.is_on)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
