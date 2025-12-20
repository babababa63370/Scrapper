# Firefox Extension - Web Scraper

This folder contains the Firefox extension files.

## Installation

### Development

1. Open `about:debugging#/runtime/this-firefox` in Firefox
2. Click **"Load Temporary Add-on"**
3. Select `manifest.json` in this folder
4. The extension will be installed

### Production

For a permanent installation, package the extension as `.xpi` and submit to Mozilla Add-ons.

## Configuration

The extension stores the server URL in browser local storage.

**Default:** Uses current domain (e.g., if app runs on `localhost:5000`, scrapes go there)

**Custom:** Click extension button → enter server URL → Save

## Files

- `manifest.json` - Extension configuration (Manifest v3)
- `popup.html` - Extension button UI
- `popup.js` - Scraping and submission logic
- `config.js` - Configuration helpers (optional)

## How It Works

1. User clicks extension button
2. Extension extracts HTML from active tab:
   - Full page HTML
   - Page title
   - Current URL
3. Sends POST request to `/api/pages` on configured server
4. Server stores in database
5. User can view in dashboard

## Permissions

- `activeTab` - Access current webpage
- `storage` - Store server URL preference
- `host_permissions` - Access any website (http/https)

## Security

- Only sends data on explicit user click
- Data sent to user-configured server
- No tracking or telemetry
- HTML stored on user's own server

## Troubleshooting

**Error: "Could not access page"**
- Extension may not work on some restricted pages (about:, data:, etc.)

**Error: "Server error"**
- Check server URL is correct
- Verify server is running
- Check CORS settings

**Data not appearing?**
- Check network tab for failed requests
- Verify server URL in extension settings
- Reload dashboard

## Advanced

To modify the extension:

1. Edit files in this folder
2. Go to `about:debugging#/runtime/this-firefox`
3. Find the extension and click **Reload**

For production distribution, see Mozilla's official documentation.
