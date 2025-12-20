// Configuration for the Firefox extension
// The API server URL is configurable and can be set by the user

const getServerUrl = async () => {
  return new Promise((resolve) => {
    browser.storage.sync.get(['serverUrl'], (result) => {
      // Default to current origin if no custom URL is set
      // This allows the extension to work on the same domain as the app
      resolve(result.serverUrl || window.location.origin);
    });
  });
};

const setServerUrl = (url) => {
  return browser.storage.sync.set({ serverUrl: url });
};
