fetch("flashcard/config.json")
  .then(res => res.json())
  .then(cards => {
    const deck = document.querySelector(".deck");
    cards.forEach(({ question, answer }) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front">${question}</div>
          <div class="card-face card-back">${answer}</div>
        </div>
      `;
      
      card.onclick = () => card.classList.toggle("flipped");
      deck.appendChild(card);
    });
  });
