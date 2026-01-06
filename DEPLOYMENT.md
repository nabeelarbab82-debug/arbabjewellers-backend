# Deployment Guide

## Pre-Deployment Checklist

### Security

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (at least 32 random characters)
- [ ] Configure proper CORS origins (don't use `*` in production)
- [ ] Enable HTTPS/SSL
- [ ] Use environment variables for all sensitive data
- [ ] Enable MongoDB authentication
- [ ] Implement rate limiting
- [ ] Add helmet.js for security headers

### Environment Variables

Ensure all these are properly set in production:

- `NODE_ENV=production`
- `MONGO_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong random secret
- `FRONTEND_URL` - Your frontend domain
- Email configuration
- `PORT` - Production port

### Database

- [ ] Set up MongoDB Atlas or production MongoDB instance
- [ ] Enable authentication
- [ ] Configure IP whitelist
- [ ] Set up automated backups
- [ ] Create indexes for better performance

### Email

- [ ] Configure production email service
- [ ] Test all email templates
- [ ] Set proper FROM address
- [ ] Configure SPF/DKIM records

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
# Follow: https://www.mongodb.com/docs/manual/installation/

# Install Nginx
sudo apt install nginx -y

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

#### 2. Deploy Application

```bash
# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Setup database
node setupDatabase.js
node seedEmailTemplates.js

# Start with PM2
pm2 start index.js --name arbab-jewellers
pm2 save
pm2 startup  # Follow instructions
```

#### 3. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/arbab-jewellers
```

Add:

```nginx
server {
    listen 80;
    server_name api.arbabjewellers.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File uploads
    client_max_body_size 10M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/arbab-jewellers /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.arbabjewellers.com
```

#### 5. Configure Firewall

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Option 2: Heroku

#### 1. Prepare Application

Create `Procfile`:

```
web: node index.js
```

Update `package.json`:

```json
{
  "engines": {
    "node": "18.x"
  }
}
```

#### 2. Deploy

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create arbab-jewellers-api

# Add MongoDB addon
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://arbabjewellers.com

# Deploy
git push heroku main

# Setup database
heroku run node setupDatabase.js
heroku run node seedEmailTemplates.js

# View logs
heroku logs --tail
```

### Option 3: Vercel

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Option 4: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/arbab-jewellers
    depends_on:
      - mongo
    volumes:
      - ./uploads:/app/uploads

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Post-Deployment

### 1. Monitor Application

```bash
# Using PM2
pm2 monit
pm2 logs

# Check status
pm2 status
```

### 2. Setup Monitoring

- Use PM2 Plus for monitoring
- Configure error tracking (Sentry)
- Set up uptime monitoring (UptimeRobot)
- Configure log aggregation (Papertrail, Loggly)

### 3. Backup Strategy

```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="your_mongo_uri" --out=/backups/backup_$DATE
```

Add to crontab:

```bash
0 2 * * * /path/to/backup_script.sh
```

### 4. Performance Optimization

- Enable gzip compression in Nginx
- Set up CDN for static files
- Configure caching headers
- Enable MongoDB indexes
- Use Redis for session/cache (optional)

### 5. Security Hardening

```bash
# Fail2ban for SSH protection
sudo apt install fail2ban -y

# Configure automatic security updates
sudo apt install unattended-upgrades -y
```

## Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install --production

# Restart application
pm2 restart arbab-jewellers
```

### Database Maintenance

```bash
# Compact database
mongo your_database --eval "db.runCommand({ compact: 'collection_name' })"

# Rebuild indexes
mongo your_database --eval "db.collection.reIndex()"
```

### View Logs

```bash
# PM2 logs
pm2 logs arbab-jewellers

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
journalctl -u nginx -f
```

## Rollback Procedure

```bash
# Stop application
pm2 stop arbab-jewellers

# Revert to previous version
git checkout previous_commit_hash

# Install dependencies
npm install --production

# Restart
pm2 restart arbab-jewellers
```

## Troubleshooting

### Application Won't Start

1. Check logs: `pm2 logs`
2. Verify environment variables: `pm2 env 0`
3. Check MongoDB connection
4. Verify Node.js version

### 502 Bad Gateway

1. Check if application is running: `pm2 status`
2. Verify Nginx configuration: `sudo nginx -t`
3. Check application logs

### Email Not Sending

1. Verify email credentials in settings
2. Check spam/junk folders
3. Test with different email provider
4. Check firewall rules for SMTP port

### Database Connection Issues

1. Verify MongoDB is running
2. Check connection string
3. Verify IP whitelist in MongoDB Atlas
4. Check firewall rules

## Support

For deployment issues:

- Check logs first
- Review environment variables
- Verify all services are running
- Check firewall/security group settings

---

**Remember:** Always test in a staging environment before deploying to production!
