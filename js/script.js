// Cores para fundo Branco
const colorPalette = [
  { primary: "#5C6BC0", accent: "#FFD54F", text: "#FFFFFF" },
  { primary: "#26A69A", accent: "#EC407A", text: "#FFFFFF" },
  { primary: "#FF7043", accent: "#66BB6A", text: "#212121" },

  { primary: "#0288D1", accent: "#d80c50e0", text: "#FFFFFF" },


  { primary: "#388E3C", accent: "#FFCA28", text: "#212121" },
  { primary: "#FBC02D", accent: "#D81B60", text: "#212121" },
  { primary: "#85898bff", accent: "#FF5722", text: "#FFFFFF" },
];

//Core para modo Escuro
const darkColorPalette = [
  { primary: "#3F51B5", accent: "#FFCA28", text: "#FFFFFF" },
  { primary: "#00897B", accent: "#F06292", text: "#FFFFFF" },
  { primary: "#EF5350", accent: "#4CAF50", text: "#212121" },

  { primary: "#0277BD", accent: "#FF4081", text: "#FFFFFF" },
  { primary: "#6A1B9A", accent: "#29B6F6", text: "#FFFFFF" },
  { primary: "#C2185B", accent: "#26A69A", text: "#FFFFFF" },
  { primary: "#2E7D32", accent: "#FFD54F", text: "#212121" },
  { primary: "#F9A825", accent: "#C2185B", text: "#212121" },
  { primary: "#37474F", accent: "#F4511E", text: "#FFFFFF" },
];

// luminosidade
function getLuminance(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// contraste
function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
}
// Cores randomica
function setRandomSkinColor() {
  const palette = document.body.classList.contains("dark") ? darkColorPalette : colorPalette;
  const selectedPalette = palette[Math.floor(Math.random() * palette.length)];
  applyColorScheme(selectedPalette);
}

// Modo Claro/Escuro
const dayNight = document.querySelector(".day-night");
if (dayNight) {
  const toggleTheme = () => {
    const icon = dayNight.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-sun");
      icon.classList.toggle("fa-moon");
      document.body.classList.toggle("dark");
      dayNight.setAttribute("aria-pressed", document.body.classList.contains("dark"));
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
      setRandomSkinColor();
    }
  };

  dayNight.addEventListener("click", toggleTheme);
  dayNight.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    }
  });

  window.addEventListener("load", () => {
    const icon = dayNight.querySelector("i");
    if (icon) {
      const isDark = localStorage.getItem("theme") === "dark";
      document.body.classList.toggle("dark", isDark);
      icon.classList.remove("fa-sun", "fa-moon");
      icon.classList.add(isDark ? "fa-sun" : "fa-moon");
      dayNight.setAttribute("aria-pressed", isDark);
      setRandomSkinColor();
    }
  });
}

// Initialize AOS
console.log('AOS and Typed.js initialized');
AOS.init({
  duration: 800,
  once: true
});

// Typed.js for hero section
new Typed('.typing', {
  strings: ['Cientista de Dados', 'Analista de Dados', 'Entusiasta de Machine Learning'],
  typeSpeed: 100,
  backSpeed: 60,
  loop: true
});
// Botão Sidebar
document.querySelector('.nav-toggler').addEventListener('click', () => {
  const navToggler = document.querySelector('.nav-toggler');
  const aside = document.querySelector('.aside');
  aside.classList.toggle('open');
  navToggler.classList.toggle('active');
  navToggler.classList.add('clicked');
  setTimeout(() => {
    navToggler.classList.remove('clicked');
  }, 300);
});

// Fechar Sidebar
const navLinks = document.querySelectorAll('.aside .nav li a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.aside').classList.remove('open');
    document.querySelector('.nav-toggler').classList.remove('active');
  });
});

// Recarregar a pagina
window.addEventListener('load', () => {
  const sidebar = document.querySelector('.aside');
  if (sidebar) sidebar.scrollTop = 0;
});

// Active link on scroll
const sections = document.querySelectorAll('.section');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 60) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
});

// Barras de Skill
document.addEventListener('DOMContentLoaded', () => {
  console.log('Skills animation initialized');
  const skillsItems = document.querySelectorAll('.skills-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const progressIn = entry.target.querySelector('.progress-in');
      const width = progressIn.getAttribute('data-progress-width');
      if (entry.isIntersecting) {
        console.log('Animating skills item:', entry.target);
        entry.target.classList.add('animated');
        progressIn.style.setProperty('--progress-width', width);
      } else {
        console.log('Resetting skills item:', entry.target);
        entry.target.classList.remove('animated');
        progressIn.style.setProperty('--progress-width', '0%');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px'
  });

  skillsItems.forEach(item => observer.observe(item));
});
const homeImg = document.querySelector('.home-img img');
homeImg.addEventListener('mousemove', (e) => {
  const rect = homeImg.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const tiltX = (y / rect.height) * 10;
  const tiltY = -(x / rect.width) * 10;
  homeImg.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
});
homeImg.addEventListener('mouseleave', () => {
  homeImg.style.transform = 'rotateX(0) rotateY(0) scale(1)';
});
document.addEventListener('DOMContentLoaded', () => {
  const skillsItems = document.querySelectorAll('.skills-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      const progressIn = entry.target.querySelector('.progress-in');
      const width = progressIn.getAttribute('data-progress-width');
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
          progressIn.style.setProperty('--progress-width', width);
        }, index * 200);
      } else {
        entry.target.classList.remove('animated');
        progressIn.style.setProperty('--progress-width', '0%');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px'
  });
  skillsItems.forEach(item => observer.observe(item));
});
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelector('.circle-dot').style.animationPlayState = 'running';
    } else {
      entry.target.querySelector('.circle-dot').style.animationPlayState = 'paused';
    }
  });
}, { threshold: 0.2 });
timelineItems.forEach(item => timelineObserver.observe(item));
const buttons = document.querySelectorAll('.dashboard-btn, .relatorio-btn, .github-link');
buttons.forEach(button => {
  button.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
function setConsistentCardHeights() {
  const dashboardCards = document.querySelectorAll('.dashboard .flip-card');
  let maxHeight = 0;


  dashboardCards.forEach(card => {
    card.style.height = 'auto';
    const height = card.offsetHeight;
    if (height > maxHeight) {
      maxHeight = height;
    }
  });


  dashboardCards.forEach(card => {
    card.style.height = `${maxHeight}px`;
  });
}


window.addEventListener('load', setConsistentCardHeights);
window.addEventListener('resize', setConsistentCardHeights);

// Função de Brilho das cores
function adjustColor(hex, percent) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  r = Math.min(255, Math.max(0, r * (1 + percent)));
  g = Math.min(255, Math.max(0, g * (1 + percent)));
  b = Math.min(255, Math.max(0, b * (1 + percent)));

  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
    .toString(16)
    .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

// Função de Brilho das cores
function adjustColor(hex, percent) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  r = Math.min(255, Math.max(0, r * (1 + percent)));
  g = Math.min(255, Math.max(0, g * (1 + percent)));
  b = Math.min(255, Math.max(0, b * (1 + percent)));

  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
    .toString(16)
    .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

// Função de Brilho das cores
function adjustColor(hex, percent) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  r = Math.min(255, Math.max(0, r * (1 + percent)));
  g = Math.min(255, Math.max(0, g * (1 + percent)));
  b = Math.min(255, Math.max(0, b * (1 + percent)));

  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
    .toString(16)
    .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

// Função de Brilho das cores
function adjustColor(hex, percent) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  r = Math.min(255, Math.max(0, r * (1 + percent)));
  g = Math.min(255, Math.max(0, g * (1 + percent)));
  b = Math.min(255, Math.max(0, b * (1 + percent)));

  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
    .toString(16)
    .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

// Função de cores
function adjustColor(hex, percent) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  r = Math.min(255, Math.max(0, r * (1 + percent)));
  g = Math.min(255, Math.max(0, g * (1 + percent)));
  b = Math.min(255, Math.max(0, b * (1 + percent)));

  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
    .toString(16)
    .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

// ajuste de gradiente de cores
function applyAnimatedBgColors(animationBaseColor) {
  const skinVariant_L = adjustColor(animationBaseColor, 0.10);

  // ajuste de cores
  const skinVariant1 = adjustColor(animationBaseColor, -0.05);
  const skinVariant2 = adjustColor(animationBaseColor, -0.15);
  const skinVariant3 = adjustColor(animationBaseColor, -0.25);
  const skinVariant4 = adjustColor(animationBaseColor, -0.35);

  // Variação
  document.documentElement.style.setProperty("--skin-variant-1", skinVariant1);
  document.documentElement.style.setProperty("--skin-variant-2", skinVariant2);
  document.documentElement.style.setProperty("--skin-variant-3", skinVariant3);
  document.documentElement.style.setProperty("--skin-variant-4", skinVariant4);
  document.documentElement.style.setProperty("--skin-variant-5", skinVariant_L);
}

// esquema de cores
function applyColorScheme(palette) {
  const { primary, accent, text } = palette;
  const contrastRatio = getContrastRatio(primary, text);
  const textColor = contrastRatio >= 4.5 ? text : "#FFFFFF";
  const hoverColor = adjustColor(primary, -0.2);


  document.documentElement.style.setProperty("--skin-color", primary);
  document.documentElement.style.setProperty("--text-color", textColor);
  document.documentElement.style.setProperty("--hover-color", hoverColor);
  document.documentElement.style.setProperty("--accent-color", accent);
  document.documentElement.style.setProperty("--animated-base-color", primary);

  applyAnimatedBgColors(primary);

  document.querySelectorAll(".random-color").forEach((element) => {
    element.style.color = accent;
    console.log(`Applying accent color ${accent} to element:`, element);
  });
}
// card stuff

// Preview ao hover no botão
document.querySelectorAll('.hover-indicator-btn').forEach(btn => {
  const overlay = btn.closest('.project-card').querySelector('.project-overlay');
  const background = btn.closest('.project-card').querySelector('.project-background');

  btn.addEventListener('mouseenter', () => {
    overlay.style.opacity = '0';
    background.style.transform = 'scale(1.03)';
  });

  btn.addEventListener('mouseleave', () => {
    overlay.style.opacity = '1';
    background.style.transform = 'scale(1)';
  });
});

// Virar o card só com clique na frente
document.querySelectorAll('.flip-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    trigger.closest('.flip-card').classList.toggle('flipped');
  });
});
// Voltar para a frente ao clicar no verso (exceto nos botões)
document.querySelectorAll('.flip-card-back').forEach(back => {
  back.addEventListener('click', (e) => {
    // Só vira de volta se o clique não for em botão, link ou área de scroll
    if (!e.target.closest('a, button, .scrollable-content')) {
      back.closest('.flip-card').classList.remove('flipped');
    }
  });
});