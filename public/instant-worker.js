// Instant Mode Background Worker
// This worker runs in the background to monitor clipboard changes
// even when the Pencil tab is not active

let isMonitoring = false;
let lastClipboardContent = '';
let apiEndpoint = '';

// Listen for messages from the main thread
self.addEventListener('message', function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'START_MONITORING':
      isMonitoring = true;
      apiEndpoint = data.apiEndpoint;
      startClipboardMonitoring();
      break;
      
    case 'STOP_MONITORING':
      isMonitoring = false;
      stopClipboardMonitoring();
      break;
      
    case 'UPDATE_SETTINGS':
      // Update monitoring settings
      break;
  }
});

// Clipboard monitoring function
async function startClipboardMonitoring() {
  if (!isMonitoring) return;
  
  try {
    // Check if we have clipboard access
    if (navigator.clipboard && navigator.permissions) {
      const permission = await navigator.permissions.query({ name: 'clipboard-read' });
      
      if (permission.state === 'granted') {
        const text = await navigator.clipboard.readText();
        
        // Only process if content has changed
        if (text && text !== lastClipboardContent && text.length > 0) {
          lastClipboardContent = text;
          
          // Send clipboard content to main thread
          self.postMessage({
            type: 'CLIPBOARD_CHANGED',
            data: {
              content: text,
              timestamp: Date.now()
            }
          });
          
          // Optionally process immediately in worker
          if (apiEndpoint) {
            processInstantRequest(text);
          }
        }
      }
    }
  } catch (error) {
    console.error('Clipboard monitoring error:', error);
  }
  
  // Continue monitoring with faster polling
  if (isMonitoring) {
    setTimeout(startClipboardMonitoring, 500); // Check every 500ms for faster response
  }
}

function stopClipboardMonitoring() {
  isMonitoring = false;
  lastClipboardContent = '';
}

// Process instant AI request in worker using Gemini
async function processInstantRequest(content) {
  try {
    const response = await fetch('/api/instant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        source: 'clipboard'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Send result back to main thread
      self.postMessage({
        type: 'INSTANT_RESPONSE',
        data: {
          content: data.content,
          timestamp: Date.now(),
          source: 'clipboard',
          model: data.model || 'gemini-1.5-flash',
          processingTime: data.processingTime
        }
      });
    }
  } catch (error) {
    console.error('Instant processing error:', error);
  }
}

// Initialize worker
console.log('Instant Mode Worker initialized');
