let settings = {
    hideComments: true,
    hideSuggested: true,
    hidePlaylist: true,
    redirectSubscriptions: true,
    hideShorts: true  // Nuova opzione per nascondere gli Shorts
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
  
    if (settings.hideShorts) {
      // Nascondi gli Shorts nella home page
      const shortsSection = document.querySelector('ytd-rich-section-renderer');
      if (shortsSection) shortsSection.style.display = 'none';
  
      // Nascondi gli Shorts nella barra laterale
      const shortsSidebar = document.querySelector('ytd-guide-section-renderer #items ytd-guide-entry-renderer a[title="Shorts"]');
      if (shortsSidebar) shortsSidebar.closest('ytd-guide-entry-renderer').style.display = 'none';
  
      // Nascondi gli Shorts nei risultati di ricerca e nei video suggeriti
      const shortsResults = document.querySelectorAll('ytd-video-renderer a[href^="/shorts/"]');
      shortsResults.forEach(short => {
        const shortContainer = short.closest('ytd-video-renderer');
        if (shortContainer) shortContainer.style.display = 'none';
      });
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