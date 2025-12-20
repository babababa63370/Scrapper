# Web Scraper - Firefox Extension

A Firefox extension that captures HTML content from any webpage and stores it in a cloud dashboard.

## Features

- **Instant Scraping**: Click a button to capture the full HTML of any webpage
- **Cloud Dashboard**: View all scraped pages in a beautiful web interface
- **Search & Organize**: View raw HTML content with syntax highlighting
- **Customizable Server**: Configure which server to send scraped data to

## Quick Start

### 1. Setup Backend (Replit)

1. Create a new Replit project from this repository
2. The database is automatically provisioned
3. Run `npm run dev` to start the server (default: `http://localhost:5000`)

### 2. Install Firefox Extension

1. Open Firefox
2. Go to `about:debugging#/runtime/this-firefox`
3. Click **"Load Temporary Add-on"**
4. Navigate to the `extension/` folder in your project
5. Select `manifest.json`

### 3. Configure Extension (Optional)

1. Click the extension icon in your Firefox toolbar
2. Enter your server URL (e.g., `https://my-app.replit.dev`)
3. Click **Save**
4. By default, it uses `http://localhost:5000`

### 4. Use It!

1. Visit any website
2. Click the extension button
3. Page is scraped and saved to your dashboard
4. View it at your server URL

## API Endpoints

All endpoints are documented in `shared/routes.ts`:

- `GET /api/pages` - List all scraped pages
- `GET /api/pages/:id` - Get a specific page
- `POST /api/pages` - Save a new scraped page
- `DELETE /api/pages/:id` - Delete a page

## Deployment

### Deploy to Replit

1. Click the "Publish" button in Replit
2. Your app will get a URL like `https://my-scraper.replit.dev`
3. Update the extension settings with this URL

### Deploy to Other Hosts

1. Set the `DATABASE_URL` environment variable
2. Run `npm run build`
3. Run `npm run start` to start the production server
4. The app runs on the port specified by `PORT` env var (default: 5000)

### Environment Variables

Create a `.env` file based on `.env.example`:

```
DATABASE_URL=your_postgres_url
PORT=5000
NODE_ENV=production
```

## Project Structure

```
├── extension/           # Firefox extension files
│   ├── manifest.json   # Extension configuration
│   ├── popup.html      # Extension popup UI
│   └── popup.js        # Extension logic
├── server/             # Express backend
│   ├── routes.ts       # API endpoints
│   ├── storage.ts      # Database layer
│   └── db.ts           # Database connection
├── shared/             # Shared types & schemas
│   ├── schema.ts       # Database schema
│   └── routes.ts       # API contracts
├── client/             # React frontend
│   └── src/            # React components
└── package.json        # Dependencies
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Setup database
npm run db:push

# Build for production
npm run build

# Start production server
npm run start
```

## Security Notes

- The extension sends data to your configured server
- CORS is enabled for extension compatibility
- For production, consider:
  - Validating origin headers
  - Adding authentication
  - Rate limiting large HTML documents
  - Compressing stored HTML

## Troubleshooting

**Extension not working?**
- Check that the server URL is correct in extension settings
- Verify the server is running (`http://localhost:5000/health`)
- Check browser console for errors

**Can't load extension?**
- Ensure Firefox version is recent
- Reload the temporary add-on if code changes
- Check `about:debugging` for error messages

**Database errors?**
- Run `npm run db:push` to sync schema
- Check `DATABASE_URL` is set correctly

## License

MIT
