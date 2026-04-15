#!/bin/bash

# Propaganda Detector Full Deployment Script
# Run this script on your EC2 instance for complete deployment

echo "🚀 Starting complete deployment to AWS EC2..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Update system
echo -e "${YELLOW}📦 Updating system...${NC}"
sudo yum update -y  # For Amazon Linux
# sudo apt update -y  # For Ubuntu

# Install Node.js and npm
echo -e "${YELLOW}📦 Installing Node.js and npm...${NC}"
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
# For Ubuntu: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - && sudo apt-get install -y nodejs

# Install Python and dependencies
echo -e "${YELLOW}📦 Installing Python dependencies...${NC}"
sudo yum install -y python3 python3-pip python3-venv
# sudo apt install -y python3 python3-pip python3-venv  # For Ubuntu

# Install Git if not present
sudo yum install -y git
# sudo apt install -y git  # For Ubuntu

# Navigate to project root
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo -e "${GREEN}✅ Navigated to project directory: $PROJECT_DIR${NC}"

# ============ BACKEND SETUP ============
echo -e "${YELLOW}⚙️  Setting up backend...${NC}"
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# ============ FRONTEND SETUP ============
echo -e "${YELLOW}⚙️  Setting up frontend...${NC}"
cd "$PROJECT_DIR"

npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}"

# ============ PM2 SETUP ============
echo -e "${YELLOW}🔧 Installing PM2...${NC}"
sudo npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'propaganda-detector-api',
      cwd: './backend',
      script: 'uvicorn',
      args: 'app:app --host 0.0.0.0 --port 8000 --workers 4',
      env: {
        PATH: './venv/bin:$PATH'
      },
      interpreter: './venv/bin/python3'
    },
    {
      name: 'propaganda-detector-ui',
      cwd: './dist',
      script: 'http-server',
      args: '. -p 3000',
      env: {}
    }
  ]
};
EOF

# Stop any existing processes
pm2 delete all 2>/dev/null || true

# Start with PM2
echo -e "${YELLOW}🚀 Starting applications with PM2...${NC}"
cd "$PROJECT_DIR"
cd backend && source venv/bin/activate && cd ..
pm2 start "uvicorn backend.app:app --host 0.0.0.0 --port 8000 --workers 4" --name "propaganda-detector-api"
pm2 start "npx serve -s dist -l 3000" --name "propaganda-detector-ui"

pm2 save
pm2 startup

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "🔗 Access your application:"
echo "   - Frontend: http://13.235.248.64:3000"
echo "   - Backend API: http://13.235.248.64:8000"
echo "   - API Docs: http://13.235.248.64:8000/docs"
echo ""
echo "📋 Useful PM2 commands:"
echo "   - View logs: pm2 logs"
echo "   - Monitor: pm2 monit"
echo "   - Restart: pm2 restart all"
echo "   - Stop: pm2 stop all"
