# Crypto Asset Dashboard

A modern, responsive cryptocurrency dashboard built with React, TypeScript, and Tailwind CSS. Track real-time crypto prices, market data, and visualize price trends with interactive charts.

![Crypto Dashboard](./screenshots/dashboard-preview.png)

## Features

- **Real-time Data**: Fetches live cryptocurrency data from CoinGecko API
- **Symbol Search**: Search by custom symbol or select from popular cryptocurrencies
- **Interactive Charts**: 30-day price history visualization with Recharts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean interface built with shadcn/ui components
- **Price Tracking**: Display current price, 24h changes, volume, and market cap
- **Market Details**: Comprehensive market information including highs, lows, and supply data

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **API**: CoinGecko API for cryptocurrency data

## Installation & Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/crypto-dashboard.git
   cd crypto-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

### Environment Configuration (Optional)

Create a `.env.local` file in the root directory for API configuration:

```env
# CoinGecko API (free tier doesn't require API key)
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Optional: For CoinGecko Pro API (if you have an API key)
# VITE_COINGECKO_API_KEY=your_api_key_here

# Development settings
VITE_DEV_MODE=true
```

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready for deployment.

### Other Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Testing
npm run test
npm run test:coverage

# Clean build artifacts
npm run clean
```

## Project Structure

```
├── public/                 # Static assets
│   ├── crypto-icon.svg    # App favicon
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── CryptoDashboard.tsx # Main dashboard component
│   └── PriceChart.tsx      # Chart visualization component
├── styles/
│   └── globals.css         # Global styles and Tailwind config
├── App.tsx                 # Root application component
├── main.tsx               # Application entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## UI/UX Design Decisions

### Design Philosophy
- **Minimalist Approach**: Clean, uncluttered interface focusing on data clarity
- **Information Hierarchy**: Clear visual hierarchy with important data prominently displayed
- **Responsive First**: Mobile-first design approach ensuring optimal experience across devices
- **Accessibility**: High contrast ratios, keyboard navigation, and screen reader support

### Color System
- **Light/Dark Mode**: Automatic theme switching based on system preferences
- **Semantic Colors**: Green for positive changes, red for negative changes
- **Neutral Palette**: Consistent gray scale for secondary information

### Typography
- **Font Scale**: Responsive typography with clear information hierarchy
- **Readability**: Optimized for financial data with proper spacing and sizing

### Layout Decisions
- **Card-Based Layout**: Modular design with clear content separation
- **Grid System**: Responsive grid adapting from 1 column (mobile) to 4 columns (desktop)
- **Chart Integration**: Full-width charts for better data visualization

## API Integration

### CoinGecko API
The dashboard integrates with the CoinGecko API for real-time cryptocurrency data:

- **Endpoint**: `/coins/{id}` for detailed coin information
- **Rate Limiting**: Respects API rate limits with request throttling
- **Error Handling**: Graceful error handling with user feedback
- **Mock Data**: Fallback to mock data for development/demo purposes

### Real API Integration

To use real CoinGecko API data instead of mock data, update the `fetchCryptoData` function in `components/CryptoDashboard.tsx`:

```typescript
const fetchCryptoData = async (cryptoId: string) => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}`);
    const data = await response.json();
    
    setCryptoData({
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      current_price: data.market_data.current_price.usd,
      price_change_24h: data.market_data.price_change_24h,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
      market_cap: data.market_data.market_cap.usd,
      total_volume: data.market_data.total_volume.usd,
      high_24h: data.market_data.high_24h.usd,
      low_24h: data.market_data.low_24h.usd,
      circulating_supply: data.market_data.circulating_supply,
      last_updated: data.last_updated,
    });
    
    // Fetch chart data
    const chartResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=30`
    );
    const chartData = await chartResponse.json();
    setChartData(chartData);
    
  } catch (err) {
    setError('Failed to fetch cryptocurrency data. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

## Features Breakdown

### 1. Cryptocurrency Selection
- **Dropdown Menu**: Pre-populated with popular cryptocurrencies
- **Custom Search**: Manual symbol input with validation
- **Real-time Updates**: Automatic data refresh on selection change

### 2. Price Display
- **Current Price**: Prominently displayed with currency formatting
- **24h Change**: Color-coded percentage and absolute change
- **Price Trends**: Visual indicators for price direction

### 3. Market Data
- **Volume Information**: 24-hour trading volume with smart formatting
- **Market Cap**: Total market capitalization
- **Supply Data**: Circulating supply information
- **High/Low**: 24-hour price range

### 4. Interactive Chart
- **30-Day History**: Price trends over the last month
- **Hover Details**: Tooltip showing exact price and date
- **Responsive Design**: Adapts to different screen sizes
- **Color Coding**: Green for upward trends, red for downward

## Customization

### Adding New Cryptocurrencies

Update the `POPULAR_CRYPTOS` array in `components/CryptoDashboard.tsx`:

```typescript
const POPULAR_CRYPTOS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  // Add new entries here
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
];
```

### Styling Customization

Modify the design system in `styles/globals.css` or update Tailwind classes in components.

### Chart Configuration

Adjust chart settings in `components/PriceChart.tsx`:

```typescript
// Change chart timeframe, colors, or styling
const CHART_CONFIG = {
  timeframe: 30, // days
  positiveColor: "#22c55e",
  negativeColor: "#ef4444"
};
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## What to Enhance with More Time

### Short-term Improvements (1-2 weeks)
- **Portfolio Tracking**: Allow users to track multiple cryptocurrencies
- **Price Alerts**: Set up notifications for price thresholds  
- **More Chart Options**: Different timeframes (1h, 7d, 1y)
- **Favorites System**: Save frequently viewed cryptocurrencies
- **Better Error Handling**: More detailed error messages and retry mechanisms

### Medium-term Features (1-2 months)
- **User Authentication**: Personal portfolios and preferences
- **Advanced Charts**: Candlestick charts, volume overlays, technical indicators
- **Market News**: Integration with crypto news APIs
- **Comparison Tool**: Side-by-side cryptocurrency comparisons
- **PWA Features**: Offline support and push notifications

### Long-term Vision (3-6 months)
- **Trading Integration**: Connect with exchange APIs for trading
- **Advanced Analytics**: AI-powered price predictions and market analysis
- **Social Features**: Community insights and sentiment analysis
- **DeFi Integration**: Track DeFi protocols and yield farming opportunities
- **Mobile App**: React Native version for mobile platforms

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for providing comprehensive cryptocurrency API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Recharts](https://recharts.org/) for the charting capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool

---
