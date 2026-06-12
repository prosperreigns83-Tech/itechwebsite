# ITECH Store - Deployment Guide

## ✅ What's Ready for Production

- ✅ Full product catalog system with database
- ✅ Shopping cart and checkout functionality
- ✅ User accounts and authentication
- ✅ Email notifications (SendGrid integrated)
- ✅ Admin panel for product management
- ✅ Password visibility toggle for security
- ✅ Payment receipt with customer data
- ✅ Multi-source product support

---

## 🚀 Quick Start - Deploy in 5 Minutes

### **Option 1: Deploy Backend to Railway (Recommended - Easiest)**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub
   - Create new project

2. **Connect Your GitHub**
   - Push code to GitHub
   - Connect Railway to your repo
   - Select `/server` directory

3. **Set Environment Variables in Railway Dashboard**
   ```
   SENDGRID_API_KEY=your_key_here
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=your-railway-database.railway.app
   DB_NAME=itech_store
   COMPANY_EMAIL=your-email@gmail.com
   JWT_SECRET=random_secret_here
   ADMIN_PASSWORD=strong_password
   NODE_ENV=production
   ```

4. **Deploy Frontend to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repo
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Set environment variable:
     ```
     VITE_API_URL=https://your-railway-backend.railway.app
     ```

5. **Update Frontend API URL**
   - In `src/utils/productApi.js`, change:
   ```javascript
   const API_BASE = process.env.VITE_API_URL || 'http://localhost:4000/api';
   ```

---

### **Option 2: Deploy Backend to Render (Also Easy)**

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Select `/server` directory
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables (same as above)

---

### **Option 3: Deploy to Heroku (Classic)**

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set variables:
   ```bash
   heroku config:set SENDGRID_API_KEY=your_key
   heroku config:set DB_HOST=your_cloud_database.com
   ```
5. Deploy: `git push heroku main`

---

## 📋 Pre-Deployment Checklist

### **Before You Deploy:**

- [ ] **Update .env files with production secrets**
  ```bash
  # Don't use localhost - use cloud database
  DB_HOST=your-cloud-database-url.com
  ```

- [ ] **Change all hardcoded credentials**
  - Admin password
  - JWT secret (use strong random string)
  - API keys

- [ ] **Set up PostgreSQL Database in Cloud**
  - Railway: Automatically created
  - AWS RDS, Google Cloud SQL, Azure Database, etc.
  - Make sure to note connection details

- [ ] **Update CORS in backend**
  ```javascript
  // In server/index.js
  app.use(cors({
    origin: ['https://your-frontend-domain.com', 'https://your-backend-domain.com'],
    credentials: true
  }));
  ```

- [ ] **Build Frontend**
  ```bash
  npm run build
  ```

- [ ] **Test locally with production environment**
  ```bash
  NODE_ENV=production npm start
  ```

---

## 🔐 Security Checklist

- [ ] **NEVER commit .env files** (already in .gitignore)
- [ ] **Change ADMIN_PASSWORD** from "itechadmin"
- [ ] **Generate new JWT_SECRET** - use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] **Use HTTPS everywhere** - hosting platforms do this automatically
- [ ] **Regenerate API keys** after pushing to production
- [ ] **Set NODE_ENV=production** in backend
- [ ] **Remove console.logs** from production code

---

## 📊 Database Setup

### **PostgreSQL Cloud Options:**

1. **Railway** (Easiest)
   - Auto-creates database
   - Free tier available
   - Easy connection string

2. **AWS RDS**
   - Industry standard
   - More expensive
   - Better for large scale

3. **Google Cloud SQL**
   - Good pricing
   - Secure connections
   - Integration with other GCP services

4. **Railway Alternative Providers**
   - Render
   - PlanetScale (for MySQL)
   - Supabase (PostgreSQL + Auth)

### **Run Database Migrations**

After connecting to cloud database:
```bash
# In server/index.js, it will auto-create tables on startup
# Just start the server and it initializes the schema
npm start
```

---

## 🚢 Production Deployment Steps

### **Step 1: Backend Deployment**

```bash
# Build and test
npm run build
npm start

# Deploy to your chosen platform
# (Follow platform-specific instructions above)
```

### **Step 2: Frontend Deployment**

```bash
# Build
npm run build

# Deploy dist/ folder
# - Vercel (auto from GitHub)
# - Netlify (drag & drop dist/)
# - Your own server (nginx/Apache)
```

### **Step 3: Update Configuration**

In your frontend `.env` or `.env.production`:
```
VITE_API_URL=https://your-production-api.com
```

---

## ✅ Post-Deployment Testing

After deploying:

1. **Test API Endpoints**
   ```bash
   curl https://your-backend.com/api/products
   ```

2. **Test Frontend**
   - Visit your frontend URL
   - Add products to cart
   - Test checkout
   - Test login/registration

3. **Test Email Sending**
   - Create account
   - Trigger password reset
   - Check inbox for email

4. **Test Database**
   - Admin panel: add/edit/delete products
   - Verify changes persist

---

## 📞 Support & Monitoring

### **Monitor Your App**

- **Railway**: Built-in logs and monitoring
- **Vercel**: Analytics and error tracking
- **Render**: Log viewer
- **Heroku**: Heroku logs command

### **Common Issues & Fixes**

**"Connection refused" error**
- Check database connection string
- Verify database is running
- Check firewall rules

**"CORS error"**
- Update CORS origin in backend
- Verify frontend URL is in whitelist

**"Email not sending"**
- Check SENDGRID_API_KEY is set
- Verify sender email is verified in SendGrid
- Check SendGrid account has credits

**"Database not initializing"**
- Run migrations manually if needed
- Check PostgreSQL version compatibility

---

## 🎯 Next Steps

1. Choose your hosting platform (I recommend Railway + Vercel)
2. Create accounts on chosen platforms
3. Set up environment variables with production secrets
4. Push code to GitHub
5. Connect platforms to GitHub repo
6. Deploy and test
7. Update DNS (if using custom domain)

---

## 📞 Quick Deployment Commands

```bash
# Test production build locally
npm run build
NODE_ENV=production npm start

# Push to GitHub
git add .
git commit -m "Production ready"
git push origin main

# That's it! Most platforms auto-deploy from GitHub
```

---

**Your site is 95% ready! Just need to:**
1. Set up cloud database
2. Deploy backend
3. Deploy frontend
4. Update API URL in frontend
5. Test everything

Good luck! 🚀
