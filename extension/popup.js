// Load saved server URL on popup open
document.addEventListener('DOMContentLoaded', async () => {
  const result = await browser.storage.sync.get(['serverUrl']);
  if (result.serverUrl) {
    document.getElementById('serverUrl').value = result.serverUrl;
  }
});

// Save server URL
document.getElementById('saveBtn').addEventListener('click', async () => {
  const url = document.getElementById('serverUrl').value.trim();
  
  if (!url) {
    showStatus('Please enter a URL', 'error');
    return;
  }
  
  try {
    new URL(url); // Validate URL format
    await browser.storage.sync.set({ serverUrl: url });
    showStatus('Server URL saved!', 'success');
  } catch (err) {
    showStatus('Invalid URL format', 'error');
  }
});

// Reset to default
document.getElementById('resetBtn').addEventListener('click', async () => {
  await browser.storage.sync.remove(['serverUrl']);
  document.getElementById('serverUrl').value = '';
  showStatus('Reset to default', 'info');
});

// Scrape page
document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  showStatus('Scraping...', 'info');
  
  try {
    // Get the active tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) {
      showStatus('Error: No active tab', 'error');
      return;
    }
    
    const tab = tabs[0];
    
    // Execute content script to get HTML using Manifest V3 API
    const results = await browser.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        return {
          html: document.documentElement.outerHTML,
          title: document.title,
          url: window.location.href
        };
      }
    });
    
    if (!results || !results[0] || !results[0].result) {
      showStatus('Error: Could not access page', 'error');
      return;
    }
    
    const data = results[0].result;
    
    // Get server URL from storage
    const config = await browser.storage.sync.get(['serverUrl']);
    let serverUrl = config.serverUrl || window.location.origin;
    
    // Ensure no trailing slash
    serverUrl = serverUrl.replace(/\/$/, '');
    const apiUrl = serverUrl + '/api/pages';
    
    // Send to server
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: data.url,
        title: data.title,
        htmlContent: data.html
      })
    });
    
    if (response.ok) {
      showStatus('Success! Saved to dashboard.', 'success');
      setTimeout(() => {
        // Open the dashboard in a new tab
        browser.tabs.create({ url: serverUrl });
      }, 1000);
    } else {
      const errorData = await response.json().catch(() => ({}));
      showStatus('Error: ' + (errorData.message || 'Server error'), 'error');
    }
  } catch (err) {
    console.error('Scraping error:', err);
    showStatus('Error: ' + err.message, 'error');
  }
});

// Download scraped data
document.getElementById('downloadBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  showStatus('Downloading...', 'info');
  
  try {
    // Get server URL from storage
    const config = await browser.storage.sync.get(['serverUrl']);
    let serverUrl = config.serverUrl || window.location.origin;
    
    // Ensure no trailing slash
    serverUrl = serverUrl.replace(/\/$/, '');
    const apiUrl = serverUrl + '/api/pages';
    
    // Fetch all scraped pages
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      showStatus('Error: Could not fetch data', 'error');
      return;
    }
    
    const pages = await response.json();
    
    // Create JSON file
    const dataStr = JSON.stringify(pages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `scraped-pages-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showStatus(`Downloaded ${pages.length} pages!`, 'success');
  } catch (err) {
    console.error('Download error:', err);
    showStatus('Error: ' + err.message, 'error');
  }
});

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = type;
}
