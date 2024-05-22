const menuIcon = document.querySelector(".header__menu-icon");
const nav = document.querySelector(".nav");
const closeMenuBtn = document.getElementById("close-menu");

menuIcon.addEventListener("click", () => {
    nav.classList.toggle("open");
});

closeMenuBtn.addEventListener("click", () => {
    nav.classList.remove("open");
});
