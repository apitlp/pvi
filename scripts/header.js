const notificationWrapper = document.querySelector(".notification-wrapper");
const notificationIcon = document.querySelector(".notification-icon");
const notificationIconCircle = document.querySelector(".notification-icon-circle");
const notificationContainer = document.querySelector(".notification-container");

const profileContainer = document.querySelector(".profile");
const profileMenu = document.querySelector(".profile-menu");

notificationWrapper.addEventListener("mouseover", () => {
    notificationContainer.style.display = 'block';
});

notificationWrapper.addEventListener("mouseleave", () => {
    notificationContainer.style.display = 'none';
});

notificationIcon.addEventListener('click', () => {
    if (notificationIconCircle.classList.contains('notification-icon-circle-active')) {
        notificationIconCircle.classList.remove('notification-icon-circle-active');
    }
});

window.addEventListener('keydown', e => {
    if (e.key === 'Escape')
        notificationIconCircle.classList.add('notification-icon-circle-active');
});

profileContainer.addEventListener('mouseover', () => {
    profileMenu.style.display = 'block';
});

profileContainer.addEventListener('mouseleave', () => {
    profileMenu.style.display = 'none';
});

