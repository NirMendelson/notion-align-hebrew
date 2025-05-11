document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('enabled');
    const status = document.getElementById('status');

    // Load saved state
    chrome.storage.sync.get(['enabled'], (result) => {
        toggle.checked = result.enabled !== false;
        updateStatus(toggle.checked);
    });

    // Handle toggle changes
    toggle.addEventListener('change', () => {
        const enabled = toggle.checked;
        chrome.storage.sync.set({ enabled });
        updateStatus(enabled);

        // Notify content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle', enabled });
        });
    });
});

function updateStatus(enabled) {
    const status = document.getElementById('status');
    status.textContent = enabled ? 'Extension is active' : 'Extension is disabled';
    status.style.color = enabled ? '#4CAF50' : '#666';
} 