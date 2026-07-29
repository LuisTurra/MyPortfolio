const button = document.getElementById("ai-button");

const windowAI = document.getElementById("ai-window");

const input = document.getElementById("ai-input");

const messages = document.getElementById("ai-messages");

button.onclick = () => {
  windowAI.classList.toggle("open");
};

function addChatMessage(text, type) {
  const p = document.createElement("p");

  p.className = type;

  p.textContent = text;

  messages.appendChild(p);

  messages.scrollTop = messages.scrollHeight;
}

input.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") {
    return;
  }

  const question = input.value.trim();

  if (!question) {
    return;
  }

  addChatMessage("Você: " + question, "user-message");

  input.value = "";

  addChatMessage("AI: Pensando...", "ai-message");

  try {
    const answer = await askPortfolioAI(question);

    const loading = document.querySelector(".ai-message:last-child");

    if (loading && loading.textContent.includes("Pensando")) {
      loading.remove();
    }

    addChatMessage("AI: " + answer, "ai-message");
  } catch (error) {
    console.error(error);

    addChatMessage("AI: Erro ao conectar.", "ai-message");
  }
});
