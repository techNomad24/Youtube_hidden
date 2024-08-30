let settings = {
    hideComments: true,
    hideSuggested: true,
    hidePlaylist: true,
    redirectSubscriptions: true
  };
  
  // Carica le impostazioni
  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(settings, (data) => {
        settings = { ...settings, ...data };
        resolve();
      });
    });
  }
  
  // Funzione per nascondere gli elementi
  function hideElements() {
    if (settings.hideSuggested) {
      const related = document.querySelector('#related');
      if (related) related.style.display = 'none';
    }
    
    if (settings.hideComments) {
      const comments = document.querySelector('#comments');
      if (comments) comments.style.display = 'none';
    }
    
    if (settings.hidePlaylist) {
      const playlist = document.querySelector('#playlist');
      if (playlist) playlist.style.display = 'none';
    }
  }
  
  // Funzione per reindirizzare alla pagina delle iscrizioni
  function redirectToSubscriptions() {
    if (settings.redirectSubscriptions && (window.location.pathname === '/' || window.location.pathname === '/home')) {
      window.location.href = '/feed/subscriptions';
    }
  }
  
  // Funzione principale che gestisce tutto
  function main() {
    hideElements();
    redirectToSubscriptions();
  }
  
  // Esegui all'avvio
  loadSettings().then(() => {
    main();
    
    // Osserva le modifiche al DOM
    const observer = new MutationObserver(() => {
      requestAnimationFrame(main);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
  
  // Ascolta i messaggi dal popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'settingsUpdated') {
      loadSettings().then(main);
    }
  });
  
  // Esegui main() periodicamente per assicurarsi che gli elementi rimangano nascosti
  setInterval(main, 1000);