// Configuration for the Firefox extension
// The API server URL is configurable and can be set by the user

const getServerUrl = async () => {
  const result = await browser.storage.sync.get('serverUrl');
  // Default to current origin if no custom URL is set
  // This allows the extension to work on the same domain as the app
  return result.serverUrl || window.location.origin;
};

const setServerUrl = async (url) => {
  return await browser.storage.sync.set({ serverUrl: url });
};
