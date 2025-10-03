# Flint Dashboard

A modern, production-ready dashboard application built with Next.js 14, TypeScript, Tailwind CSS, and Radix UI components.

## Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **UI Components**: Radix UI headless components for accessibility
- **Data Visualization**: Interactive charts using Recharts
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Code Quality**: ESLint, TypeScript strict mode, and Airbnb style guide

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── atoms/             # Basic UI components (Button, Card, etc.)
│   ├── molecules/         # Composite components (MetricCard, Charts, etc.)
│   ├── organisms/         # Complex components (Sidebar, Dashboard, etc.)
│   └── providers/         # Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
└── types/                 # TypeScript type definitions
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Component Architecture

### Atoms
- **Button**: Reusable button component with variants
- **Card**: Container component for content sections
- **Tabs**: Radix UI tabs implementation
- **Avatar**: User avatar component

### Molecules
- **MetricCard**: Dashboard metric display with icons and trends
- **TimeRangeTabs**: Time period selector tabs
- **BarChart**: Interactive bar chart component
- **LineChart**: Interactive line chart component
- **ChartHeader**: Chart title and controls

### Organisms
- **Sidebar**: Navigation sidebar with user profile
- **DashboardContent**: Main dashboard content area
- **DashboardLayout**: Overall page layout wrapper

## Data Management

The application uses TanStack Query for efficient data fetching and caching:

- `useMetrics()` - Fetch dashboard metrics
- `useBarChartData()` - Fetch bar chart data
- `useLineChartData()` - Fetch line chart data

## Styling

The application uses Tailwind CSS with a custom design system:

- Custom color palette matching the Figma design
- Consistent spacing and typography
- Responsive breakpoints
- Dark mode ready (can be extended)

## API Integration

Mock data is currently used for development. To integrate with real APIs:

1. Update the fetch functions in `src/hooks/useDashboardData.ts`
2. Replace mock data with actual API endpoints
3. Add error handling and loading states
4. Configure authentication if needed

## Deployment

The application is ready for deployment on platforms like:

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Docker containers

## Contributing

1. Follow the Airbnb style guide
2. Use TypeScript for all new code
3. Ensure components are accessible
4. Write tests for new features
5. Update documentation as needed

## License

This project is private and proprietary.
