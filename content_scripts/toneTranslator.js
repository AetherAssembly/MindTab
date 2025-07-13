let toneConfig = null;
loadToneConfig().then(config => { toneConfig = config; });

document.addEventListener("mouseup", () => {
  const selection = window.getSelection().toString();
  if (selection.length > 0 && toneConfig) {
    showToneSuggestions(selection);
  }
});

document.addEventListener("input", (e) => {
  if ((e.target.tagName === "TEXTAREA" || e.target.isContentEditable) && toneConfig) {
    const text = e.target.value || e.target.innerText;
    const suggestions = classifyTone(text, toneConfig);
    renderSuggestions(suggestions, e.target);
  }
});

function showToneSuggestions(original) {
  const tones = classifyTone(original, toneConfig);
  const box = document.createElement("div");
  box.className = "suggestion-box";

  // Add close button
  const closeBtn = document.createElement("span");
  closeBtn.innerText = "×";
  closeBtn.title = "Close";
  closeBtn.style.cssText = `
    position: absolute;
    top: 4px;
    right: 8px;
    cursor: pointer;
    font-size: 18px;
    color: #fff;
    z-index: 10001;
  `;
  closeBtn.onclick = () => box.remove();
  box.appendChild(closeBtn);

  tones.forEach(({ label, text }) => {
    const option = document.createElement("div");
    option.className = "tone-option";
    option.innerText = `${label}: ${text}`;
    option.onclick = () => {
      navigator.clipboard.writeText(text);
      alert(`${label} version copied to clipboard!`);
    };
    box.appendChild(option);
  });

  Object.assign(box.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#202020",
    color: "#fff",
    padding: "10px 30px 10px 10px", // extra right padding for close button
    border: "1px solid #444",
    borderRadius: "8px",
    zIndex: 10000,
    minWidth: "260px"
  });

  box.style.boxSizing = "border-box";
  box.style.pointerEvents = "auto";

  document.body.appendChild(box);

  setTimeout(() => {
    if (box.parentNode) box.remove();
  }, 10000); // Auto-hide after 10s
}

// Add styles for the suggestion box
const style = document.createElement("style");
style.textContent = `
  .suggestion-box {
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  .tone-option {
    padding: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .tone-option:hover {
    background-color: #333;
  }
`;
document.head.appendChild(style);

// Store tone data in local storage for popup access
chrome.storage.local.set({ toneData: "Tone suggestions available. Click on text to see options." });

// Listen for messages from the popup to retrieve tone data
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'getToneData') {
        chrome.storage.local.get('toneData', (data) => {
        sendResponse({ toneData: data.toneData });
        });
        return true; // Keep the message channel open for sendResponse
    }
    }
);