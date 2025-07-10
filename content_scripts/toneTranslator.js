document.addEventListener("mouseup", () => {
  const selection = window.getSelection().toString();
  if (selection.length > 0) {
    showToneSuggestions(selection);
  }
});

document.addEventListener("input", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
    const text = e.target.value || e.target.innerText;
    const suggestions = classifyTone(text);
    renderSuggestions(suggestions, e.target);
  }
});

function classifyTone(text) {
  const suggestions = [];
  const lower = text.toLowerCase();

  // Rule: Friendly
  if (/(hello|hi|just checking|hope you're well|thanks|smile)/i.test(lower)) {
    suggestions.push({
      label: "Friendly",
      text: "Hey! Just wanted to follow up 😊"
    });
  }

  // Rule: Formal
  if (/(dear|regards|sincerely|to whom it may concern)/i.test(lower)) {
    suggestions.push({
      label: "Formal",
      text: "Dear [Name], I hope this message finds you well."
    });
  }

  // Rule: Assertive
  if (/(need|must|require|asap|deadline)/i.test(lower)) {
    suggestions.push({
      label: "Assertive",
      text: "This needs to be completed by end of day to stay on schedule."
    });
  }

  // Rule: Empathetic
  if (/(sorry|unfortunately|apologize|issue|trouble)/i.test(lower)) {
    suggestions.push({
      label: "Empathetic",
      text: "I understand this might be frustrating—thank you for your patience."
    });
  }

  // Rule: Encouraging
  if (/(great job|impressed|keep going|proud|you're doing well)/i.test(lower)) {
    suggestions.push({
      label: "Encouraging",
      text: "You're making great progress—keep it up!"
    });
  }

  // Rule: Concise
  if (/(i just wanted to|i was wondering if|quick question)/i.test(lower)) {
    suggestions.push({
      label: "Concise",
      text: "Let me know if this works for you."
    });
  }

  // Fallback: Neutral
  if (suggestions.length === 0) {
    suggestions.push({
      label: "Neutral",
      text: "Let me know if you have any questions."
    });
  }

  return suggestions;
}
function showToneSuggestions(original) {
  const tones = classifyTone(original);
  const box = document.createElement("div");
  box.className = "suggestion-box";

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
    padding: "10px",
    border: "1px solid #444",
    borderRadius: "8px",
    zIndex: 10000
  });

  document.body.appendChild(box);

  setTimeout(() => box.remove(), 10000); // Auto-hide after 10s
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