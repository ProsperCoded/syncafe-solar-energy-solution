
import React from 'react';
import { DeviceForm } from '@/components/DeviceForm';
import { DevicesList } from '@/components/DevicesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DevicesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Devices Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Device</CardTitle>
            </CardHeader>
            <CardContent>
              <DeviceForm />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <DevicesList />
        </div>
      </div>
    </div>
  );
};
