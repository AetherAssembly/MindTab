// background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log("MindTab Extension Installed");
});

// Optional: Listen for keyboard shortcuts (if reintroduced)
chrome.commands.onCommand.addListener((command) => {
  if (command === "open_flashcard") {
    chrome.tabs.create({ url: chrome.runtime.getURL("flashcard/flashcard.html") });
  }
});