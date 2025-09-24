/* toggle switcher */
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
        }
    });

     function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function getContrastColor(hex) {
      hex = hex.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#000000" : "#ffffff";
    }

    // Make a hover color (slightly darker)
    function adjustColor(hex, percent) {
      hex = hex.replace("#", "");
      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);

      r = Math.min(255, Math.max(0, r + (r * percent)));
      g = Math.min(255, Math.max(0, g + (g * percent)));
      b = Math.min(255, Math.max(0, b + (b * percent)));

      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    function setRandomSkinColor() {
      const newColor = getRandomColor();
      const contrast = getContrastColor(newColor);
      const hover = adjustColor(newColor, -0.2); // 20% darker

      document.documentElement.style.setProperty("--skin-color", newColor);
      document.documentElement.style.setProperty("--text-color", contrast);
      document.documentElement.style.setProperty("--hover-color", hover);
    }

    // Run once on page load
    setRandomSkinColor();
}