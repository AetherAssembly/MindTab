document.addEventListener('DOMContentLoaded', async () => {
  try {
    const url = chrome && chrome.runtime ? chrome.runtime.getURL('flashcard/config.json') : 'config.json';
    const res = await fetch(url);
    const cards = await res.json();

    const deck = document.querySelector('.deck');
    if (!deck) {
      console.warn('Flashcard: .deck element not found');
      return;
    }

    cards.forEach(({ question, answer }) => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front">${question}</div>
          <div class="card-face card-back">${answer}</div>
        </div>
      `;

      card.addEventListener('click', () => card.classList.toggle('flipped'));
      deck.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load flashcards:', err);
  }
});
