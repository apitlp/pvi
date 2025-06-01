import getChatSocket, { apiToken } from "./socket.js";

const notificationWrapper = document.querySelector(".notification-wrapper");
const notificationIcon = document.querySelector(".notification-icon");
const notificationIconCircle = document.querySelector(".notification-icon-circle");
const notificationContainer = document.querySelector(".notification-container");

const profileContainer = document.querySelector(".profile");
const profileMenu = document.querySelector(".profile-menu");

notificationWrapper.addEventListener("mouseover", () => {
    notificationContainer.style.display = 'flex';
});

notificationWrapper.addEventListener("mouseleave", () => {
    notificationContainer.style.display = 'none';
    notificationIconCircle.classList.remove('notification-icon-circle-active');
});

notificationIcon.addEventListener('click', () => {
    if (notificationIconCircle.classList.contains('notification-icon-circle-active')) {
        notificationIconCircle.classList.remove('notification-icon-circle-active');
    }
});

profileContainer.addEventListener('mouseover', () => {
    profileMenu.style.display = 'block';
});

profileContainer.addEventListener('mouseleave', () => {
    profileMenu.style.display = 'none';
});

const chatSocket = getChatSocket();

if (apiToken) {
    chatSocket.on("newNotification", data => {
        console.log("Notification received");
        console.log(data);

        const messageContent = data.message.content;
        const roomName = data.room.name;
        const roomId = data.room._id;

        renderNotification(messageContent, roomName, roomId);

        setTimeout(() => {
            notificationIconCircle.classList.add("notification-icon-circle-active");
        }, 2000);
    });
}

function renderNotification(messageContent, roomName, roomId) {
    const notificationDiv = document.createElement("div");
    notificationDiv.classList.add("notification");
    notificationDiv.dataset.roomId = roomId;

    const notificationUserDiv = document.createElement("div");
    notificationUserDiv.classList.add("notification-user");

    const userImg = document.createElement("img");
    userImg.src = "/images/blank-profile-picture.jpg";

    const userNameP = document.createElement("p");
    userNameP.innerText = roomName;

    notificationUserDiv.appendChild(userImg);
    notificationUserDiv.appendChild(userNameP);

    const notificationMessage = document.createElement("p");
    notificationMessage.classList.add("notification-message");
    notificationMessage.innerText = messageContent;

    notificationDiv.appendChild(notificationUserDiv);
    notificationDiv.appendChild(notificationMessage);

    notificationDiv.addEventListener("click", () => {
        const clickedRoomId = notificationDiv.dataset.roomId;

        window.location.href = `/messages#room_${clickedRoomId}`;
    });

    if (notificationContainer.children.length >= 3)
        notificationContainer.removeChild(notificationContainer.querySelector(".notification:first-child"));

    notificationContainer.appendChild(notificationDiv);
}

