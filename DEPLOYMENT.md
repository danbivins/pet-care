# 🚀 Deployment Guide - PetCareLocal

This guide covers deploying PetCareLocal to various platforms with all necessary configurations.

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database setup and migrations run
- [ ] Google Places API key obtained and tested
- [ ] Site URL updated in environment
- [ ] Analytics tracking configured
- [ ] Error monitoring setup

## 🌐 Netlify Deployment (Recommended)

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed and pushed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Netlify Configuration

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select `danbivins/pet-care` repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (if using)

3. **Environment Variables**
   ```env
   DATABASE_URL=your_production_database_url
   GOOGLE_PLACES_API_KEY=your_api_key
   GOOGLE_MAPS_API_KEY=your_api_key  
   NEXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
   NEXT_PUBLIC_APP_NAME=PetCareLocal
   ```

### Step 3: Domain Configuration
- **Custom Domain**: Add your custom domain in Site settings > Domain management
- **HTTPS**: Automatically enabled by Netlify
- **Redirects**: Configure in `netlify.toml` for SPA routing

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/petcare
      - GOOGLE_PLACES_API_KEY=your_key
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: petcare
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## ☁️ Vercel Deployment

### Automatic Deployment
1. Connect repository to [Vercel](https://vercel.com)
2. Configure environment variables
3. Deploy automatically on push to main

### Manual Deployment
```bash
npm install -g vercel
vercel
vercel --prod
```

## 🗄️ Database Setup

### PostgreSQL on Railway
1. Create account at [Railway](https://railway.app)
2. Create new PostgreSQL database
3. Copy connection string to `DATABASE_URL`
4. Run migrations: `npx prisma migrate deploy`

### Supabase Database
1. Create project at [Supabase](https://supabase.com)
2. Get connection string from Settings > Database
3. Enable Row Level Security if needed
4. Run migrations

## 🔑 API Keys Setup

### Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Places API and Maps JavaScript API
3. Create API key with restrictions:
   - **Application restrictions**: HTTP referrers
   - **API restrictions**: Places API, Maps JavaScript API
   - **Allowed referrers**: Your domain(s)

### Analytics Setup
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🔒 Security Configuration

### Content Security Policy
```javascript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com;
  child-src *.google.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' *.gstatic.com;
`;
```

### Environment Security
- Never commit `.env` files
- Use strong secrets for production
- Rotate API keys regularly
- Enable 2FA on all accounts

## 📊 Monitoring & Analytics

### Error Tracking with Sentry
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring
- **Core Web Vitals**: Built into Next.js
- **Vercel Analytics**: Automatic with Vercel deployment
- **Google PageSpeed Insights**: Monitor regularly

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Netlify
        uses: netlify/actions/build@master
        with:
          publish-dir: .next
```

## 🔧 Post-Deployment

### DNS Configuration
- **A Record**: Point to deployment IP
- **CNAME**: www subdomain to main domain
- **MX Records**: Email if using custom domain

### SSL Certificate
- Automatically handled by Netlify/Vercel
- Custom certificates for advanced setups

### Performance Optimization
```bash
# Test performance
npm run build
npm run start
lighthouse http://localhost:3000
```

## 🐛 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**API Key Issues**
- Verify API key restrictions
- Check billing account status
- Ensure APIs are enabled

**Database Connection**
- Verify connection string format
- Check firewall settings
- Confirm database user permissions

### Health Check Endpoint
```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
}
```

## 📈 Scaling Considerations

### CDN Configuration
- Static assets via CDN
- Image optimization
- API response caching

### Database Optimization
- Connection pooling
- Read replicas for high traffic
- Query optimization

### Caching Strategy
- Redis for session storage
- API response caching
- Static generation for blog posts

---

For additional support, refer to the main README or open an issue on GitHub.
