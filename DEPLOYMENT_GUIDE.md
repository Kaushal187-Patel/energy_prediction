# 🚀 Energy Prediction Project - Deployment Guide

## Quick Deployment Steps

### 1. Push to GitHub
```bash
# Run the deployment script
deploy.bat
```

### 2. Enable GitHub Pages
1. Go to your repository: https://github.com/Kaushal187-Patel/energy_prediction
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Your site will be available at: `https://kaushal187-patel.github.io/energy_prediction/`

### 3. Alternative Deployment Options

#### Option A: Vercel (Recommended for Full-Stack)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Deploy automatically

#### Option B: Netlify (Frontend Only)
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. New site from Git
4. Select your repository
5. Build settings are auto-configured

#### Option C: Railway (Backend + Database)
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub
3. Add PostgreSQL database
4. Set environment variables

## Environment Variables for Production

Create these environment variables in your deployment platform:

```env
# Database
DATABASE_URL=your_production_database_url
JWT_SECRET=your_jwt_secret_key

# Email Alerts
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Weather API
WEATHER_API_KEY=your_openweather_api_key

# ML Model Settings
MODEL_RETRAIN_INTERVAL=7
PREDICTION_CONFIDENCE_THRESHOLD=0.8
```

## Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] All pages are accessible
- [ ] API endpoints work (if backend deployed)
- [ ] Database connections established
- [ ] Environment variables configured
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured (optional)

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version (use 18.x)
2. **404 errors**: Verify base path in vite.config.ts
3. **API errors**: Check CORS settings and environment variables
4. **Database issues**: Verify connection string and credentials

### Support:
- GitHub Issues: Create an issue in your repository
- Documentation: Check README.md for detailed setup
- Community: Join our Discord/Slack for help

## Live Demo
Once deployed, your website will be available at:
- **GitHub Pages**: https://kaushal187-patel.github.io/energy_prediction/
- **Vercel**: https://energy-prediction-[random].vercel.app
- **Netlify**: https://[site-name].netlify.app

Happy Deploying! 🎉