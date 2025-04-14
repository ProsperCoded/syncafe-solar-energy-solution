import React, { useState } from "react";
import { SolarForm } from "@/components/SolarForm";
import { useEnergyData } from "@/hooks/useEnergyData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sun, Cloud, CloudRain, CloudLightning } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const SolarPage = () => {
  const { solarData, updateSolarData, solarProduction } = useEnergyData();
  const [weatherFactor, setWeatherFactor] = useState(1); // 1 = 100% efficiency (sunny)
  const [currentWeather, setCurrentWeather] = useState("sunny");

  const toggleSolar = () => {
    if (!solarData) return;

    updateSolarData.mutate({
      production_amount: solarData.production_amount,
      is_on: !solarData.is_on,
    });
  };

  const applyWeatherCondition = (condition: string, factor: number) => {
    if (!solarData) return;

    // Calculate new production amount based on weather condition
    const originalAmount = solarData.production_amount / weatherFactor; // Get the baseline amount
    const newAmount = Math.round(originalAmount * factor);

    setWeatherFactor(factor);
    setCurrentWeather(condition);

    // Update the solar data with the new production amount
    updateSolarData.mutate({
      production_amount: newAmount,
      is_on: solarData.is_on,
    });

    toast({
      title: `Weather condition updated: ${condition}`,
      description: `Solar production efficiency now at ${Math.round(
        factor * 100
      )}%`,
    });
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 font-bold text-gray-800 text-3xl">
        Solar Production
      </h1>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Solar Production Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <SolarForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solar Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    solarData?.is_on
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Sun className="w-8 h-8" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-lg">Solar Panel System</h3>
                  <p className="text-gray-500 text-sm">
                    {solarData?.is_on
                      ? "Currently active"
                      : "Currently inactive"}
                  </p>
                </div>
              </div>
              <Switch
                checked={solarData?.is_on || false}
                onCheckedChange={toggleSolar}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-500 text-sm">
                Simulate Weather Conditions
              </h4>

              <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
                <button
                  className={`flex flex-col items-center p-3 rounded-lg hover:bg-yellow-200 transition-colors ${
                    currentWeather === "sunny"
                      ? "bg-yellow-200 ring-2 ring-yellow-400"
                      : "bg-yellow-100"
                  } text-yellow-600`}
                  onClick={() => applyWeatherCondition("sunny", 1.0)}
                  aria-pressed={currentWeather === "sunny"}
                >
                  <Sun className="mb-1 w-6 h-6" />
                  <span className="text-xs">Sunny</span>
                </button>

                <button
                  className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-100 transition-colors ${
                    currentWeather === "partly cloudy"
                      ? "bg-blue-100 ring-2 ring-blue-400"
                      : "bg-blue-50"
                  } text-blue-600`}
                  onClick={() => applyWeatherCondition("partly cloudy", 0.7)}
                  aria-pressed={currentWeather === "partly cloudy"}
                >
                  <Cloud className="mb-1 w-6 h-6" />
                  <span className="text-xs">Partly Cloudy</span>
                </button>

                <button
                  className={`flex flex-col items-center p-3 rounded-lg hover:bg-blue-200 transition-colors ${
                    currentWeather === "rainy"
                      ? "bg-blue-200 ring-2 ring-blue-400"
                      : "bg-blue-100"
                  } text-blue-600`}
                  onClick={() => applyWeatherCondition("rainy", 0.4)}
                  aria-pressed={currentWeather === "rainy"}
                >
                  <CloudRain className="mb-1 w-6 h-6" />
                  <span className="text-xs">Rainy</span>
                </button>

                <button
                  className={`flex flex-col items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${
                    currentWeather === "stormy"
                      ? "bg-gray-200 ring-2 ring-gray-400"
                      : "bg-gray-100"
                  } text-gray-600`}
                  onClick={() => applyWeatherCondition("stormy", 0.2)}
                  aria-pressed={currentWeather === "stormy"}
                >
                  <CloudLightning className="mb-1 w-6 h-6" />
                  <span className="text-xs">Stormy</span>
                </button>
              </div>

              <div className="bg-gray-50 mt-6 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">
                    Current Production: {solarProduction} W
                  </h4>
                  <span className="text-gray-500 text-xs">
                    Efficiency: {Math.round(weatherFactor * 100)}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      weatherFactor > 0.7
                        ? "bg-green-400"
                        : weatherFactor > 0.4
                        ? "bg-yellow-400"
                        : weatherFactor > 0.2
                        ? "bg-orange-400"
                        : "bg-red-400"
                    }`}
                    style={{
                      width: `${Math.min(
                        (solarProduction / 10000) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-gray-500 text-xs">
                  <span>0 W</span>
                  <span>5000 W</span>
                  <span>10000 W</span>
                </div>
              </div>

              <div className="bg-blue-50 mt-4 p-4 rounded-lg">
                <h4 className="mb-2 font-medium text-blue-800">
                  Weather Impact Information
                </h4>
                <p className="text-blue-700 text-sm">
                  {currentWeather === "sunny" &&
                    "Perfect conditions for solar energy generation. Panels operating at maximum efficiency."}
                  {currentWeather === "partly cloudy" &&
                    "Cloud cover is reducing solar efficiency. Energy output is at 70% of maximum capacity."}
                  {currentWeather === "rainy" &&
                    "Rain significantly reduces solar panel efficiency. Output is at 40% of maximum capacity."}
                  {currentWeather === "stormy" &&
                    "Severe weather conditions. Very limited solar production at only 20% of maximum capacity."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
