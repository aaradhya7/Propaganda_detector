# Propaganda Detector - AWS EC2 Deployment

## 📋 Project Overview

This is a full-stack propaganda detection application:
- **Frontend**: React + Vite (TypeScript-ready)
- **Backend**: FastAPI with DeBERTa ML model
- **Deployment Target**: AWS EC2 Instance (13.235.248.64)

## 📂 Project Structure

```
pfrontend/
├── src/                          # React frontend
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── App.jsx
│   └── main.jsx
├── backend/                      # FastAPI backend
│   ├── app.py                    # Main application
│   ├── propaganda_deberta_7class/ # ML model
│   ├── requirements.txt
│   └── Dockerfile
├── public/                       # Static files
├── vite.config.js               # Vite configuration
├── package.json                 # Node dependencies
├── Dockerfile                   # Frontend Docker image
├── docker-compose.yml           # Multi-container setup
├── deploy.sh                    # One-command deployment
├── QUICK_START.md              # Quick deployment guide
├── EC2_DEPLOYMENT_GUIDE.md     # Detailed guide
└── .env.production             # Production environment
```

## 🚀 Deployment Options

### Option 1: Automated One-Command Deployment ⚡

The fastest way to deploy:

```bash
# On your local machine, push your code to git
git add .
git commit -m "Ready for EC2 deployment"
git push

# SSH into EC2 instance
ssh -i your-key.pem ec2-user@13.235.248.64

# Clone and run deployment
git clone <your-repo-url> propaganda-detector
cd propaganda-detector
chmod +x deploy.sh
bash deploy.sh
```

**What this does:**
- Updates system packages
- Installs Python 3, Node.js, npm
- Sets up virtual environment
- Installs all dependencies
- Builds frontend
- Starts both services with PM2
- Enables auto-restart

**Time: ~5-10 minutes**

### Option 2: Manual Deployment 🔧

For more control, follow [QUICK_START.md](./QUICK_START.md) for step-by-step instructions.

**Time: ~15-20 minutes**

### Option 3: Docker Deployment 🐳

For containerized deployment:

```bash
ssh -i your-key.pem ec2-user@13.235.248.64
git clone <your-repo-url> propaganda-detector
cd propaganda-detector
docker-compose up -d
```

**Time: ~10-15 minutes** (first build is longer)

## ✅ Post-Deployment

### Verify Services

```bash
# Check if services are running
pm2 status
# or for Docker
docker-compose ps
```

### Access Your Application

| Service | URL |
|---------|-----|
| **Frontend** | http://13.235.248.64 (or :3000) |
| **Backend API** | http://13.235.248.64:8000 |
| **API Docs** | http://13.235.248.64:8000/docs |
| **API ReDoc** | http://13.235.248.64:8000/redoc |

### Test the API

```bash
curl -X POST http://13.235.248.64:8000/detect \
  -H "Content-Type: application/json" \
  -d '{"text": "Buy our product now or you will regret it!"}'
```

## 🔄 Update Configuration

### Change API Endpoint

If you need to change the API endpoint:

1. Update `.env.production`:
   ```
   VITE_API_URL=http://your-new-ip:8000
   ```

2. Rebuild frontend:
   ```bash
   npm run build
   ```

3. Restart frontend service:
   ```bash
   pm2 restart propaganda-detector-ui
   ```

## 🔒 Security Setup

### Enable HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx
# or for Ubuntu
sudo apt install -y certbot python3-certbot-nginx

# Request certificate (for domain only, not IP)
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot-renew.timer
```

### Update CORS for Production

Edit `backend/app.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://13.235.248.64",
        "https://yourdomain.com"  # Add your domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then rebuild and restart:
```bash
cd backend && pip install -r requirements.txt
pm2 restart propaganda-detector-api
```

## 📊 Monitoring & Maintenance

### View Logs

```bash
# All services
pm2 logs

# Specific service
pm2 logs propaganda-detector-api
pm2 logs propaganda-detector-ui

# Last 100 lines
pm2 logs --lines 100
```

### Monitor Resources

```bash
# Real-time monitoring
pm2 monit

# Check disk usage
df -h

# Check memory usage
free -h
```

### Update Dependencies

```bash
# Backend
cd backend
source venv/bin/activate
pip install --upgrade -r requirements.txt

# Frontend
cd ..
npm update
npm run build

# Restart services
pm2 restart all
```

### Restart Services

```bash
# Restart all
pm2 restart all

# Restart specific
pm2 restart propaganda-detector-api

# Stop/Start
pm2 stop propaganda-detector-ui
pm2 start propaganda-detector-ui
```

## 🐛 Troubleshooting

### Services won't start

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs

# Check running processes
ps aux | grep python
ps aux | grep node
```

### API returns 502/503 errors

```bash
# Check backend is running on port 8000
netstat -tuln | grep 8000

# Check if model is loading
curl http://13.235.248.64:8000/docs

# Check system resources
free -h
df -h
```

### Frontend not loading

```bash
# Check if frontend is running
netstat -tuln | grep 3000
# or port 80 if using production

# Check Nginx (if using it)
sudo nginx -t
sudo systemctl status nginx

# Verify build files exist
ls -la dist/
```

### Port already in use

```bash
# Kill process on port
sudo lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9
sudo lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Model loading errors

```bash
# Verify model files
ls -la backend/propaganda_deberta_7class/

# Check file permissions
chmod -R 755 backend/propaganda_deberta_7class/

# Restart backend
pm2 restart propaganda-detector-api
```

## 📝 Environment Variables

### Development (.env)
```
VITE_API_URL=http://localhost:8000
```

### Production (.env.production)
```
VITE_API_URL=http://13.235.248.64:8000
```

## 🔐 EC2 Security Group Configuration

Ensure your Security Group allows:

| Protocol | Port | Source | Purpose |
|----------|------|--------|---------|
| TCP | 22 | Your IP | SSH access |
| TCP | 80 | 0.0.0.0/0 | HTTP (Frontend) |
| TCP | 443 | 0.0.0.0/0 | HTTPS (Frontend) |
| TCP | 8000 | 0.0.0.0/0 | Backend API |
| TCP | 3000 | 0.0.0.0/0 | Dev Frontend (if needed) |

## 🚨 Important Notes

1. **Model Files**: Ensure `propaganda_deberta_7class/` is included in your git repo or uploaded separately
2. **Disk Space**: The full model takes ~500MB - ensure EC2 instance has sufficient storage
3. **Memory**: ML model requires ~4GB RAM minimum
4. **Python Version**: Use Python 3.9+ for best compatibility
5. **Node Version**: Need Node.js 18+ for Vite

## 📞 Support

### Common Commands Reference

```bash
# View deployment guide
cat QUICK_START.md
cat EC2_DEPLOYMENT_GUIDE.md

# Check status
pm2 status
pm2 logs

# System info
uname -a
python3 --version
node --version
npm --version
```

## 🎯 Next Steps

1. ✅ Deploy to EC2 using `deploy.sh`
2. ✅ Test frontend and API
3. ✅ Enable HTTPS
4. ✅ Setup monitoring/alerts
5. ✅ Configure auto-backups
6. ✅ Setup CI/CD pipeline

---

**EC2 Instance**: `13.235.248.64`  
**Frontend URL**: `http://13.235.248.64`  
**API URL**: `http://13.235.248.64:8000`

For detailed deployment instructions, see:
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md) - Comprehensive guide
