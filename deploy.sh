#!/bin/bash

# Deployment Script for Synnex Invoice Extractor
# This script helps prepare and deploy the application

set -e  # Exit on error

echo "🚀 Synnex Invoice Extractor - Deployment Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create a .env file based on env.example"
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo -e "${RED}❌ Error: Node.js version 14 or higher is required${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version check passed${NC}"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📦 Installing client dependencies..."
cd client
npm install

echo ""
echo "🏗️  Building frontend..."
npm run build
cd ..

echo ""
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Make sure your .env file has all required variables"
echo "2. Start the server with: npm start"
echo "   Or use PM2: pm2 start server/index.js --name synnex-invoice"
echo ""
echo "For production deployment, see DEPLOYMENT_GUIDE.md"

