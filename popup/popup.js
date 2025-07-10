document.getElementById('restoreBtn').onclick = () => chrome.runtime.sendMessage({ action: 'restore_tab' });
document.getElementById('flashBtn').onclick = () => loadFlashcard();
document.getElementById('toneBtn').onclick = () => chrome.storage.local.get('toneData', (data) => {
    document.getElementById('output').innerText = data.toneData || 'No tone insights available yet.';
});