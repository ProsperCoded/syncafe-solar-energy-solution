import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Battery, BatteryCharging, BatteryWarning } from "lucide-react";
import { useBatteryStorage } from "@/hooks/useBatteryStorage";

export const BatteryStorage = () => {
  const { batteryStorage } = useBatteryStorage();

  const percentFull = Math.min(
    Math.round(
      (batteryStorage.currentCapacity / batteryStorage.maxCapacity) * 100
    ),
    100
  );

  const getBatteryIcon = () => {
    if (percentFull < 10) {
      return <BatteryWarning className="w-8 h-8 text-red-500 animate-pulse" />;
    } else if (batteryStorage.isCharging) {
      return <BatteryCharging className="w-8 h-8 text-green-500" />;
    } else {
      return <Battery className="w-8 h-8 text-blue-500" />;
    }
  };

  const getBatteryColor = () => {
    if (percentFull < 10) return "bg-red-500";
    if (percentFull < 30) return "bg-orange-500";
    if (batteryStorage.isCharging) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          {getBatteryIcon()}
          <span className="ml-2">Battery Storage</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-sm">
                {Math.round(batteryStorage.currentCapacity).toLocaleString()} W
              </span>
              <span className="font-medium text-sm">
                {batteryStorage.maxCapacity.toLocaleString()} W
              </span>
            </div>
            <Progress
              value={percentFull}
              className={`h-3 ${getBatteryColor()}`}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="font-medium">{percentFull}%</span>
              <span className="ml-1 text-gray-500">Full</span>
            </div>
            {batteryStorage.isCharging && (
              <div className="flex items-center font-medium text-green-600">
                <BatteryCharging className="mr-1 w-4 h-4" />
                Charging
              </div>
            )}
          </div>

          <div className="mt-2 text-gray-500 text-xs">
            Last updated: {batteryStorage.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
