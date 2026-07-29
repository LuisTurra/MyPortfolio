const button = document.getElementById("ai-button");

const windowAI = document.getElementById("ai-window");

const input = document.getElementById("ai-input");

const messages = document.getElementById("ai-messages");

button.onclick = () => {
  windowAI.classList.toggle("open");
};

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const question = input.value;

    messages.innerHTML += `
<p class="user-message">
<b>Você:</b> ${question}
</p>
`;

    input.value = "";

    const answer = await askPortfolioAI(question);

    messages.innerHTML += `
<p class="ai-message">
<b>AI:</b> ${answer}
</p>
`;
  }
});
