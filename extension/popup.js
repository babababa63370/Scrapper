document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = 'Scraping...';
  
  // Execute script in active tab to get HTML
  browser.tabs.executeScript({
    code: '({ html: document.documentElement.outerHTML, title: document.title, url: window.location.href })'
  }).then(async (results) => {
    if (!results || !results[0]) {
      statusDiv.textContent = 'Error: No content found';
      return;
    }

    const data = results[0];
    const serverUrl = 'http://localhost:5000/api/pages'; // Default dev URL

    try {
      const response = await fetch(serverUrl, {
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
        statusDiv.textContent = 'Success! Saved to dashboard.';
      } else {
        statusDiv.textContent = 'Error saving to server.';
      }
    } catch (err) {
      statusDiv.textContent = 'Error: Is server running?';
      console.error(err);
    }
  }).catch(err => {
    statusDiv.textContent = 'Error: ' + err.message;
  });
});
