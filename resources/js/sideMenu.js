const burgerMenu = document.querySelector(".burger-menu");
const navBar = document.querySelector("nav");

burgerMenu.addEventListener("click", () => {
    navBar.style.display = (navBar.style.display === "block") ? "none" : "block";
});
