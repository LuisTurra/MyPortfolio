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