document.addEventListener("DOMContentLoaded", () => {
  loadSidebar();
});

async function loadSidebar() {
  try {
    const response = await fetch("data/projects.json");

    const data = await response.json();

    const projects = data.projects || data;

    console.log("Projetos carregados:", projects);

    const categories = {
      featured: {
        name: "Projetos em Destaque",
        icon: "fa-chart-line",
      },

      other: {
        name: "Outros Projetos",
        icon: "fa-chart-line",
      },

      sql: {
        name: "Projetos SQL",
        icon: "fa-database",
      },

      games: {
        name: "Jogos",
        icon: "fa-gamepad",
      },

      excel: {
        name: "Power BI e Excel",
        icon: "fa-chart-bar",
      },
      academic: {
        name: "Projetos Acadêmicos",
        icon: "fa-graduation-cap",
      },
    };

    // continua o restante...

    const nav = document.querySelector(".nav");

    if (!nav) return;

    // mantém Home e Sobre
    const staticItems = nav.querySelectorAll(":scope > li");

    const home = staticItems[0];
    const about = staticItems[1];

    nav.innerHTML = "";

    nav.appendChild(home);
    nav.appendChild(about);
    Object.keys(categories).forEach((category) => {
      const filtered = projects.filter(
        (project) => project.category === category,
      );

      if (filtered.length === 0) return;

      const li = document.createElement("li");

      // ============================
      // PROJETOS EM DESTAQUE FIXO
      // ============================
      if (category === "featured") {
        li.innerHTML = `

            <a href="#dashboards">
                <i class="fa ${categories[category].icon}"></i>
                ${categories[category].name}
            </a>


            <ul class="nav-sub">

                ${filtered
                  .map(
                    (project) => `

                    <li>
                        <a href="#${project.id}">
                            <span class="white-ball"></span>
                            ${project.title}
                        </a>
                    </li>

                `,
                  )
                  .join("")}

            </ul>

        `;

        li.classList.add("open");
      }

      // ============================
      // OUTROS = DROPDOWN
      // ============================
      else {
        li.innerHTML = `

            <a href="javascript:void(0)" class="dropdown-toggle">

                <i class="fa ${categories[category].icon}"></i>
                ${categories[category].name}

                <span class="arrow">
                    <i class="fa fa-chevron-down"></i>
                </span>

            </a>


            <ul class="nav-sub">

                ${filtered
                  .map(
                    (project) => `

                    <li>
                        <a href="#${project.id}">
                            <span class="white-ball"></span>
                            ${project.title}
                        </a>
                    </li>

                `,
                  )
                  .join("")}

            </ul>

        `;

        // começa fechado
        li.classList.add("closed");
      }

      nav.appendChild(li);
    });

    document.addEventListener("click", (e) => {
      const toggle = e.target.closest(".dropdown-toggle");

      if (!toggle) return;

      const item = toggle.parentElement;

      item.classList.toggle("open");
      item.classList.toggle("closed");
    });
    // mantém projetos acadêmicos no final

    
  } catch (error) {
    console.error("Erro carregando sidebar:", error);
  }
}
