document.addEventListener('DOMContentLoaded', () => {
    const settings = ['hideComments', 'hideSuggested', 'hidePlaylist', 'redirectSubscriptions'];
    
    // Carica le impostazioni salvate
    settings.forEach(setting => {
      chrome.storage.sync.get(setting, (data) => {
        document.getElementById(setting).checked = data[setting] !== false;
      });
    });
  
    // Salva le impostazioni quando cambiano
    settings.forEach(setting => {
      document.getElementById(setting).addEventListener('change', (event) => {
        chrome.storage.sync.set({ [setting]: event.target.checked });
        // Notifica il content script del cambiamento
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'settingsUpdated' });
        });
      });
    });
  });