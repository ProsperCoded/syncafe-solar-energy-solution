# Syncafe Solar Energy Management System

## Overview

Syncafe Solar Energy Management System is an interactive web application that helps users visualize, monitor, and optimize their solar energy production, consumption, and storage. The application provides real-time data visualization, energy analytics, and smart recommendations to maximize the benefits of solar energy systems.

## Features

### Real-time Energy Monitoring

- **Solar Production Tracking**: Monitor real-time solar energy production
- **Device Power Consumption**: Track power usage across all connected devices
- **Battery Storage Management**: Visualize battery charge/discharge status and capacity
- **Power Balance Visualization**: See the balance between energy production and consumption

### Weather Simulation

- Simulate different weather conditions (sunny, partly cloudy, rainy, stormy)
- Visualize the impact of weather on solar energy production
- Adaptive efficiency calculations based on weather conditions

### Advanced Analytics

- **Time-based Analytics**: View energy data across different timeframes (day, week, month, year)
- **Financial Impact**: Calculate savings, earnings and cost metrics
- **Energy Distribution**: Visualize power usage distribution across devices
- **Sustainability Metrics**: Track carbon offset and environmental impact

### Energy Market

- Sell excess energy back to the grid
- Track earnings from energy sales
- View transaction history and financial insights

### Smart Device Management

- Add and manage connected devices
- Set device priorities for power management
- Toggle devices on/off to optimize energy usage

### Optimization Recommendations

- Receive personalized recommendations to optimize energy usage
- Get alerts for critical battery levels and system status
- Adaptive tips based on current energy production and consumption patterns

### User Preferences

- Customize energy rates and pricing
- Set battery efficiency parameters
- Configure notification preferences

## Technical Features

- **Persistent Battery Storage**: Battery levels are saved across sessions
- **Optimized Database Synchronization**: Local state with periodic database updates
- **Real-time Simulation**: Solar energy and battery charge/discharge simulation
- **Responsive Design**: Fully responsive interface for all device sizes

## Technologies

- **Frontend**: React, TypeScript, TailwindCSS
- **State Management**: React Query, React Context
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Visualization**: Recharts

## Installation

### Prerequisites

- Node.js (version 16 or higher)
- pnpm or npm

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/solar-energy-balance-visualizer.git
   cd solar-energy-balance-visualizer
   ```

2. Install dependencies

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

## Database Setup

This application requires a Supabase project with the following tables:

- `profiles`
- `devices`
- `solar_data`
- `battery_storage`
- `energy_transactions`
- `notifications`

To set up the database schema, run the migrations in the `supabase/migrations` directory:

```bash
cd supabase
supabase migration up
```

## Usage

### Authentication

- Register a new account or log in with existing credentials
- User data is securely stored in Supabase

### Dashboard

- The main dashboard provides an overview of your energy system
- Real-time updates of power production, consumption, and storage
- Quick access to device control and energy statistics

### Simulation

- Use the Solar page to simulate different weather conditions
- Toggle solar production on/off
- Adjust production levels

### Analytics

- Access detailed analytics from the Analytics page
- Export reports for external analysis
- View historical data and projections

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
