
import React from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash, Info } from 'lucide-react';

export const DevicePrioritization = () => {
  const { devices, updateDevicePriorities } = useEnergyData();

  const handleDragEnd = (result: any) => {
    // Drop outside of droppable area
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    // If dropped in the same position
    if (sourceIndex === destinationIndex) {
      return;
    }

    updateDevicePriorities.mutate({
      deviceId: result.draggableId,
      newPriority: destinationIndex
    });
  };

  // Sort devices by priority
  const sortedDevices = [...devices].sort((a, b) => 
    (a.priority || Number.MAX_SAFE_INTEGER) - (b.priority || Number.MAX_SAFE_INTEGER)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Device Priority
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4 flex items-center bg-blue-50 p-3 rounded-lg">
          <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
          <p>Drag and drop devices to set priority. Higher items turn off first when battery is low.</p>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="device-priority-list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {sortedDevices.map((device, index) => (
                  <Draggable key={device.id} draggableId={device.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center justify-between p-3 bg-white border rounded-lg"
                      >
                        <div className="flex items-center">
                          <div {...provided.dragHandleProps} className="mr-3 cursor-grab">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-xs text-gray-500">{device.power_usage}W</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Priority: {index + 1}</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {devices.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p>No devices to prioritize. Add devices first.</p>
          </div>
        )}
        
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            Apply Priority Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
