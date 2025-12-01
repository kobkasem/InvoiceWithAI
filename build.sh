#!/bin/bash
set -e  # Exit on error

echo "🔨 Building application..."

echo "📦 Installing root dependencies..."
npm ci

echo "📦 Installing client dependencies..."
cd client
npm ci

echo "🏗️  Building React frontend..."
npm run build

echo "✅ Build completed successfully!"

