import React, { useState, useEffect } from 'react';
import { PriceChart } from './PriceChart';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  last_updated: string;
}

interface ChartData {
  prices: [number, number][];
}

const POPULAR_CRYPTOS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#f59e0b' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#3b82f6' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', color: '#f59e0b' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', color: '#8b5cf6' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', color: '#06b6d4' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', color: '#ef4444' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', color: '#ec4899' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', color: '#3b82f6' },
];

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0'
};

const buttonStyle = {
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s'
};

const inputStyle = {
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  padding: '12px 16px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const selectStyle = {
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  padding: '12px 16px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  backgroundColor: 'white',
  cursor: 'pointer'
};

// Mock data generator
const generateMockData = (symbol: string): CryptoData => {
  const basePrice = symbol === 'BTC' ? 45000 : symbol === 'ETH' ? 2500 : Math.random() * 100 + 1;
  const change = (Math.random() - 0.5) * 0.1;
  
  return {
    id: symbol.toLowerCase(),
    symbol: symbol.toUpperCase(),
    name: POPULAR_CRYPTOS.find(c => c.symbol === symbol)?.name || symbol,
    current_price: basePrice,
    price_change_24h: basePrice * change,
    price_change_percentage_24h: change * 100,
    market_cap: basePrice * 19000000,
    total_volume: basePrice * 500000,
    high_24h: basePrice * 1.05,
    low_24h: basePrice * 0.95,
    circulating_supply: 19000000,
    last_updated: new Date().toISOString(),
  };
};

const generateMockChartData = (): ChartData => {
  const now = Date.now();
  const prices: [number, number][] = [];
  
  for (let i = 29; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const price = 45000 + (Math.random() - 0.5) * 5000;
    prices.push([timestamp, price]);
  }
  
  return { prices };
};

export function CryptoDashboard() {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [customSymbol, setCustomSymbol] = useState<string>('');
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoData = async (cryptoId: string) => {
    console.log('Fetching crypto data for:', cryptoId);
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const symbol = POPULAR_CRYPTOS.find(c => c.id === cryptoId)?.symbol || cryptoId.toUpperCase();
      const mockData = generateMockData(symbol);
      const mockChart = generateMockChartData();
      
      setCryptoData(mockData);
      setChartData(mockChart);
      
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Failed to fetch cryptocurrency data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (customSymbol.trim()) {
      await fetchCryptoData(customSymbol.toLowerCase());
      setCustomSymbol('');
    }
  };

  const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCrypto(value);
    await fetchCryptoData(value);
  };

  const handleRefresh = async () => {
    if (cryptoData) {
      await fetchCryptoData(cryptoData.id);
    }
  };

  useEffect(() => {
    fetchCryptoData(selectedCrypto);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const selectedCryptoInfo = POPULAR_CRYPTOS.find(c => c.id === selectedCrypto);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #6366f1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          ✨ Crypto Asset Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Track real-time cryptocurrency prices and market data with beautiful visualizations
        </p>
      </div>

      {/* Search and Selection */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🔍 Select Cryptocurrency
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Choose from popular cryptocurrencies or search by symbol
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              📈 Popular Cryptocurrencies
            </label>
            <select 
              value={selectedCrypto} 
              onChange={handleSelectChange}
              style={selectStyle}
            >
              {POPULAR_CRYPTOS.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.symbol} - {crypto.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              🔍 Custom Symbol Search
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Enter symbol (e.g., BTC, ETH)"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={inputStyle}
              />
              <button 
                onClick={handleSearch} 
                disabled={!customSymbol.trim() || loading}
                style={{
                  ...buttonStyle,
                  opacity: (!customSymbol.trim() || loading) ? 0.6 : 1,
                  cursor: (!customSymbol.trim() || loading) ? 'not-allowed' : 'pointer'
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading cryptocurrency data...</p>
          </div>
        </div>
      )}

      {/* Data Display */}
      {cryptoData && !loading && (
        <>
          {/* Crypto Header */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {selectedCryptoInfo && (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: selectedCryptoInfo.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    {selectedCryptoInfo.symbol.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0' }}>{cryptoData.name}</h2>
                  <p style={{ color: '#64748b', margin: '0' }}>{cryptoData.symbol}</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                style={{
                  ...buttonStyle,
                  backgroundColor: 'white',
                  color: '#3b82f6',
                  border: '2px solid #3b82f6'
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Price Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              ...cardStyle,
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              border: '1px solid #93c5fd'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#1e40af' }}>Current Price</span>
                <span style={{ fontSize: '1.25rem' }}>💰</span>
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1e40af' }}>
                {formatPrice(cryptoData.current_price)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <span style={{ fontSize: '1rem' }}>
                  {cryptoData.price_change_percentage_24h >= 0 ? '📈' : '📉'}
                </span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: cryptoData.price_change_percentage_24h >= 0 ? '#059669' : '#dc2626'
                }}>
                  {cryptoData.price_change_percentage_24h.toFixed(2)}% (24h)
                </span>
              </div>
            </div>

            <div style={{
              ...cardStyle,
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              border: '1px solid #6ee7b7'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#065f46' }}>24h Volume</span>
                <span style={{ fontSize: '1.25rem' }}>📊</span>
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#065f46' }}>
                {formatVolume(cryptoData.total_volume)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#064e3b', marginTop: '8px' }}>
                Trading volume in 24 hours
              </div>
            </div>

            <div style={{
              ...cardStyle,
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              border: '1px solid #86efac'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#166534' }}>24h High</span>
                <span style={{ fontSize: '1.25rem' }}>📈</span>
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#166534' }}>
                {formatPrice(cryptoData.high_24h)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#14532d', marginTop: '8px' }}>
                Highest price in 24 hours
              </div>
            </div>

            <div style={{
              ...cardStyle,
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: '1px solid #fca5a5'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#991b1b' }}>24h Low</span>
                <span style={{ fontSize: '1.25rem' }}>📉</span>
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#991b1b' }}>
                {formatPrice(cryptoData.low_24h)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#7f1d1d', marginTop: '8px' }}>
                Lowest price in 24 hours
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📊 Price Chart (30 Days)
              </h3>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Historical price data for {cryptoData.name} ({cryptoData.symbol})
              </p>
              <PriceChart data={chartData.prices} />
            </div>
          )}

          {/* Market Details */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📋 Market Details
            </h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Additional information about {cryptoData.name}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Market Cap:</span>
                  <span style={{ fontWeight: '600' }}>{formatVolume(cryptoData.market_cap)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ color: '#64748b' }}>Circulating Supply:</span>
                  <span style={{ fontWeight: '600' }}>{cryptoData.circulating_supply.toLocaleString()} {cryptoData.symbol}</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>24h Change:</span>
                  <span style={{ 
                    fontWeight: '600',
                    color: cryptoData.price_change_24h >= 0 ? '#059669' : '#dc2626',
                    backgroundColor: cryptoData.price_change_24h >= 0 ? '#d1fae5' : '#fee2e2',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}>
                    {formatPrice(Math.abs(cryptoData.price_change_24h))}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ color: '#64748b' }}>Last Updated:</span>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                    {new Date(cryptoData.last_updated).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CSS for animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          input:focus, select:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        `}
      </style>
    </div>
  );
}