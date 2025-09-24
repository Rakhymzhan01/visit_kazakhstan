# 🚀 Visit Kazakhstan - Deployment Guide

## 📁 Project Structure
```
visit-kazakhstan/
├── backend/                 # Express.js + MongoDB backend
├── src/                    # Next.js frontend
├── docker-compose.yml      # MongoDB container
└── DEPLOYMENT-GUIDE.md     # This file
```

## 🗄️ Database Setup & Data Persistence

### Local Development

1. **Start MongoDB Container**
   ```bash
   docker-compose up -d mongodb
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Create Admin User**
   ```bash
   npm run create-admin
   ```

4. **Seed Blog Data** (Fixed Script)
   ```bash
   npm run seed-blogs
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

### 🔄 Data Persistence Solutions

#### 1. **Local Development (Current Setup)**
- ✅ **Already Configured**: Docker volume `mongodb_data:/data/db`
- ✅ **Persistent**: Data survives container restarts
- ✅ **Location**: Docker manages volume storage

#### 2. **Production Deployment Options**

##### Option A: **MongoDB Atlas (Recommended)**
```bash
# Update backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visit_kazakhstan_db

# Benefits:
- ✅ Fully managed cloud database
- ✅ Automatic backups
- ✅ Global replication
- ✅ Built-in security
- ✅ Free tier available
```

##### Option B: **Self-hosted with Persistent Volumes**
```yaml
# docker-compose.prod.yml
services:
  mongodb:
    image: mongo:7.0
    volumes:
      - /opt/mongodb/data:/data/db  # Host directory mapping
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
```

##### Option C: **VPS/Server Deployment**
```bash
# Install MongoDB directly on server
sudo apt-get install -y mongodb-org

# Configure persistent data directory
sudo mkdir -p /var/lib/mongodb
sudo chown mongodb:mongodb /var/lib/mongodb

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 🛠️ Fixed Blog Seeding Script

### Issue Resolution
- ❌ **Previous**: Script used Prisma syntax (incompatible)
- ✅ **Fixed**: New script uses Mongoose (compatible)
- ✅ **Features**: 
  - Creates 4 sample blog posts
  - Proper author assignment
  - SEO metadata
  - Featured images from your public directory

### Running the Script
```bash
cd backend
npm run seed-blogs
```

### Sample Data Created
1. **Welcome to Kazakhstan: Your Ultimate Travel Guide** (Featured)
2. **Mangystau: Kazakhstan's Mystical Desert Region**
3. **Kolsai Lakes: Kazakhstan's Alpine Paradise**
4. **Almaty: Where Modern Life Meets Mountain Beauty**

## 🚀 Deployment Steps

### Frontend (Vercel - Recommended)
```bash
# 1. Build the project
npm run build

# 2. Deploy to Vercel
npx vercel

# 3. Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (Railway/Heroku/DigitalOcean)

#### Railway Deployment
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway up

# 3. Set environment variables:
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
JWT_SECRET=your_jwt_secret
```

#### Heroku Deployment
```bash
# 1. Create Heroku app
heroku create visit-kazakhstan-api

# 2. Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set NODE_ENV=production

# 3. Deploy
git push heroku main
```

## 📊 Data Backup Strategy

### Automated Backups
```bash
# Create backup script
#!/bin/bash
mongodump --uri="your_mongodb_uri" --out="/backups/$(date +%Y%m%d_%H%M%S)"

# Schedule with cron (daily at 2 AM)
crontab -e
0 2 * * * /path/to/backup-script.sh
```

### Manual Backup
```bash
# Export specific collection
mongoexport --uri="mongodb://localhost:27017/visit_kazakhstan_db" --collection=blogposts --out=blogposts_backup.json

# Import backup
mongoimport --uri="mongodb://localhost:27017/visit_kazakhstan_db" --collection=blogposts --file=blogposts_backup.json
```

## 🔐 Security Considerations

### Environment Variables
```bash
# backend/.env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visit_kazakhstan_db
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGIN=https://your-frontend-domain.com
```

### MongoDB Security
- ✅ Enable authentication
- ✅ Use SSL/TLS connections
- ✅ Whitelist IP addresses
- ✅ Regular security updates

## 🔍 Troubleshooting

### Common Issues

1. **"Connection Refused" Error**
   ```bash
   # Check if MongoDB is running
   docker ps | grep mongo
   
   # Restart container
   docker-compose restart mongodb
   ```

2. **Blog Data Not Showing**
   ```bash
   # Check database connection
   cd backend
   npm run dev
   
   # Re-run seeding
   npm run seed-blogs
   ```

3. **Data Loss After Restart**
   ```bash
   # Verify volume mounting
   docker volume ls
   docker volume inspect visit-kazakhstan_mongodb_data
   ```

### Health Check Endpoints
```
GET /api/health          # Backend health
GET /api/blog           # Blog posts
GET /api/blog/count     # Total posts count
```

## 📝 Best Practices

### Development
- ✅ Use Docker for consistent environment
- ✅ Regular database backups
- ✅ Environment-specific configurations
- ✅ Database indexing for performance

### Production
- ✅ Use managed database services
- ✅ Implement proper monitoring
- ✅ Set up automated backups
- ✅ Use CDN for static assets
- ✅ Enable HTTPS everywhere

## 🔄 Migration Strategy

If you need to migrate existing data:

```bash
# 1. Export from old database
mongoexport --uri="old_db_uri" --collection=blogposts --out=migration.json

# 2. Transform data (if needed)
node migration-script.js

# 3. Import to new database
mongoimport --uri="new_db_uri" --collection=blogposts --file=migration.json
```

## 📞 Support

For deployment issues:
1. Check logs: `docker logs visit-kazakhstan-mongo`
2. Verify environment variables
3. Test database connectivity
4. Review this guide

Remember: Always test your deployment in a staging environment first! 🚀