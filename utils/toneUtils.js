// utils/toneUtils.js

async function loadToneConfig() {
  const res = await fetch(chrome.runtime.getURL("config/toneConfig.json"));
  return await res.json();
}

function classifyTone(text, config) {
  const suggestions = [];
  const lower = (text || '').toLowerCase();

  if (!config) return [{
    label: "Neutral",
    text: "Let me know if you have any questions."
  }];

  for (const tone of config) {
    if (Array.isArray(tone.triggers) && tone.triggers.some(trigger => lower.includes(trigger))) {
      suggestions.push({
        label: tone.label,
        text: tone.suggestion
      });
    }
  }

  if (suggestions.length === 0) {
    // Fallback: Neutral
    const neutral = Array.isArray(config) ? config.find(t => t.label === "Neutral") : null;
    suggestions.push({
      label: "Neutral",
      text: neutral ? neutral.suggestion : "Let me know if you have any questions."
    });
  }

  return suggestions;
}

// Expose for non-module usage (content scripts & pages)
try {
  window.loadToneConfig = loadToneConfig;
  window.classifyTone = classifyTone;
} catch (e) {
  // If window is not available (e.g., worker), skip global attach
}

// For environments that support modules, also export named functions
if (typeof exports !== 'undefined') {
  try { exports.loadToneConfig = loadToneConfig; exports.classifyTone = classifyTone; } catch (e) {}
}
