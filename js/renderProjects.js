//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
// ====================== PROJECTS DATA & RENDERING ======================
// ======== INICIALIZAÇÃO GLOBAL ========
let allProjects = [];
let filteredProjects = [];

console.log("✅ Variáveis globais inicializadas");

async function loadProjects() {
  try {
    console.log("🔄 Iniciando loadProjects()...");

    const url = "data/projects.json?_=" + Date.now();
    let response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      console.warn("❌ Tentando caminho alternativo...");
      const url2 = "./data/projects.json?_=" + Date.now();
      response = await fetch(url2, { cache: "no-store" });
    }

    if (!response.ok) {
      throw new Error(
        "Falha ao buscar projects.json (status " + response.status + ")",
      );
    }

    const data = await response.json();
    allProjects = data.projects || [];
    filteredProjects = allProjects;

    console.log("✅ Dados carregados:", allProjects.length, "projetos");

    renderProjects(filteredProjects);
    setupFilters();
  } catch (error) {
    console.error("❌ Error loading projects:", error);
  }
}

// ========== CARREGA QUANDO O DOM ESTÁ PRONTO ==========
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProjects, { once: true });
} else {
  loadProjects();
}

// ========== FALLBACK: SE AINDA ESTIVER VAZIO APÓS O LOAD ==========
window.addEventListener("load", () => {
  // Espera 2 segundos antes de fazer fallback
  setTimeout(() => {
    if (allProjects.length === 0) {
      console.warn("⚠️ Fallback: recarregando projetos...");
      loadProjects();
    } else {
      console.log("✅ Projetos já carregados, sem fallback");
    }
  }, 2000);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
function renderProjects(projects) {
  console.log("🔥 RENDER START", {
    quantidade: projects.length,
    hora: new Date().toISOString(),
  });

  const containers = {
    featured: document.getElementById("projetos-destaque-container"),
    other: document.getElementById("todos-projetos-container"),
    sql: document.getElementById("projetos-sql-container"),
    games: document.getElementById("jogos-container"),
    excel: document.getElementById("excelPBI-container"),
    academic: document.getElementById("Academico-container"),
  };

  // Clear all containers
  Object.values(containers).forEach((container) => {
    if (container) {
      container.innerHTML = "";
    }
  });

  // Group projects by category
  const grouped = {
    featured: projects.filter((p) => p && p.category === "featured"),
    other: projects.filter((p) => p && p.category === "other"),
    sql: projects.filter((p) => p && p.category === "sql"),
    games: projects.filter((p) => p && p.category === "games"),
    excel: projects.filter((p) => p && p.category === "excel"),
    academic: projects.filter((p) => p && p.category === "academic"),
  };
  // Headers das categorias gerados automaticamente
  const categoryTitles = {
    featured: "Projetos em Destaque",
    other: "Outros Projetos",
    sql: "Projetos SQL",
    games: "Jogos",
    excel: "Excel & Power BI",
    academic: "Projetos Acadêmicos",
  };
  // Render each group
  Object.entries(grouped).forEach(([category, categoryProjects]) => {
    const container = containers[category];
    if (!container || categoryProjects.length === 0) return;
    // Cria o header da categoria apenas se não existir
    if (!container.querySelector(".section-title")) {
      container.insertAdjacentHTML(
        "beforeend",
        `
      <div class="section-title">
        <h2>${categoryTitles[category]}</h2>
      </div>
      `,
      );
    }
    categoryProjects.forEach((project) => {
      const tags = Array.isArray(project.tags) ? project.tags : [];
      const tools = Array.isArray(project.tools) ? project.tools : [];
      const skills = Array.isArray(project.skills) ? project.skills : [];
      const imagePath = project.imagePath || "";
      const title = project.title || "";
      const description = project.description || "";
      const id = project.id || "";

      const badgesHtml = tags
        .map((tag) => `<span class="badge">${tag}</span>`)
        .join("");

      const reportBtn = project.reportPath
        ? `<button class="relatorio-btn" onclick="window.open('${project.reportPath}', '_blank')">📄 Relatório</button>`
        : "";

      const demoBtn = project.demoLink
        ? `<button class="dashboard-btn" onclick="window.open('${project.demoLink}', '_blank')">${title}</button>`
        : "";

      const githubBtn = project.githubLink
        ? `<a href="${project.githubLink}" target="_blank" class="github-link">View on GitHub</a>`
        : "";

      const html = `
        <a id="${id}"></a>
        <div class="dashboard padd-15">
          <div class="portfolio-item-inner shadow-dark">
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front project-card">
                  <div class="flip-trigger"></div>
                  <div class="project-background" style="background-image: url('${imagePath}');"></div>
                  <div class="project-overlay">
                    <div class="project-content">
                      <h2>${title}</h2>
                      <p class="portfolio-description">${description}</p>
                      <div class="tech-badges">${badgesHtml}</div>
                    </div>
                  </div>
                  <div class="hover-indicator-btn">👁️ Preview</div>
                </div>
                <div class="flip-card-back">
                  <div class="scrollable-content">
                    <div class="row">
                      <div class="column">
                        <div class="portfolio-tools">
                          <strong><span class="highlight">Ferramentas:</span></strong>
                          <ul>${tools.map((tool) => `<li>${tool}</li>`).join("")}</ul>
                        </div>
                      </div>
                      <div class="column">
                        <div class="portfolio-tools">
                          <strong><span class="highlight">Skills:</span></strong>
                          <ul>${skills.map((skill) => `<li>${skill}</li>`).join("")}</ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  ${githubBtn}
                  ${reportBtn}
                  ${demoBtn}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      container.insertAdjacentHTML("beforeend", html);
    });
  });
  console.log("✅ HTML inserido");
  // Força o navegador a renderizar ANTES de fazer animações
  Object.values(containers).forEach((container) => {
    if (container) {
      void container.offsetHeight; // Force reflow
    }
  });

  // Inicializa interações
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeCardInteractions();
    });
  } else {
    requestAnimationFrame(() => {
      initializeCardInteractions();
    });
  }

  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }
}

// Nova função centralizada para inicializar tudo
function initializeCardInteractions() {
  // Força visibilidade dos overlays
  document.querySelectorAll(".project-overlay").forEach((ov) => {
    ov.style.opacity = "1";
    ov.style.visibility = "visible";
  });

  document.querySelectorAll(".project-content").forEach((content) => {
    content.style.opacity = "1";
    content.style.visibility = "visible";
  });

  // Layout recalculation
  requestAnimationFrame(() => {
    document
      .querySelectorAll(".flip-card, .flip-card-inner, .project-card")
      .forEach((el) => {
        el.style.display = "none";
        void el.offsetHeight; // Force reflow
        el.style.display = "";
      });

    initPreviewHover();
    initFlipCards();
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

function initPreviewHover() {
  // garante que overlays comecem visíveis
  document.querySelectorAll(".project-overlay").forEach((ov) => {
    ov.style.opacity = "1";
  });

  // usa pointer events (funciona bem em desktop + touch)
  document.querySelectorAll(".hover-indicator-btn").forEach((btn) => {
    const card = btn.closest(".project-card");
    if (!card) return;

    const overlay = card.querySelector(".project-overlay");
    const background = card.querySelector(".project-background");

    // pointerenter/pointerleave resolvem inconsistências de mouse/touch
    btn.addEventListener("pointerenter", () => {
      if (overlay) overlay.style.opacity = "0";
      if (background) background.style.transform = "scale(1.03)";
    });

    btn.addEventListener("pointerleave", () => {
      if (overlay) overlay.style.opacity = "1";
      if (background) background.style.transform = "scale(1)";
    });

    // também garante estado inicial caso o elemento tenha sido re-renderizado
    if (overlay) overlay.style.opacity = "1";
    if (background) background.style.transform = "scale(1)";
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
function initFlipCards() {
  // Se já tiver o listener global no body, não adiciona outro
  if (document.body.dataset.flipInitialized) return;
  document.body.dataset.flipInitialized = "true";

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".flip-card-front");
    if (card) {
      card.closest(".flip-card")?.classList.toggle("flipped");
      console.log("FLIPPED");
      return;
    }

    const back = e.target.closest(".flip-card-back");
    if (back) {
      if (e.target.closest("a, button, .scrollable-content")) return;
      back.closest(".flip-card")?.classList.remove("flipped");
    }
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
function ensureUIInitialized() {
  // garante overlays visíveis e fundo em escala normal
  document.querySelectorAll(".project-overlay").forEach((ov) => {
    ov.style.opacity = "1";
  });
  document.querySelectorAll(".project-background").forEach((bg) => {
    bg.style.transform = "scale(1)";
  });

  // reanexa handlers (funções que você já tem)
  if (typeof initPreviewHover === "function") initPreviewHover();
  //   if (typeof initFlipCards === "function") initFlipCards();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
// roda no load (também pode rodar no DOMContentLoaded)
window.addEventListener("load", () => {
  ensureUIInitialized();
});
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.getRegistrations().then((regs) => {
//     if (regs.length) {
//       console.warn("Service workers registrados:", regs);
//       // Se quiser, descomente a próxima linha para desregistrar todos (uso de dev only)
//       // regs.forEach(r => r.unregister());
//     } else {
//       console.log("Nenhum service worker registrado.");
//     }
//   });
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
