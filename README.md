# JD Emirates Auction Bot - React WebApp v2

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/jd-emirates-auction-bot/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/jd-emirates-auction-bot/actions/workflows/deploy.yml)

🚀 **Live Demo**: [https://YOUR_USERNAME.github.io/jd-emirates-auction-bot/](https://YOUR_USERNAME.github.io/jd-emirates-auction-bot/)

A modern, scalable React-based Telegram WebApp for the JD Emirates vehicle auction system.

## Features

- 🚗 Browse active vehicle auctions
- 🔍 Search and filter vehicles by brand and price
- ❤️ Manage favorite vehicles
- 💰 Place bids on vehicles (approved users only)
- 👤 User profile management
- 📊 View bidding history
- 🌓 Dark/Light theme support based on Telegram theme
- 📱 Fully responsive design
- ⚡ Real-time updates

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Zustand** for state management
- **React Query** for server state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **React Hot Toast** for notifications

## Prerequisites

- Node.js 16+ and npm/yarn
- WordPress backend with JD Emirates Auction Bot plugin installed
- Telegram Bot Token configured in WordPress

## Installation

1. Clone the repository:
```bash
cd webapp-2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://your-wordpress-site.com/wp-json/jd-auction/v1
```

4. Update the proxy configuration in `vite.config.ts` if needed:
```typescript
proxy: {
  '/wp-json': {
    target: 'http://your-wordpress-site.com',
    changeOrigin: true,
    secure: false,
  }
}
```

## Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

## Building for Production

1. Build the project:
```bash
npm run build
# or
yarn build
```

2. Preview the production build:
```bash
npm run preview
# or
yarn preview
```

3. The built files will be in the `dist` directory.

## Deployment

### 🚀 GitHub Pages (Automatic)

This project is automatically deployed to GitHub Pages using GitHub Actions:

1. **Push to main branch** - Deployment triggers automatically
2. **Access your site** at `https://YOUR_USERNAME.github.io/jd-emirates-auction-bot/`
3. **Configure repository settings**:
   - Go to repository Settings > Pages
   - Set Source to "GitHub Actions"

### Manual Deployment Options

#### Option 1: Serve from WordPress

1. Build the project
2. Copy the contents of `dist` folder to your WordPress plugin directory:
   ```
   wp-content/plugins/jd-emirates-auction-bot/webapp-2/
   ```
3. Update the WordPress plugin to serve the React app

#### Option 2: Other Static Hosting

1. Build the project
2. Deploy the `dist` folder to any static hosting service (Vercel, Netlify, etc.)
3. Configure CORS on your WordPress backend to allow requests from your webapp domain

## Project Structure

```
webapp-2/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── cards/      # Card components
│   │   ├── modals/     # Modal components
│   │   └── tabs/       # Tab content components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── store/          # Zustand store
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── tailwind.config.js  # Tailwind config
```

## Key Components

- **App.tsx**: Main application component with error boundary
- **useAppStore**: Global state management with Zustand
- **useTelegram**: Hook for Telegram WebApp integration
- **api.ts**: API client with retry logic and error handling
- **LotCard**: Vehicle card component with animations
- **BidModal**: Modal for placing bids
- **Toast**: Notification system

## Features Implementation

### Authentication
- Uses Telegram WebApp authentication
- Automatically registers new users
- Handles user status (pending, approved, rejected, blocked)

### State Management
- Global state with Zustand
- Persisted favorites and filters
- React Query for server state

### Performance
- Lazy loading of images
- Debounced search
- Virtual scrolling ready
- Code splitting

### Security
- XSS protection with text sanitization
- Rate limiting on API calls
- Secure bid validation

## Debugging

Enable debug mode by adding `?debug=true` to the URL or running in development mode.

Access debug logs in console:
```javascript
window.debugLogger.downloadHistory()
```

## Testing the WebApp

1. Create a Telegram Bot
2. Set up the WebApp URL in BotFather
3. Open the bot and click the WebApp button
4. The app will automatically receive user data from Telegram

## Troubleshooting

### "Not in Telegram WebApp environment" error
- The app must be opened through Telegram
- Use ngrok or similar for local testing with HTTPS

### API Connection Issues
- Check the API URL in environment variables
- Verify CORS settings on WordPress
- Check WordPress REST API is enabled

### Build Issues
- Clear node_modules and reinstall
- Check Node.js version (16+ required)
- Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the JD Emirates Auction Bot WordPress plugin.
