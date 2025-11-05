# GitHub Pages Deployment Guide

This project is fully configured for GitHub Pages deployment with multiple deployment options.

## 🚀 Quick Start (Recommended)

### Automatic Deployment via GitHub Actions
1. **Push to main branch**: `git push origin main`
2. **Wait for deployment**: GitHub Actions will automatically build and deploy
3. **Visit your site**: `https://[username].github.io/crackle-date-2/`

That's it! Your site is now live.

## 📋 Manual Deployment Options

### Option 1: Using Deployment Script
```bash
npm run deploy:prepare
git add docs
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Option 2: Using Simple Deploy Script
```bash
npm run deploy
```

### Option 3: Manual Upload
```bash
npm run build
# Upload docs/ folder via GitHub Pages settings
```

## ⚙️ Configuration Details

### Vite Configuration (`vite.config.ts`)
- **Output Directory**: `docs/` (GitHub Pages standard)
- **Base Path**: `./` (relative for flexible repository names)
- **SPA Support**: Includes `404.html` for client-side routing
- **Build Inputs**: Both `index.html` and `404.html`

### GitHub Actions (`.github/workflows/deploy.yml`)
- **Trigger**: Push to `main` branch or manual workflow dispatch
- **Steps**: Install → Test → Lint → Build → Deploy
- **Permissions**: Configured for Pages deployment
- **Artifacts**: Uploads `docs/` directory

### Files Included in Build
- ✅ `index.html` - Main application
- ✅ `404.html` - SPA routing fallback
- ✅ `manifest.json` - PWA manifest
- ✅ All static assets (CSS, JS, fonts, icons)
- ✅ KaTeX mathematical fonts and styles

## 🔧 Troubleshooting

### Site Not Loading
- Check that GitHub Pages is enabled in repository settings
- Verify the source branch is set to `main`
- Ensure the source directory is `/ (root)`

### 404 Errors on Refresh
- The `404.html` should handle SPA routing
- Make sure your GitHub Pages source is set to deploy from `/ (root)`

### Build Failures
- Run `npm run deploy:prepare` locally for detailed error messages
- Check that all dependencies are installed: `npm install`
- Verify Node.js version 18+ is installed

### Assets Not Loading
- Check that base path is relative (`./`) in vite.config.ts
- Verify asset paths in built `index.html`
- Ensure all files are in the `docs/` directory

## 🌐 Deployment URLs

After deployment, your site will be available at:
- **GitHub Pages**: `https://[username].github.io/crackle-date-2/`
- **Custom Domain**: Configure in repository settings if needed

## 📱 PWA Features

The deployed site includes PWA capabilities:
- ✅ Installable on mobile devices
- ✅ Works offline (basic functionality)
- ✅ App-like experience on iOS/Android
- ✅ Proper manifest and service worker

## 🔄 Continuous Deployment

Every push to `main` branch triggers:
1. **Automated Testing**: Runs test suite (if tests exist)
2. **Code Quality**: ESLint and Stylelint checks
3. **Build Process**: TypeScript compilation + Vite build
4. **Automatic Deployment**: Pushes to GitHub Pages
5. **Live Updates**: Site updates automatically

## 📊 Monitoring

- **GitHub Actions**: Check Actions tab for deployment status
- **Build Logs**: Detailed logs in GitHub Actions workflow
- **Error Handling**: Failed deployments show detailed error messages

---

**Need help?** Check the [main README](../README.md) for full project documentation.