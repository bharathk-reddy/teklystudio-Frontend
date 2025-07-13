import React, { useEffect, useRef } from 'react';

interface PriceChartProps {
  data: [number, number][];
}

export function PriceChart({ data }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get price data
    const prices = data.map(([, price]) => price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Determine if trend is positive or negative
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const isPositive = lastPrice >= firstPrice;
    const strokeColor = isPositive ? '#059669' : '#dc2626';
    const fillColor = isPositive ? '#d1fae5' : '#fee2e2';

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, fillColor);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * (height - 2 * padding)) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (i * (width - 2 * padding)) / 6;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw area under the curve
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    data.forEach(([timestamp, price], index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw the line
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    data.forEach(([timestamp, price], index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw price labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    
    // Y-axis labels (prices)
    for (let i = 0; i <= 4; i++) {
      const price = minPrice + (i * priceRange) / 4;
      const y = height - padding - (i * (height - 2 * padding)) / 4;
      const priceText = `$${(price / 1000).toFixed(0)}k`;
      ctx.fillText(priceText, 5, y + 4);
    }

    // X-axis labels (dates)
    const labelIndices = [0, Math.floor(data.length / 2), data.length - 1];
    labelIndices.forEach(index => {
      const [timestamp] = data[index];
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const date = new Date(timestamp);
      const dateText = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const textWidth = ctx.measureText(dateText).width;
      ctx.fillText(dateText, x - textWidth / 2, height - 10);
    });

    // Draw trend indicator
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = strokeColor;
    const trendText = isPositive ? '↗ Bullish Trend' : '↘ Bearish Trend';
    ctx.fillText(trendText, width - 140, 25);

  }, [data]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}
      />
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#64748b',
        border: '1px solid #e2e8f0'
      }}>
        Last 30 Days
      </div>
    </div>
  );
}