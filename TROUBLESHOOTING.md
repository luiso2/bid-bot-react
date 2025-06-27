# Troubleshooting Guide

## Common Issues and Solutions

### PostCSS Configuration Error

If you encounter the error:
```
Failed to load PostCSS config: Unexpected token 'export'
```

**Solution:**
The project now uses `postcss.config.cjs` with CommonJS syntax. Make sure you have:
- Deleted or renamed the old `postcss.config.js` file
- The `postcss.config.cjs` file exists with `module.exports` syntax

### Module Resolution Issues

If you have TypeScript or module resolution errors:

1. **Clean install dependencies:**
   ```bash
   # Windows
   clean-install.bat
   
   # Linux/Mac
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

2. **Check Node.js version:**
   - Required: Node.js 16+ (Recommended: 18.17.0)
   - Check version: `node -v`
   - If using nvm: `nvm use`

### Environment Variables Not Working

1. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

2. Update with your API URL:
   ```
   VITE_API_URL=http://your-wordpress-site.com/wp-json/jd-auction/v1
   ```

3. Restart the dev server after changing .env

### Build Errors

1. **Type checking errors:**
   ```bash
   npm run type-check
   ```

2. **ESLint errors:**
   ```bash
   npm run lint
   ```

3. **Clean build:**
   ```bash
   npm run clean
   npm run build
   ```

### API Connection Issues

1. **Check CORS:**
   - WordPress must allow requests from your dev server origin
   - Add to WordPress `.htaccess` or use a CORS plugin

2. **Check API URL:**
   - Verify the API URL in `.env` is correct
   - Test API directly: `curl http://your-site.com/wp-json/jd-auction/v1/lots`

3. **Proxy configuration:**
   - Update `vite.config.ts` proxy target to match your WordPress URL

### Telegram WebApp Not Working

1. **HTTPS Required:**
   - Telegram WebApps require HTTPS
   - Use ngrok for local testing: `ngrok http 3000`

2. **Check initialization:**
   - Open browser console
   - Look for "Telegram WebApp initialized" message
   - Check for `window.Telegram.WebApp` object

### Performance Issues

1. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   ```

2. **Disable source maps in production:**
   ```bash
   VITE_SOURCEMAP=false npm run build
   ```

3. **Check bundle size:**
   ```bash
   npm run build -- --report
   ```

## Getting Help

1. Check browser console for errors
2. Run in debug mode: Add `?debug=true` to URL
3. Export debug logs: `window.debugLogger.downloadHistory()`
4. Check the WordPress plugin logs
5. Verify Telegram Bot configuration in WordPress

## Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Clean everything
npm run clean

# Fresh install (Windows)
clean-install.bat
```
