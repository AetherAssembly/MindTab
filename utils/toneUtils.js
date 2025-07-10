// utils/toneUtils.js

export function classifyTone(text) {
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
