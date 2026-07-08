//////////////////////////////////////////////////////////////////////////////////////////////////////
// =========================== FILTROS =====================================
//////////////////////////////////////////////////////////////////////////////////////////////////////

let selectedCategory = "";
let selectedTag = "";
let selectedTool = "";
let selectedSkill = "";
function normalizeText(text) {
  if (!text) return "";

  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ");
}
function setupFilters() {
  const categorySelect = document.getElementById("filter-category");
  const tagSelect = document.getElementById("filter-tag");
  const toolSelect = document.getElementById("filter-tool");
  const skillSelect = document.getElementById("filter-skill");
  const counter = document.getElementById("projects-count");

  if (!categorySelect || !tagSelect || !toolSelect || !skillSelect) {
    console.warn("Filtros não encontrados.");
    return;
  }

  categorySelect.innerHTML = "";
  tagSelect.innerHTML = "";
  toolSelect.innerHTML = "";
  skillSelect.innerHTML = "";

  const categories = {};
  const tags = {};
  const tools = {};
  const skills = {};

  allProjects.forEach((project) => {
    // Categoria
    const category = normalizeText(project.category);

    categories[category] = (categories[category] || 0) + 1;

    // Tags
    (project.tags || []).forEach((tag) => {
      const cleanTag = normalizeText(tag);

      tags[cleanTag] = (tags[cleanTag] || 0) + 1;
    });

    (project.tools || []).forEach((tool) => {
      const cleanTool = normalizeText(tool);

      tools[cleanTool] = (tools[cleanTool] || 0) + 1;
    });

    // Skills
    (project.skills || []).forEach((skill) => {
      const cleanSkill = normalizeText(skill);

      skills[cleanSkill] = (skills[cleanSkill] || 0) + 1;
    });
  });

  ///////////////////////////////////////////////////////
  // Categoria
  ///////////////////////////////////////////////////////

  categorySelect.insertAdjacentHTML(
    "beforeend",
    `<option value="">Todas (${allProjects.length})</option>`,
  );

  Object.keys(categories)
    .sort((a, b) => a.localeCompare(b))
    .forEach((category) => {
      categorySelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${category}">
                    ${capitalize(category)} (${categories[category]})
                </option>`,
      );
    });

  ///////////////////////////////////////////////////////
  // Tags
  ///////////////////////////////////////////////////////

  tagSelect.insertAdjacentHTML(
    "beforeend",
    `<option value="">Todas (${allProjects.length})</option>`,
  );

  Object.keys(tags)
    .sort((a, b) => a.localeCompare(b))
    .forEach((tag) => {
      tagSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${tag}">
                    ${capitalize(tag)} (${tags[tag]})
                </option>`,
      );
    });

  ///////////////////////////////////////////////////////
  // Tools
  ///////////////////////////////////////////////////////

  toolSelect.insertAdjacentHTML(
    "beforeend",
    `<option value="">Todas (${allProjects.length})</option>`,
  );

  Object.keys(tools)
    .sort((a, b) => a.localeCompare(b))
    .forEach((tool) => {
      toolSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${tool}">
                    ${tool} (${tools[tool]})
                </option>`,
      );
    });

  ///////////////////////////////////////////////////////
  // Skills
  ///////////////////////////////////////////////////////

  skillSelect.insertAdjacentHTML(
    "beforeend",
    `<option value="">Todas (${allProjects.length})</option>`,
  );

  Object.keys(skills)
    .sort((a, b) => a.localeCompare(b))
    .forEach((skill) => {
      skillSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${skill}">
                    ${skill} (${skills[skill]})
                </option>`,
      );
    });

  ///////////////////////////////////////////////////////

  categorySelect.removeEventListener("change", filterProjects);
  tagSelect.removeEventListener("change", filterProjects);
  toolSelect.removeEventListener("change", filterProjects);
  skillSelect.removeEventListener("change", filterProjects);

  categorySelect.addEventListener("change", filterProjects);
  tagSelect.addEventListener("change", filterProjects);
  toolSelect.addEventListener("change", filterProjects);
  skillSelect.addEventListener("change", filterProjects);

  const clearBtn = document.getElementById("clear-filters");

  if (clearBtn) {
    clearBtn.removeEventListener("click", clearFilters);
    clearBtn.addEventListener("click", clearFilters);
  }

  if (counter) {
    counter.textContent = `${allProjects.length} de ${allProjects.length} projetos`;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function filterProjects() {
  selectedCategory = document.getElementById("filter-category").value;

  selectedTag = document.getElementById("filter-tag").value;

  selectedTool = document.getElementById("filter-tool").value;

  selectedSkill = document.getElementById("filter-skill").value;

  filteredProjects = allProjects.filter((project) => {
    const categoryOk =
      selectedCategory === "" ||
      normalizeText(project.category) === selectedCategory;

    const tagOk =
      selectedTag === "" ||
      (project.tags || []).map(normalizeText).includes(selectedTag);

    const toolOk =
      selectedTool === "" ||
      (project.tools || []).map(normalizeText).includes(selectedTool);

    const skillOk =
      selectedSkill === "" ||
      (project.skills || []).map(normalizeText).includes(selectedSkill);

    return categoryOk && tagOk && toolOk && skillOk;
  });

  renderProjects(filteredProjects);

  const counter = document.getElementById("projects-count");

  if (counter) {
    counter.textContent = `${filteredProjects.length} de ${allProjects.length} projetos`;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function clearFilters() {
  document.getElementById("filter-category").value = "";
  document.getElementById("filter-tag").value = "";
  document.getElementById("filter-tool").value = "";
  document.getElementById("filter-skill").value = "";

  selectedCategory = "";
  selectedTag = "";
  selectedTool = "";
  selectedSkill = "";

  filteredProjects = allProjects;

  renderProjects(filteredProjects);

  const counter = document.getElementById("projects-count");

  if (counter) {
    counter.textContent = `${allProjects.length} de ${allProjects.length} projetos`;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function capitalize(text) {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
