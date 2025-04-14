import React, { useState } from "react";
import { PowerChart } from "@/components/PowerChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useEnergyData } from "@/hooks/useEnergyData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Zap,
  Battery,
  Sun,
  DollarSign,
  BarChart4,
  Calendar,
  Clock,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export const AnalyticsPage = () => {
  const {
    activeDevicesPower,
    solarProduction,
    powerBalance,
    financials,
    batteryStorage,
    devices,
    transactions,
  } = useEnergyData();
  const [timeFrame, setTimeFrame] = useState("day");
  const [chartType, setChartType] = useState("earnings");

  // Calculate key metrics
  const batteryPercentage = Math.round(
    (batteryStorage.currentCapacity / batteryStorage.maxCapacity) * 100
  );
  const powerUsageFromGrid = Math.max(0, activeDevicesPower - solarProduction);
  const surplusPower = Math.max(0, solarProduction - activeDevicesPower);
  const dailyEarnings = powerBalance >= 0 ? financials.earnings * 24 : 0;
  const dailyCosts = powerBalance < 0 ? financials.costs * 24 : 0;

  // Calculate lifetime metrics
  const totalEarnings = transactions.reduce((sum, t) => sum + t.earnings, 0);
  const totalEnergySold = transactions.reduce((sum, t) => sum + t.amount, 0);
  const carbonOffset = (solarProduction * 24 * 365 * 0.0005).toFixed(1);

  // Mock data for historical analytics
  const generateHistoricalData = () => {
    const now = new Date();
    let data = [];

    if (timeFrame === "day") {
      // Hourly data for the current day
      for (let i = 0; i < 24; i++) {
        const hour = new Date(now);
        hour.setHours(i, 0, 0, 0);
        const baseValue = 2000 + Math.random() * 3000;
        const solarFactor =
          i >= 6 && i <= 18 ? Math.sin(((i - 6) * Math.PI) / 12) : 0; // Solar curve from 6am to 6pm

        data.push({
          time: format(hour, "HH:mm"),
          consumption: Math.round(baseValue * (0.7 + Math.random() * 0.6)),
          solar: Math.round(baseValue * 1.2 * Math.max(0, solarFactor)),
          battery: Math.round(
            batteryStorage.maxCapacity * (0.5 + Math.random() * 0.4)
          ),
          earnings: +(Math.random() * 0.8).toFixed(2),
        });
      }
    } else if (timeFrame === "week") {
      // Daily data for the past week
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);

        data.push({
          time: format(day, "EEE"),
          consumption: Math.round(20000 + Math.random() * 15000),
          solar: Math.round(18000 + Math.random() * 20000),
          battery: Math.round(
            batteryStorage.maxCapacity * (0.4 + Math.random() * 0.5)
          ),
          earnings: +(Math.random() * 5).toFixed(2),
        });
      }
    } else if (timeFrame === "month") {
      // Weekly data for the past month
      for (let i = 0; i < 4; i++) {
        const week = new Date(now);
        week.setDate(now.getDate() - i * 7);

        data.push({
          time: `Week ${i + 1}`,
          consumption: Math.round(120000 + Math.random() * 60000),
          solar: Math.round(100000 + Math.random() * 80000),
          battery: Math.round(
            batteryStorage.maxCapacity * (0.3 + Math.random() * 0.6)
          ),
          earnings: +(Math.random() * 25).toFixed(2),
        });
      }
    } else if (timeFrame === "year") {
      // Monthly data for the past year
      for (let i = 0; i < 12; i++) {
        const month = new Date(now);
        month.setMonth(now.getMonth() - i);

        data.push({
          time: format(month, "MMM"),
          consumption: Math.round(500000 + Math.random() * 200000),
          solar: Math.round(400000 + Math.random() * 300000),
          battery: Math.round(
            batteryStorage.maxCapacity * (0.2 + Math.random() * 0.7)
          ),
          earnings: +(Math.random() * 120).toFixed(2),
        });
      }
    }

    return data.reverse();
  };

  const historicalData = generateHistoricalData();

  // Power distribution data
  const powerDistribution = devices
    .filter((d) => d.is_on)
    .map((device) => ({
      name: device.name,
      value: device.power_usage,
      fill: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    }));

  // Calculate power remaining per day
  const totalDailyGeneration = solarProduction * 24;
  const totalDailyConsumption = activeDevicesPower * 24;
  const powerRemaining = totalDailyGeneration - totalDailyConsumption;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-gray-800 text-3xl">Power Analytics</h1>
        <Button variant="outline" className="flex items-center">
          <Download className="mr-2 w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card
          className={powerBalance >= 0 ? "border-green-200" : "border-red-200"}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 text-sm">
              Power Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {powerBalance >= 0 ? (
                <TrendingUp className="mr-2 w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="mr-2 w-5 h-5 text-red-500" />
              )}
              <div
                className={`text-2xl font-bold ${
                  powerBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {powerBalance >= 0 ? "+" : ""}
                {powerBalance} W
              </div>
            </div>
            <p className="mt-1 text-gray-500 text-xs">
              Current energy surplus/deficit
            </p>
            <div className="bg-gray-100 mt-2 rounded-full w-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${
                  powerBalance >= 0 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(
                    Math.abs(powerBalance / 5000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 text-sm">
              Battery Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Battery className="mr-2 w-5 h-5 text-blue-500" />
              <div className="font-bold text-2xl">{batteryPercentage}%</div>
            </div>
            <p className="mt-1 text-gray-500 text-xs">
              {batteryStorage.currentCapacity.toLocaleString()} W available
            </p>
            <div className="bg-gray-100 mt-2 rounded-full w-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${
                  batteryPercentage > 70
                    ? "bg-green-500"
                    : batteryPercentage > 30
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${batteryPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 text-sm">
              Daily Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="mr-2 w-5 h-5 text-green-500" />
              <div className="font-bold text-green-600 text-2xl">
                ${dailyEarnings.toFixed(2)}
              </div>
            </div>
            <p className="mt-1 text-gray-500 text-xs">
              {transactions.length > 0
                ? `${transactions.length} energy transactions`
                : "Estimated daily earnings"}
            </p>
            <div className="flex justify-between mt-2 text-xs">
              <span>
                Total Lifetime:{" "}
                <span className="font-semibold">
                  ${totalEarnings.toFixed(2)}
                </span>
              </span>
              <span className="text-green-600">
                +{totalEnergySold.toLocaleString()} W sold
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 text-sm">
              Power Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Zap
                className={`mr-2 h-5 w-5 ${
                  powerRemaining >= 0 ? "text-green-500" : "text-red-500"
                }`}
              />
              <div
                className={`text-2xl font-bold ${
                  powerRemaining >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {powerRemaining >= 0 ? "+" : ""}
                {powerRemaining.toLocaleString()} W
              </div>
            </div>
            <p className="mt-1 text-gray-500 text-xs">Daily surplus/deficit</p>
            <div className="flex justify-between mt-2 text-xs">
              <span>
                Generation:{" "}
                <span className="font-semibold">
                  {totalDailyGeneration.toLocaleString()} W
                </span>
              </span>
              <span>
                Usage:{" "}
                <span className="font-semibold">
                  {totalDailyConsumption.toLocaleString()} W
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="gap-6 grid grid-cols-1 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analytics</CardTitle>
            <div className="flex gap-2 mt-2">
              <Button
                variant={timeFrame === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFrame("day")}
              >
                Day
              </Button>
              <Button
                variant={timeFrame === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFrame("week")}
              >
                Week
              </Button>
              <Button
                variant={timeFrame === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFrame("month")}
              >
                Month
              </Button>
              <Button
                variant={timeFrame === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFrame("year")}
              >
                Year
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="earnings"
              className="w-full"
              onValueChange={setChartType}
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="earnings" className="flex items-center">
                  <DollarSign className="mr-2 w-4 h-4" />
                  Earnings
                </TabsTrigger>
                <TabsTrigger value="energy" className="flex items-center">
                  <Zap className="mr-2 w-4 h-4" />
                  Energy
                </TabsTrigger>
                <TabsTrigger value="solar" className="flex items-center">
                  <Sun className="mr-2 w-4 h-4" />
                  Solar
                </TabsTrigger>
                <TabsTrigger value="battery" className="flex items-center">
                  <Battery className="mr-2 w-4 h-4" />
                  Battery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="earnings" className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Earnings"]} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      name="Earnings ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="energy" className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} W`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke="#f43f5e"
                      name="Consumption (W)"
                    />
                    <Line
                      type="monotone"
                      dataKey="solar"
                      stroke="#eab308"
                      name="Production (W)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="solar" className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} W`, ""]} />
                    <Legend />
                    <Bar
                      dataKey="solar"
                      fill="#eab308"
                      name="Solar Production (W)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="battery" className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} W`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="battery"
                      stroke="#0ea5e9"
                      name="Battery Level (W)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>

            <div className="gap-4 grid grid-cols-2 md:grid-cols-4 mt-4 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Avg. Daily Production</p>
                <p className="font-semibold text-lg">
                  {(solarProduction * 12).toLocaleString()} W
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Avg. Daily Consumption</p>
                <p className="font-semibold text-lg">
                  {(activeDevicesPower * 16).toLocaleString()} W
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Peak Production Time</p>
                <p className="font-semibold text-lg">12:00 PM</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Peak Usage Time</p>
                <p className="font-semibold text-lg">7:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Power Distribution</CardTitle>
            <CardDescription>Current active device power usage</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {powerDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={powerDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    dataKey="value"
                  >
                    {powerDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} W`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                No active devices to display
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Sustainability Metrics</CardTitle>
            <CardDescription>
              Environmental and financial impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="gap-4 grid grid-cols-2">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex justify-center items-center bg-green-100 mr-3 rounded-full w-10 h-10 text-green-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900 text-sm">
                      Carbon Offset
                    </h3>
                    <p className="font-bold text-green-700 text-xl">
                      {carbonOffset} kg
                    </p>
                  </div>
                </div>
                <p className="text-green-700 text-xs">
                  CO₂ emissions prevented annually
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex justify-center items-center bg-blue-100 mr-3 rounded-full w-10 h-10 text-blue-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900 text-sm">
                      Annual Savings
                    </h3>
                    <p className="font-bold text-blue-700 text-xl">
                      ${(dailyEarnings * 365).toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-blue-700 text-xs">
                  Projected yearly earnings
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex justify-center items-center bg-purple-100 mr-3 rounded-full w-10 h-10 text-purple-600">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-900 text-sm">
                      Energy Efficiency
                    </h3>
                    <p className="font-bold text-purple-700 text-xl">
                      {Math.round(
                        (solarProduction / Math.max(activeDevicesPower, 1)) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
                <p className="text-purple-700 text-xs">
                  Solar production vs. consumption
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex justify-center items-center bg-amber-100 mr-3 rounded-full w-10 h-10 text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-900 text-sm">
                      Energy Independence
                    </h3>
                    <p className="font-bold text-amber-700 text-xl">
                      {Math.min(
                        Math.round(
                          (solarProduction / Math.max(activeDevicesPower, 1)) *
                            24
                        ),
                        24
                      )}{" "}
                      hrs
                    </p>
                  </div>
                </div>
                <p className="text-amber-700 text-xs">
                  Daily hours without grid power
                </p>
              </div>
            </div>

            <div className="bg-gray-50 mt-6 p-4 rounded-lg">
              <h4 className="mb-2 font-medium text-sm">
                Optimization Recommendations
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-green-100 mr-2 p-1 rounded-full text-green-600">
                    <TrendingUp className="w-3 h-3" />
                  </span>
                  <span>
                    {powerBalance >= 0
                      ? "Consider increasing battery capacity to store more surplus energy"
                      : "Try shifting energy usage to peak solar production hours (10 AM - 2 PM)"}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 mr-2 p-1 rounded-full text-blue-600">
                    <BarChart4 className="w-3 h-3" />
                  </span>
                  <span>
                    {devices.filter((d) => d.power_usage > 1000 && d.is_on)
                      .length > 0
                      ? `Consider optimizing high-power devices: ${devices
                          .filter((d) => d.power_usage > 1000 && d.is_on)
                          .map((d) => d.name)
                          .join(", ")}`
                      : "Your device usage efficiency is excellent"}
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
