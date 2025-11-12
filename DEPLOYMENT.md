# SafeConnect Deployment Guide

This guide covers deploying SafeConnect for the hackathon demo and beyond.

## 🎯 Quick Deployment Options

### Option 1: Vercel (Recommended for Frontend)

**Pros:** Free, fast, automatic HTTPS, custom domains
**Best for:** Quick hackathon demos

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow prompts:**
   - Link to existing project? No
   - What's your project name? safeconnect
   - Which directory is your code in? ./
   - Detected framework? Yes (Vite)
   - Build command? npm run build
   - Output directory? dist

4. **Set environment variables**
   ```bash
   vercel env add VITE_MAPBOX_TOKEN
   vercel env add VITE_SIGNALING_HOST
   ```

5. **Redeploy with env vars**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

**Pros:** Free tier, drag-and-drop, form handling
**Best for:** Simple static hosting

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm i -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

   **OR drag-and-drop:**
   - Go to https://app.netlify.com/drop
   - Drag the `dist` folder
   - Done!

3. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add `VITE_MAPBOX_TOKEN` and `VITE_SIGNALING_HOST`

### Option 3: GitHub Pages

**Pros:** Free, integrated with GitHub
**Best for:** Project showcases

1. **Update vite.config.js**
   ```javascript
   export default {
     base: '/SafeConnect-EHCOpenHack/',
     // ... rest of config
   }
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy via gh-pages**
   ```bash
   npm i -g gh-pages
   gh-pages -d dist
   ```

4. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Source: gh-pages branch
   - Save

### Option 4: Render

**Pros:** Free tier, supports backend + frontend
**Best for:** Full-stack deployment

#### Frontend:
1. Create new Static Site on Render
2. Connect your GitHub repo
3. Build command: `cd frontend && npm install && npm run build`
4. Publish directory: `frontend/dist`

#### Backend:
1. Create new Web Service on Render
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## 🔒 Backend Deployment (Signaling Server)

### Railway (Recommended)

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Get public URL**
   ```bash
   railway domain
   ```

4. **Update frontend env**
   - Set `VITE_SIGNALING_HOST` to Railway URL

### Heroku

1. **Create Procfile**
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

2. **Deploy**
   ```bash
   heroku create safeconnect-signaling
   git push heroku main
   ```

### Render (Backend)

1. Go to Render Dashboard
2. New → Web Service
3. Connect repository
4. Settings:
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## 📱 PWA Deployment Checklist

- [ ] Generate proper icons (192x192 and 512x512)
- [ ] Test manifest.json is accessible
- [ ] Verify service worker registration
- [ ] Test offline functionality
- [ ] Enable HTTPS (required for PWA)
- [ ] Test "Add to Home Screen" on mobile

## 🎥 Demo Hosting for Hackathon

### For Video Demos:

1. **Deploy to Vercel/Netlify** (easiest)
2. **Record using:**
   - Loom (screen recording)
   - OBS Studio (free, professional)
   - Zoom (with screen share)

3. **Upload to:**
   - YouTube (unlisted/public)
   - Vimeo
   - Google Drive (with public link)

### Live Demo Tips:

1. **Use ngrok for local testing**
   ```bash
   ngrok http 5173
   ```
   Share the HTTPS URL with judges

2. **Have backup recording**
   - Always record a backup video
   - Keep it under 3 minutes

3. **Test on multiple devices**
   - Desktop browser
   - Mobile browser
   - PWA installed version

## 🚀 Production Considerations

### Security
- [ ] Add rate limiting
- [ ] Implement authentication
- [ ] Encrypt P2P messages
- [ ] Sanitize user inputs
- [ ] Add CORS configuration

### Performance
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Code splitting
- [ ] Lazy load components
- [ ] Cache API responses

### Monitoring
- [ ] Add error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring (Web Vitals)

## 🧪 Pre-Deployment Testing

```bash
# Build and test production build locally
cd frontend
npm run build
npm run preview

# Test service worker
# Open DevTools → Application → Service Workers

# Test offline mode
# DevTools → Network → Offline checkbox

# Test on mobile
# Use Chrome DevTools device emulation
```

## 📊 Environment Variables Summary

### Frontend (.env)
```
VITE_MAPBOX_TOKEN=pk.your_token_here
VITE_SIGNALING_HOST=your-backend-url.com
```

### Backend (if using)
```
ALLOWED_ORIGINS=https://your-frontend-url.com,http://localhost:5173
```

## 🎯 Hackathon-Specific Tips

1. **Deploy early** - Don't wait until last minute
2. **Use free tiers** - No need to pay for demos
3. **Keep it simple** - Static hosting is often enough
4. **Have backups** - Deploy to 2 platforms if possible
5. **Test sharing** - Make sure judges can access your live link
6. **Document deployment** - Add live link to README

## 🔗 Deployment URLs Template

Add this to your README after deployment:

```markdown
## 🌐 Live Demo

- **Frontend:** https://safeconnect.vercel.app
- **Backend:** https://safeconnect-backend.railway.app
- **Demo Video:** https://youtu.be/your-video-id
- **GitHub:** https://github.com/yourusername/SafeConnect-EHCOpenHack
```

## 🆘 Troubleshooting Deployment

### Build Fails
- Check Node version (use 18+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Environment Variables Not Working
- Rebuild after adding env vars
- Check variable names (must start with VITE_)
- Restart dev server

### Service Worker Not Updating
- Clear browser cache
- Unregister old service worker
- Change CACHE_NAME version in sw.js

### CORS Errors
- Add frontend URL to backend ALLOWED_ORIGINS
- Use proper HTTPS URLs
- Check WebSocket connection URLs

## 📝 Deployment Checklist

Before submitting:

- [ ] Frontend deployed and accessible
- [ ] Backend deployed (if using)
- [ ] All environment variables set
- [ ] PWA icons generated
- [ ] Service worker working
- [ ] HTTPS enabled
- [ ] Mobile responsive tested
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Demo video uploaded
- [ ] GitHub repo public and documented
- [ ] Live demo link in README
- [ ] All features working in production

---

Good luck with your hackathon submission! 🚀
