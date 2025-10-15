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

// Sidebar toggle
document.querySelector('.nav-toggler').addEventListener('click', () => {
    const navToggler = document.querySelector('.nav-toggler');
    const aside = document.querySelector('.aside');
    aside.classList.toggle('open');
    navToggler.classList.add('clicked');
    setTimeout(() => {
        navToggler.classList.remove('clicked');
    }, 300);
});

// Close sidebar on link click
const navLinks = document.querySelectorAll('.aside .nav li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.aside').classList.remove('open');
    });
});

// Scroll to top on page load
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
                progressIn.style.setProperty('--progress-width', '0%'); // Reset to 0
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px' // Ensure consistent triggering
    });

    skillsItems.forEach(item => observer.observe(item));
});
// Modern color palette
const colorPalette = [
  { primary: "#5C6BC0", accent: "#FFD54F", text: "#FFFFFF" }, // Indigo with Amber accent
  { primary: "#26A69A", accent: "#EC407A", text: "#FFFFFF" }, // Teal with Pink accent
  { primary: "#FF7043", accent: "#66BB6A", text: "#212121" }, // Coral with Green accent
  { primary: "#78909C", accent: "#FFD54F", text: "#FFFFFF" }, // Slate Blue with Amber accent
];

// Function to calculate luminance for contrast checking
function getLuminance(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Function to check contrast ratio (WCAG-compliant)
function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
}

// Function to adjust color for hover (slightly darker)
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

// Set random skin color from palette
function setRandomSkinColor() {
  const selectedPalette = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  const { primary, accent, text } = selectedPalette;

  // Ensure sufficient contrast for text
  const contrastRatio = getContrastRatio(primary, text);
  const textColor = contrastRatio >= 4.5 ? text : "#FFFFFF"; // WCAG AA compliance
  const hoverColor = adjustColor(primary, -0.2); // 20% darker for hover

  document.documentElement.style.setProperty("--skin-color", primary);
  document.documentElement.style.setProperty("--text-color", textColor);
  document.documentElement.style.setProperty("--hover-color", hoverColor);
  document.documentElement.style.setProperty("--accent-color", accent);

  // Apply to random-color elements
  document.querySelectorAll(".random-color").forEach((element) => {
    element.style.color = accent;
  });
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  setRandomSkinColor();
});