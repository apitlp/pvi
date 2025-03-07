const notificationIcon = document.querySelector('.notification-icon');
const notificationIconCircle = document.querySelector('.notification-icon-circle');
const notificationContainer = document.querySelector('.notification-container');

const profileName = document.querySelector('.profile p');
const profileMenu = document.querySelector('.profile-menu');

notificationIcon.addEventListener('mouseover', () => {
    notificationContainer.style.display = 'block';
});

notificationIcon.addEventListener('click', () => {
    if (notificationIconCircle.classList.contains('notification-icon-circle-active')) {
        notificationIconCircle.classList.remove('notification-icon-circle-active');
    }
});

notificationContainer.addEventListener("mouseleave", e => {
    notificationContainer.style.display = 'none';
});

window.addEventListener('keydown', e => {
    if (e.key === 'Escape')
        notificationIconCircle.classList.add('notification-icon-circle-active');
});

profileName.addEventListener('mouseover', () => {
    profileMenu.style.display = 'block';
});

profileMenu.addEventListener('mouseleave', () => {
    profileMenu.style.display = 'none';
});

