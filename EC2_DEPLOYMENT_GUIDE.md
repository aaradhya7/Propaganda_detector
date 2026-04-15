# AWS EC2 Deployment Guide

Your application is now configured to connect to AWS EC2 instance: **13.235.248.64**

## Prerequisites
- SSH access to EC2 instance
- EC2 Security Group allows inbound traffic on ports:
  - Port 8000 (Backend API)
  - Port 5173 or 80 (Frontend)

## Step 1: Connect to EC2 Instance

```bash
ssh -i your-key-pair.pem ec2-user@13.235.248.64
# or for Ubuntu
ssh -i your-key-pair.pem ubuntu@13.235.248.64
```

## Step 2: Clone Your Project

```bash
cd /home/ec2-user  # or /home/ubuntu for Ubuntu
git clone <your-repository-url> pfrontend
cd pfrontend
```

## Step 3: Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend (production)
uvicorn app:app --host 0.0.0.0 --port 8000

# Or use Gunicorn for production
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:8000
```

## Step 4: Setup Frontend

```bash
cd ..  # back to pfrontend root

# Install dependencies
npm install

# Build for production
npm run build

# Serve with a simple HTTP server
npx serve -s dist -l 80

# Or use Python server
cd dist
python3 -m http.server 80
```

## Step 5: (Recommended) Use PM2 for Process Management

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start "uvicorn app:app --host 0.0.0.0 --port 8000" --name "propaganda-detector-api"

# Start frontend (in another terminal)
cd ../dist
pm2 start "python3 -m http.server 80" --name "propaganda-detector-ui"

# Save PM2 process list
pm2 save

# Enable PM2 auto-startup
pm2 startup
```

## Step 6: (Recommended) Setup Nginx as Reverse Proxy

Create `/etc/nginx/sites-available/propaganda-detector`:

```nginx
upstream backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name 13.235.248.64;

    # Frontend
    location / {
        root /home/ec2-user/pfrontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /detect {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/propaganda-detector /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Security Checklist

- [ ] Restrict CORS in production (update backend CORS settings)
- [ ] Use HTTPS with Let's Encrypt SSL certificates
- [ ] Configure firewall to allow only necessary ports
- [ ] Update EC2 Security Group rules
- [ ] Keep dependencies updated

## Update Backend CORS for Production

Edit `backend/app.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://13.235.248.64", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Backend not connecting
- Check if port 8000 is open: `netstat -tuln | grep 8000`
- Check logs: `pm2 logs propaganda-detector-api`
- Verify EC2 Security Group allows inbound on port 8000

### Frontend not loading
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify dist folder exists: `ls -la dist/`

### Model loading errors
- Ensure model files exist: `ls -la backend/propaganda_deberta_7class/`
- Check disk space: `df -h`
- Sufficient RAM for model: `free -h`

