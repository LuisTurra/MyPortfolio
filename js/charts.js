let techChartInstance = null;
let skillsChartInstance = null;
let techData = {};
let skillData = {};

// ============================================================
// CARREGAR JSON
// ============================================================

async function loadProjectsData() {
  console.log("entrou no loadProjectsData");

  try {
    const response = await fetch("data/projects.json");

    const data = await response.json();

    const projects = data.projects;

    console.log("Projetos carregados:", projects.length);

    techData = countItems(projects, "tools");

    skillData = countItems(projects, "skills");

    console.log("TOOLS:", techData);
    console.log("SKILLS:", skillData);

    initCharts();
  } catch (error) {
    console.error("Erro carregando projetos:", error);
  }
}

// ============================================================
// CONTADOR
// ============================================================
function countItems(projects, field) {
  const counter = {};

  projects.forEach((project) => {
    if (!Array.isArray(project[field])) return;

    [...new Set(project[field])].forEach((item) => {
      counter[item] = (counter[item] || 0) + 1;
    });
  });

  return counter;
}
// ============================================================
// Ordenação automática dos gráficos
// Maior valor aparece primeiro
// ============================================================

function sortChartData(data, limit = 15) {
  return Object.fromEntries(
    Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit),
  );
}

function initCharts() {
  console.log("📊 charts.js carregado");
  const isDarkMode = document.body.classList.contains("dark");

  // Dados já ordenados
  const sortedTechData = sortChartData(techData, 15);
  const sortedSkillData = sortChartData(skillData, 15);

  const textColor = isDarkMode ? "#ffffff" : "#222222";
  const gridColor = isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

  const tickColor = isDarkMode ? "#eeeeee" : "#555555";
  const titleColorTech = isDarkMode ? "#00ff88" : "#00aa66";
  const titleColorSkill = isDarkMode ? "#e066ff" : "#8800cc";

  const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top,
    );

    gradient.addColorStop(0, isDarkMode ? "#00ccff" : "#0099cc");
    gradient.addColorStop(1, isDarkMode ? "#00ff88" : "#00cc77");

    return gradient;
  };

  const commonOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode
          ? "rgba(30,30,30,0.95)"
          : "rgba(255,255,255,0.95)",
        titleColor: isDarkMode ? "#fff" : "#000",
        bodyColor: isDarkMode ? "#fff" : "#000",
        borderColor: isDarkMode ? "#00ff88" : "#00aa66",
        borderWidth: 1,
      },
    },

    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },

        ticks: {
          color: tickColor,
          font: {
            size: 12,
          },
        },
      },

      y: {
        grid: {
          display: false,
        },

        ticks: {
          color: textColor,

          font: {
            size: 13,
            weight: "600",
          },
        },
      },
    },

    borderRadius: 6,
    borderSkipped: false,
  };
  if (techChartInstance) techChartInstance.destroy();
  if (skillsChartInstance) skillsChartInstance.destroy();

  // ============================================================
  // GRÁFICO DE TECNOLOGIAS
  // ============================================================

  const ctxTech = document.getElementById("techChart").getContext("2d");

  techChartInstance = new Chart(ctxTech, {
    type: "bar",
    data: {
      labels: Object.keys(sortedTechData),
      datasets: [
        {
          data: Object.values(sortedTechData),

          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "#00ccff";
            return getGradient(ctx, chartArea);
          },
          hoverBackgroundColor: isDarkMode ? "#ffffff" : "#111111",
        },
      ],
    },

    options: {
      ...commonOptions,

      plugins: {
        ...commonOptions.plugins,

        title: {
          display: true,
          text: "TOP FERRAMENTAS",
          color: titleColorTech,
          font: {
            size: 19,
            weight: "bold",
          },
          padding: 20,
        },
      },
    },
  });

  // ============================================================
  // GRÁFICO DE SKILLS
  // ============================================================

  const ctxSkills = document.getElementById("skillsChart").getContext("2d");

  skillsChartInstance = new Chart(ctxSkills, {
    type: "bar",
    data: {
      labels: Object.keys(sortedSkillData),
      datasets: [
        {
          data: Object.values(sortedSkillData),

          backgroundColor: isDarkMode ? "#e066ff" : "#8800cc",

          hoverBackgroundColor: isDarkMode ? "#f08cff" : "#aa00ff",
        },
      ],
    },

    options: {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: {
          display: true,
          text: "COMPETÊNCIAS CHAVE",
          color: titleColorSkill,
          font: {
            size: 19,
            weight: "bold",
          },
          padding: 20,
        },
      },
    },
  });
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(loadProjectsData, 100);

  const dayNightBtn = document.querySelector(".day-night");

  if (dayNightBtn) {
    dayNightBtn.addEventListener("click", () => {
      setTimeout(initCharts, 180);
    });
  }

  const observer = new MutationObserver(() => {
    if (Object.keys(techData).length > 0) {
      initCharts();
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
});
