
export interface BatteryStorage {
  currentCapacity: number;      // Current stored energy in watts
  maxCapacity: number;          // Maximum storage capacity in watts
  efficiency: number;           // Battery charging efficiency (0-1)
  lastUpdated: Date;            // Last time battery was updated
  isCharging?: boolean;         // Whether the battery is currently charging
}

export interface EnergySettings {
  gridRate: number;             // Cost per kWh when buying from grid
  saleRate: number;             // Rate per kWh when selling energy
  batteryEfficiency: number;    // Efficiency rate for battery storage (0-1)
  currency: 'USD' | 'NGN' | 'EUR'; // Currency type
  currencySymbol: '$' | '₦' | '€'; // Currency symbol
}

export interface EnergyTransaction {
  id: string;
  userId: string;
  amount: number;               // Amount of energy sold in watts
  earnings: number;             // Money earned from sale
  rate: number;                 // Rate at which energy was sold
  timestamp: Date;              // When the transaction occurred
}

export interface EnergyNotification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface DevicePriority {
  deviceId: string;
  priority: number;             // 1 = highest priority (last to turn off)
}
