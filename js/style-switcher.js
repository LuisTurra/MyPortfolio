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
}