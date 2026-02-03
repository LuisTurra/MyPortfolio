// Modo claro
const colorPalette = [
  { primary: "#1e293b", accent: "#6366f1", text: "#1e293b" },  
  { primary: "#0f172a", accent: "#818cf8", text: "#1e293b" },  
  { primary: "#334155", accent: "#a5b4fc", text: "#1e293b" },  
  { primary: "#1e3a8a", accent: "#60a5fa", text: "#1e293b" },  
];

// Modo escuro
const darkColorPalette = [
  { primary: "#0f172a", accent: "#818cf8", text: "#f1f5f9" },  
  { primary: "#1e293b", accent: "#a5b4fc", text: "#e2e8f0" },  
  { primary: "#111827", accent: "#6366f1", text: "#f8fafc" },  
  { primary: "#1e40af", accent: "#c7d2fe", text: "#ffffff" },  
];

// Luminância
function getLuminance(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Contraste
function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
}

// Ajuste de luminosidade 
function adjustLightness(hex, amount) {
  let usePound = false;
  if (hex[0] === "#") {
    hex = hex.slice(1);
    usePound = true;
  }
  let num = parseInt(hex, 16);
  let r = (num >> 16) / 255;
  let g = (num >> 8 & 255) / 255;
  let b = (num & 255) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  l += amount;
  l = Math.max(0, Math.min(1, l));

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return (usePound ? "#" : "") + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
}

// Gradientes 
function applyAnimatedBgColors(animationBaseColor) {
  const skinVariant_L = adjustLightness(animationBaseColor, 0.08);   
  const skinVariant1 = adjustLightness(animationBaseColor, -0.05);
  const skinVariant2 = adjustLightness(animationBaseColor, -0.10);
  const skinVariant3 = adjustLightness(animationBaseColor, -0.15);
  const skinVariant4 = adjustLightness(animationBaseColor, -0.20);

  document.documentElement.style.setProperty("--skin-variant-1", skinVariant1);
  document.documentElement.style.setProperty("--skin-variant-2", skinVariant2);
  document.documentElement.style.setProperty("--skin-variant-3", skinVariant3);
  document.documentElement.style.setProperty("--skin-variant-4", skinVariant4);
  document.documentElement.style.setProperty("--skin-variant-5", skinVariant_L);
}

// Esquema de cores
function applyColorScheme(palette) {
  const { primary, accent } = palette;

 
  const textOnPrimary = getContrastRatio(primary, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#000000";

  const hoverColor = adjustLightness(primary, -0.15);  

  document.documentElement.style.setProperty("--skin-color", primary);
  document.documentElement.style.setProperty("--accent-color", accent);
  document.documentElement.style.setProperty("--hover-color", hoverColor);
  document.documentElement.style.setProperty("--text-color", textOnPrimary);
  document.documentElement.style.setProperty("--animated-base-color", primary);

  applyAnimatedBgColors(primary);

  document.querySelectorAll(".random-color").forEach((element) => {
    element.style.color = accent;
  });
}

// Cor aleatória
function setRandomSkinColor() {
  const palette = document.body.classList.contains("dark") ? darkColorPalette : colorPalette;
  const selectedPalette = palette[Math.floor(Math.random() * palette.length)];
  applyColorScheme(selectedPalette);
}

// Modo dia/noite
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
// Inicialização de AOS
AOS.init({ duration: 800, once: true });
// Efeito de digitação
new Typed('.typing', {
  strings: ['Cientista de Dados', 'Analista de Dados', 'Entusiasta de Machine Learning'],
  typeSpeed: 100,
  backSpeed: 60,
  loop: true
});
// Navegação
document.querySelector('.nav-toggler').addEventListener('click', () => {
  const navToggler = document.querySelector('.nav-toggler');
  const aside = document.querySelector('.aside');
  aside.classList.toggle('open');
  navToggler.classList.toggle('active');
  navToggler.classList.add('clicked');
  setTimeout(() => navToggler.classList.remove('clicked'), 300);
});
// Fechar sidebar ao clicar em um link
const navLinks = document.querySelectorAll('.aside .nav li a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.aside').classList.remove('open');
    document.querySelector('.nav-toggler').classList.remove('active');
  });
});

window.addEventListener('load', () => {
  const sidebar = document.querySelector('.aside');
  if (sidebar) sidebar.scrollTop = 0;
});

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

// Animação da Skills 
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
  }, { threshold: 0.1 });

  skillsItems.forEach(item => observer.observe(item));
});
// Efeito 3D na imagem inicial
const homeImg = document.querySelector('.home-img img');
if (homeImg) {
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
}
// Animação da linha do tempo
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

// Efeito ripple nos botões
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
// Altura consistente dos cards do dashboard
function setConsistentCardHeights() {
  const dashboardCards = document.querySelectorAll('.dashboard .flip-card');
  let maxHeight = 0;

  dashboardCards.forEach(card => {
    card.style.height = 'auto';
    const height = card.offsetHeight;
    if (height > maxHeight) maxHeight = height;
  });

  dashboardCards.forEach(card => {
    card.style.height = `${maxHeight}px`;
  });
}

window.addEventListener('load', setConsistentCardHeights);
window.addEventListener('resize', setConsistentCardHeights);

// Cards e flips
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

document.querySelectorAll('.flip-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    trigger.closest('.flip-card').classList.toggle('flipped');
  });
});

document.querySelectorAll('.flip-card-back').forEach(back => {
  back.addEventListener('click', (e) => {
    if (!e.target.closest('a, button, .scrollable-content')) {
      back.closest('.flip-card').classList.remove('flipped');
    }
  });
});