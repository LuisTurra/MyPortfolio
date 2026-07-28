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

function hasCategory(project, category) {
  if (!project || !project.category) return false;

  const categories = Array.isArray(project.category)
    ? project.category
    : [project.category];

  return categories.map(normalizeText).includes(category);
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Função auxiliar para popular os selects
function populateSelect(selectId, items, useCapitalize = true) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = `<option value="">Todas (${allProjects.length})</option>`;

  Object.keys(items)
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => {
      const displayText = useCapitalize ? capitalize(key) : key;
      select.insertAdjacentHTML(
        "beforeend",
        `<option value="${key}">${displayText} (${items[key]})</option>`
      );
    });
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

  const categories = {};
  const tags = {};
  const tools = {};
  const skills = {};

  allProjects.forEach((project) => {
    // Categoria (suporta array ou string)
    const projectCategories = Array.isArray(project.category)
      ? project.category
      : [project.category];

    projectCategories.forEach((category) => {
      const clean = normalizeText(category);
      if (clean) categories[clean] = (categories[clean] || 0) + 1;
    });

    // Tags
    (project.tags || []).forEach((tag) => {
      const clean = normalizeText(tag);
      if (clean) tags[clean] = (tags[clean] || 0) + 1;
    });

    // Tools
    (project.tools || []).forEach((tool) => {
      const clean = normalizeText(tool);
      if (clean) tools[clean] = (tools[clean] || 0) + 1;
    });

    // Skills
    (project.skills || []).forEach((skill) => {
      const clean = normalizeText(skill);
      if (clean) skills[clean] = (skills[clean] || 0) + 1;
    });
  });

  // Popular selects
  populateSelect("filter-category", categories, true);
  populateSelect("filter-tag", tags, true);
  populateSelect("filter-tool", tools, false);   // mantive sem capitalize (você decide)
  populateSelect("filter-skill", skills, false);

  // Remover listeners antigos e adicionar novos
  const filters = [categorySelect, tagSelect, toolSelect, skillSelect];
  filters.forEach(select => {
    select.removeEventListener("change", filterProjects);
    select.addEventListener("change", filterProjects);
  });

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
    const categoryOk = selectedCategory === "" || hasCategory(project, selectedCategory);

    const tagOk =
      selectedTag === "" ||
      (project.tags || []).some(tag => normalizeText(tag) === selectedTag);

    const toolOk =
      selectedTool === "" ||
      (project.tools || []).some(tool => normalizeText(tool) === selectedTool);

    const skillOk =
      selectedSkill === "" ||
      (project.skills || []).some(skill => normalizeText(skill) === selectedSkill);

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

  filteredProjects = [...allProjects]; // cópia para evitar referência

  renderProjects(filteredProjects);

  const counter = document.getElementById("projects-count");
  if (counter) {
    counter.textContent = `${allProjects.length} de ${allProjects.length} projetos`;
  }
}