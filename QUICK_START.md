# Quick Start Guide - AWS EC2 Deployment

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- EC2 instance running (Amazon Linux 2 or Ubuntu 22.04)
- Security Group allows ports: 8000 (API), 80/3000 (Frontend)
- SSH access to instance

### Option 1: One-Command Deployment

Copy this entire file and run on EC2:

```bash
#!/bin/bash
git clone <your-repo-url> propaganda-detector
cd propaganda-detector

# Option A: Use provided deployment script
bash deploy.sh

# Option B: Manual setup (see below)
```

### Option 2: Manual Deployment (Step-by-step)

#### 1. SSH into your EC2 instance
```bash
ssh -i your-key.pem ec2-user@13.235.248.64
```

#### 2. Install dependencies
```bash
sudo yum update -y
sudo yum install -y python3 python3-pip python3-venv nodejs git
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
```

#### 3. Clone and setup
```bash
git clone <your-repo-url> propaganda-detector
cd propaganda-detector

# Frontend setup
npm install
npm run build

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 4. Start services
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd ..
npx serve -s dist -l 3000
```

### Option 3: Docker Deployment

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## ⚙️ Post-Deployment Checklist

- [ ] Backend API accessible: `curl http://13.235.248.64:8000/docs`
- [ ] Frontend loads: `http://13.235.248.64:3000` or `http://13.235.248.64:80`
- [ ] Test API call from UI
- [ ] Configure HTTPS (Let's Encrypt)
- [ ] Setup auto-restart with PM2

## 🔗 Access Points

| Service | URL |
|---------|-----|
| Frontend | http://13.235.248.64:3000 |
| Backend API | http://13.235.248.64:8000 |
| API Docs | http://13.235.248.64:8000/docs |
| API ReDoc | http://13.235.248.64:8000/redoc |

## 🧪 Test API

```bash
curl -X POST http://13.235.248.64:8000/detect \
  -H "Content-Type: application/json" \
  -d '{"text": "You must buy our product or you will fail!"}'
```

## 📊 Monitoring

### With PM2:
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start backend service
cd backend
pm2 start "uvicorn app:app --host 0.0.0.0 --port 8000" --name "api"

# View status
pm2 status

# View logs
pm2 logs

# Auto-restart on reboot
pm2 startup
pm2 save
```

## 🔒 Security Recommendations

1. **Restrict CORS** - Update `backend/app.py`:
```python
allow_origins=[
    "http://13.235.248.64",
    "https://yourdomain.com"
],
```

2. **Enable HTTPS**:
```bash
sudo certbot certonly --standalone -d yourdomain.com
sudo certbot certonly --certonly --standalone -d 13.235.248.64  # For IP (use domain if possible)
```

3. **Update Security Group** - Allow only necessary IPs/ports

4. **Keep dependencies updated**:
```bash
pip install --upgrade -r requirements.txt
npm update
```

## ❌ Troubleshooting

### Backend not responding
```bash
# Check if running
lsof -i :8000

# Check logs
pm2 logs api

# Manual test
curl http://13.235.248.64:8000/docs
```

### Model not loading
```bash
# Check if model directory exists
ls -la backend/propaganda_deberta_7class/

# Check disk space
df -h

# Check available RAM
free -h
```

### CORS errors
- Ensure backend CORS middleware is configured
- Frontend API URL should match backend URL
- Check DevTools Console for exact error

### Port already in use
```bash
# Kill process on port
sudo lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## 📞 Support

For issues:
1. Check logs: `pm2 logs`
2. Verify connectivity: `curl -v http://13.235.248.64:8000/docs`
3. Check EC2 Security Group rules
4. Verify model files exist

