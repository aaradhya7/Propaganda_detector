#!/bin/bash

# Propaganda Detector Backend Deployment Script
# Run this script on your EC2 instance

echo "🚀 Starting backend deployment..."

# Update system
sudo yum update -y  # For Amazon Linux
# sudo apt update -y  # For Ubuntu

# Install Python and dependencies
sudo yum install -y python3 python3-pip python3-venv git
# sudo apt install -y python3 python3-pip python3-venv git  # For Ubuntu

# Navigate to backend directory
cd "$(dirname "$0")"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📚 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "🔧 Installing PM2..."
    sudo npm install -g pm2
fi

# Stop existing process if running
pm2 delete propaganda-detector-api 2>/dev/null || true

# Start the application with PM2
echo "🎯 Starting FastAPI application..."
pm2 start "uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4" \
    --name "propaganda-detector-api" \
    --interpreter python3

echo "✅ Backend deployment complete!"
echo "📊 Check status with: pm2 status"
echo "📋 View logs with: pm2 logs propaganda-detector-api"
