const chatTextarea = document.querySelector("#chat-textarea");
chatTextarea.style.height = `${chatTextarea.scrollHeight}px`;
chatTextarea.style.overflowY = "hidden";

const chatMessages = document.querySelector(".chat-messages");
scrollToMessagesBottom();

const modalWindow = document.querySelector(".modal-window");
const createChatRoomWindow = document.querySelector(".create-chat-room-window");
const addMembersWindow = document.querySelector(".add-members-window");
const modalCloseButtons = document.querySelectorAll(".modal-close-button");
const openCreateChatButton = document.querySelector("#open-create-chat-button");
const openAddMembersSpan = document.querySelector("#open-add-members-span");

chatTextarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;
});

openCreateChatButton.addEventListener("click", () => {
    modalWindow.style.display = "flex";
    createChatRoomWindow.style.display = "flex";
});

openAddMembersSpan.addEventListener("click", () => {
    modalWindow.style.display = "flex";
    addMembersWindow.style.display = "flex";
})

modalCloseButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest(".modal-window > div").style.display = "none";
        modalWindow.style.display = "none";
    });
});

function scrollToMessagesBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
