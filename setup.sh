#!/bin/bash

# Crypto Asset Dashboard Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up Crypto Asset Dashboard..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version must be 16.0.0 or higher. Current version: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm is available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating environment configuration..."
    cat > .env.local << EOL
# CoinGecko API Configuration
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Optional: For CoinGecko Pro API (if you have an API key)
# VITE_COINGECKO_API_KEY=your_api_key_here

# Development settings
VITE_DEV_MODE=true
EOL
    echo "✅ Created .env.local file"
else
    echo "✅ Environment file already exists"
fi

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Run linting
echo "🧹 Running linter..."
npm run lint

echo ""
echo "🎉 Setup complete!"
echo "==================="
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "To run tests:"
echo "  npm run test"
echo ""
echo "The application will be available at: http://localhost:3000"
echo ""
echo "Happy coding! 🚀"