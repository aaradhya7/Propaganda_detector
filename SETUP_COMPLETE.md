# 🚀 Propaganda Detector - EC2 Deployment Setup Complete!

## ✅ What's Been Done

Your project has been configured for AWS EC2 deployment to: **13.235.248.64**

### Changes Made:
1. ✅ Updated API endpoint to `13.235.248.64:8000`
2. ✅ Created environment configuration files
3. ✅ Generated deployment scripts
4. ✅ Created Docker setup
5. ✅ Added Nginx configuration
6. ✅ Setup CI/CD workflow

## 📦 New Files Created

| File | Purpose |
|------|---------|
| `.env.production` | Production environment variables |
| `backend/requirements.txt` | Python dependencies |
| `deploy.sh` | One-command deployment script |
| `backend/deploy.sh` | Backend-only deployment script |
| `docker-compose.yml` | Multi-container setup |
| `Dockerfile` (frontend) | Frontend container image |
| `backend/Dockerfile` | Backend container image |
| `nginx.conf` | Nginx reverse proxy config |
| `QUICK_START.md` | Quick deployment guide |
| `EC2_DEPLOYMENT_GUIDE.md` | Detailed deployment guide |
| `DEPLOYMENT.md` | Comprehensive README |
| `.github/workflows/deploy.yml` | CI/CD pipeline |

## 🎯 Next Steps

### Step 1: Prepare Your Local Repository

```bash
# In your project root
git add .
git commit -m "Configure for AWS EC2 deployment to 13.235.248.64"
git push
```

### Step 2: Setup Your EC2 Instance

#### Prerequisites on EC2:
- [ ] Security Group allows ports: 22 (SSH), 80 (HTTP), 8000 (API)
- [ ] Instance runs Amazon Linux 2 or Ubuntu 22.04
- [ ] At least 4GB RAM (for ML model)
- [ ] At least 20GB disk space

#### Option A: One-Command Deployment (Recommended ⚡)

```bash
# On your local machine
ssh -i your-key.pem ec2-user@13.235.248.64

# On EC2 instance
git clone <your-repository-url> propaganda-detector
cd propaganda-detector
chmod +x deploy.sh
bash deploy.sh
```

**Time: 5-10 minutes**

#### Option B: Docker Deployment 🐳

```bash
ssh -i your-key.pem ec2-user@13.235.248.64
git clone <your-repository-url> propaganda-detector
cd propaganda-detector
docker-compose up -d
```

**Time: 10-15 minutes**

#### Option C: Manual Deployment 🔧

Follow [QUICK_START.md](./QUICK_START.md) for step-by-step instructions.

### Step 3: Verify Deployment

```bash
# Test backend API
curl http://13.235.248.64:8000/docs

# Test frontend
# Open in browser: http://13.235.248.64:3000 or http://13.235.248.64
```

### Step 4: Setup Monitoring

```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@13.235.248.64

# Check service status
pm2 status

# View live logs
pm2 monit
```

## 🔧 Managing Services

### Start/Stop Services

```bash
# All services
pm2 start all
pm2 stop all
pm2 restart all

# Specific service
pm2 restart propaganda-detector-api
pm2 stop propaganda-detector-ui

# View status
pm2 status
pm2 logs
```

### Update Code

```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@13.235.248.64

# Pull latest code
cd propaganda-detector
git pull

# Rebuild and restart
npm run build
pm2 restart all
```

## 📊 Access Your Application

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://13.235.248.64 | Main UI |
| Backend API | http://13.235.248.64:8000 | API server |
| API Docs | http://13.235.248.64:8000/docs | FastAPI Swagger UI |
| API ReDoc | http://13.235.248.64:8000/redoc | API documentation |

## 🔐 Security Checklist

- [ ] SSH key securely stored (not in repo)
- [ ] EC2 Security Group configured correctly
- [ ] CORS restricted to your domain (production)
- [ ] HTTPS/SSL certificate installed (recommended)
- [ ] Dependencies regularly updated
- [ ] Backups configured
- [ ] Monitoring/alerts setup

## 🌐 Enable HTTPS (Optional but Recommended)

```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@13.235.248.64

# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update backend CORS (backend/app.py)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://13.235.248.64",
        "https://yourdomain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rebuild and restart
npm run build
pm2 restart all
```

## 📝 Project Structure

```
propaganda-detector/
├── src/                           # Frontend (React)
├── backend/                       # Backend (FastAPI)
│   ├── app.py                    # Main API
│   ├── propaganda_deberta_7class/ # ML model (~500MB)
│   └── requirements.txt          # Python packages
├── dist/                         # Built frontend (after npm run build)
├── deploy.sh                     # Auto-deployment script
├── docker-compose.yml            # Docker setup
├── QUICK_START.md               # Quick reference
├── DEPLOYMENT.md                # Full documentation
└── .github/workflows/           # CI/CD
```

## 🆘 Troubleshooting

### Services not starting?
```bash
pm2 logs
pm2 status
```

### API not responding?
```bash
curl http://13.235.248.64:8000/docs
netstat -tuln | grep 8000
```

### Frontend not loading?
```bash
curl http://13.235.248.64
ls -la dist/
```

### Out of memory?
```bash
free -h
ps aux --sort=-%mem
```

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.**

## 🚀 CI/CD Deployment

To enable automatic deployments on code push:

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `EC2_SSH_PRIVATE_KEY`: Your EC2 SSH private key
   - `EC2_HOST`: 13.235.248.64
   - `EC2_USERNAME`: ec2-user

4. Push code → Automatic deployment triggers

```bash
git push
# → GitHub Actions runs deploy.yml
# → Automatically deploys to EC2
```

## 💡 Quick Commands Reference

```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@13.235.248.64

# Deployment
cd propaganda-detector && bash deploy.sh

# Check status
pm2 status

# View logs
pm2 logs
pm2 logs propaganda-detector-api

# Update code
git pull && npm run build && pm2 restart all

# Stop all services
pm2 stop all

# Restart services
pm2 restart all

# View disk usage
df -h

# View memory usage
free -h

# Monitor processes
pm2 monit

# Delete PM2 process
pm2 delete propaganda-detector-api
```

## 📞 Support Resources

- [QUICK_START.md](./QUICK_START.md) - 5-minute setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive documentation
- [EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md) - Detailed step-by-step
- FastAPI Docs: http://13.235.248.64:8000/docs
- PM2 Docs: https://pm2.keymetrics.io/
- Docker Docs: https://docs.docker.com/

## ✨ What's Next?

1. Deploy to EC2 using `deploy.sh`
2. Test the application
3. Monitor with PM2
4. Enable HTTPS
5. Setup CI/CD with GitHub Actions
6. Configure backups
7. Setup metrics/monitoring

---

## 🎉 You're All Set!

Your application is ready for AWS EC2 deployment. 

**Quick Start:**
```bash
# 1. Prepare code
git add . && git commit -m "Deploy to EC2" && git push

# 2. Deploy
ssh -i key.pem ec2-user@13.235.248.64
git clone <repo> propaganda-detector
cd propaganda-detector && bash deploy.sh

# 3. Access
# Frontend: http://13.235.248.64
# API Docs: http://13.235.248.64:8000/docs
```

**Questions?** Check the detailed guides or see troubleshooting section.

---

**EC2 Instance**: 13.235.248.64  
**API Port**: 8000  
**Frontend Port**: 3000 (or 80 with Nginx)

Happy deploying! 🚀
