// utils/toneUtils.js

export async function loadToneConfig() {
  const res = await fetch(chrome.runtime.getURL("config/toneConfig.json"));
  return await res.json();
}

export function classifyTone(text, config) {
  const suggestions = [];
  const lower = text.toLowerCase();

  if (!config) return [{
    label: "Neutral",
    text: "Let me know if you have any questions."
  }];

  for (const tone of config) {
    if (tone.triggers.some(trigger => lower.includes(trigger))) {
      suggestions.push({
        label: tone.label,
        text: tone.suggestion
      });
    }
  }

  if (suggestions.length === 0) {
    // Fallback: Neutral
    const neutral = config.find(t => t.label === "Neutral");
    suggestions.push({
      label: "Neutral",
      text: neutral ? neutral.suggestion : "Let me know if you have any questions."
    });
  }

  return suggestions;
}
