import axios from "axios";
import getChatSocket, { apiToken, currentUserMySqlId } from "./socket.js";

// UI elements
const chatTextarea = document.querySelector("#chat-textarea");
chatTextarea.style.height = `${chatTextarea.scrollHeight}px`;
chatTextarea.style.overflowY = "hidden";
chatTextarea.disabled = true;

const chatMessages = document.querySelector(".chat-messages");
scrollToMessagesBottom();
const newChatRoomNameInput = document.querySelector('#new-chat-name-input');
const createModalSearchUserInput = document.querySelector('.create-chat-room-window #new-chat-member-input');
const addMemberSearchUserInput = document.querySelector(".add-members-window #new-chat-member-input");
const sendMessageButton = document.querySelector("#send-message-button");
sendMessageButton.disabled = true;
const chatRoomsDiv = document.querySelector(".chat-rooms");
const createChatSubmitButton = document.querySelector('#create-chat-button');
const addMembersSubmitButton = document.querySelector("#add-member-button");
const createModalMembersContainer = document
    .querySelector('.create-chat-room-window .modal-members-container');
const addMembersModalContainer = document.querySelector(".add-members-window .modal-members-container");
const chatTitleElement = document.querySelector('.chat-title');
const chatMembersContainer = document.querySelector(".chat-members div");

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

chatTextarea.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessageButton.click();
    }
});

openCreateChatButton.addEventListener("click", () => {
    modalWindow.style.display = "flex";
    createChatRoomWindow.style.display = "flex";

    newChatRoomNameInput.value = "";
    createModalSearchUserInput.value = "";
    selectedParticipantsForNewRoom.clear();
});

openAddMembersSpan.addEventListener("click", () => {
    if (!currentActiveRoomId)
        return;

    const activeRoom = userRooms.find(room => room._id === currentActiveRoomId);
    if (activeRoom && activeRoom.participant_mysql_user_ids)
        currentActiveRoomParticipants = new Set(activeRoom.participant_mysql_user_ids.map(id => parseInt(id, 10)));
    else
        currentActiveRoomParticipants.clear();

    addMemberSearchUserInput.value = '';
    selectedUserIdsToAddInModal.clear();

    modalWindow.style.display = "flex";
    addMembersWindow.style.display = "flex";
});

modalCloseButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest(".modal-window > div").style.display = "none";
        modalWindow.style.display = "none";
    });
});

sendMessageButton.addEventListener("click", () => {
    const messageText = chatTextarea.value.trim();

    if (messageText && currentActiveRoomId && chatSocket && chatSocket.connected) {
        chatSocket.emit('sendMessage', { roomId: currentActiveRoomId, content: messageText });
        chatTextarea.value = '';
        chatTextarea.focus();
    }
});

createChatSubmitButton.addEventListener("click", () => {
    const roomName = newChatRoomNameInput ? newChatRoomNameInput.value.trim() : '';
    if (!roomName)
        return;

    let participantIds = Array.from(selectedParticipantsForNewRoom);

    if (!participantIds.length)
        return;

    if (currentUserMySqlId && !participantIds.includes(currentUserMySqlId))
        participantIds.push(currentUserMySqlId);

    console.log('Creating room with name:', roomName, 'and participants:', participantIds);
    chatSocket.emit('createRoom', { roomName: roomName, participantIds: participantIds });
});

addMembersSubmitButton.addEventListener("click", async () => {
    if (!currentActiveRoomId || !selectedUserIdsToAddInModal.size)
        return;

    console.log(`Attempting to add users to room ${currentActiveRoomId}:`, Array.from(selectedUserIdsToAddInModal));

    chatSocket.emit('addMembersToRoom', {
        roomId: currentActiveRoomId,
        newUserIdsToAdd: Array.from(selectedUserIdsToAddInModal)
    });
});

const debouncedSearchUsers = debounce(searchUsers, 500);

createModalSearchUserInput.addEventListener('input', e => {
    debouncedSearchUsers(e.target.value);
});

const debouncedAddSearchUsers = debounce(searchUsersForAdding, 500);

addMemberSearchUserInput.addEventListener("input", e => {
    debouncedAddSearchUsers(e.target.value)
});

function scrollToMessagesBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function selectAndJoinRoom(roomId) {
    if (!roomId || !chatSocket || !chatSocket.connected) {
        console.warn("Cannot select room: No room ID or socket not connected.");
        return;
    }

    console.log(`Attempting to select and join room: ${roomId}`);

    currentActiveRoomId = roomId;
    chatMessages.innerHTML = '<p style="text-align:center; padding:20px;">Loading messages...</p>';
    chatSocket.emit('joinRoom', { roomId: roomId });
}

function updateRoomNotification(roomId, senderName) {
    console.log(`Notification for room ${roomId} from ${senderName}`);
}

function renderChatRoomsList(rooms) {
    chatRoomsDiv.innerHTML = '';

    if (!rooms || !rooms.length) {
        chatRoomsDiv.innerHTML = '<p style="padding:10px; text-align:center;">No chats found.</p>';
        return;
    }

    rooms.forEach(room => {
        const roomDiv = document.createElement('div');
        roomDiv.classList.add('chat-room');
        roomDiv.dataset.roomId = room._id;

        const img = document.createElement('img');
        img.src = '/images/blank-profile-picture.jpg';
        img.alt = room.name;

        const p = document.createElement('p');
        p.classList.add('chat-room-name');
        p.textContent = room.name;

        roomDiv.appendChild(img);
        roomDiv.appendChild(p);
        roomDiv.addEventListener('click', () => selectAndJoinRoom(room._id));
        chatRoomsDiv.appendChild(roomDiv);
    });
    highlightActiveRoom(currentActiveRoomId);
}

function highlightActiveRoom(roomId) {
    if (!roomId)
        return;

    chatRoomsDiv.querySelectorAll('.chat-room').forEach(div => {
        if (div.dataset.roomId === roomId)
            div.classList.add('chat-room-active');
        else
            div.classList.remove('chat-room-active');
    });
}

function clearRoomNotification(roomId) {
    if (!roomId)
        return;

    const roomDiv = chatRoomsDiv.querySelector(`.chat-room[data-room-id="${roomId}"]`);
    if (roomDiv) {
        const notifDot = roomDiv.querySelector('.notification-dot');
        if (notifDot)
            notifDot.remove();

        const roomNameP = roomDiv.querySelector('.chat-room-name');
        if (roomNameP)
            roomNameP.style.fontWeight = 'normal';
    }
}

async function appendMessageToChat(message) {
    let userData = await axios
        .get(`http://127.0.0.1:8000/api/chat/get_user/${message.sender_mysql_user_id}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("api_token"),
            }
        });
    userData = userData.data;

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');

    if (message.sender_mysql_user_id === currentUserMySqlId)
        messageDiv.classList.add('chat-message-mine');
    else
        messageDiv.classList.add('chat-message-others');

    const img = document.createElement('img');
    img.src = '/images/blank-profile-picture.jpg';
    img.alt = 'User';

    const messageInnerDiv = document.createElement("div");

    const senderP = document.createElement("p");
    senderP.classList.add("chat-message-sender-name");
    senderP.innerText = userData.user_name || "Sender Name";

    const contentP = document.createElement('p');
    contentP.classList.add("chat-message-text");
    contentP.innerText = message.content;

    messageInnerDiv.appendChild(senderP);
    messageInnerDiv.appendChild(contentP);

    messageDiv.appendChild(img);
    messageDiv.appendChild(messageInnerDiv);

    chatMessages.appendChild(messageDiv);

    scrollToMessagesBottom();
}

function debounce(func, delay) {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function displayUsersInChatModal(users) {
    createModalMembersContainer.innerHTML = '';

    if (!users || !users.length) {
        createModalMembersContainer.innerHTML = '<p style="padding:10px; text-align:center;">No users found.</p>';
        return;
    }

    users.forEach(user => {
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('modal-member');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = user.id;
        checkbox.checked = selectedParticipantsForNewRoom.has(user.id);
        checkbox.addEventListener('change', () => {
            checkbox.checked
                ? selectedParticipantsForNewRoom.add(user.id)
                : selectedParticipantsForNewRoom.delete(user.id);

            console.log("Selected participants:", Array.from(selectedParticipantsForNewRoom));
        });

        const img = document.createElement('img');
        img.src = '/images/blank-profile-picture.jpg';
        img.alt = user.name;

        const p = document.createElement('p');
        p.textContent = user.name;

        memberDiv.appendChild(checkbox);
        memberDiv.appendChild(img);
        memberDiv.appendChild(p);
        createModalMembersContainer.appendChild(memberDiv);
    });
}

function displayUsersInAddModal(users) {
    addMembersModalContainer.innerHTML = "";

    if (!users || !users.length) {
        addMembersModalContainer.innerHTML = '<p style="padding:10px; text-align:center;">No users found or all match current members.</p>';
        return;
    }

    users.forEach(user => {
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('modal-member');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = user.id;
        checkbox.checked = selectedUserIdsToAddInModal.has(user.id);
        checkbox.addEventListener('change', () => {
            checkbox.checked
                ? selectedUserIdsToAddInModal.add(user.id)
                : selectedUserIdsToAddInModal.delete(user.id);

            console.log("Selected participants:", Array.from(selectedUserIdsToAddInModal));
        });

        const img = document.createElement('img');
        img.src = '/images/blank-profile-picture.jpg';
        img.alt = user.name;

        const p = document.createElement('p');
        p.textContent = user.name;

        memberDiv.appendChild(checkbox);
        memberDiv.appendChild(img);
        memberDiv.appendChild(p);
        addMembersModalContainer.appendChild(memberDiv);
    });
}

async function searchUsers(query) {
    if (!query)
        return;

    try {
        console.log(`Searching users with query: ${query}`);

        const response = await axios.get(`http://127.0.0.1:8000/api/chat/search-users`, {
            params: { q: query },
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Accept': 'application/json'
            }
        });

        displayUsersInChatModal(response.data);
    } catch (error) {
        console.error('Error searching users:', error.response ? error.response.data : error.message);
        createModalMembersContainer.innerHTML = '<p style="padding:10px; text-align:center; color:red;">Error loading users.</p>';
    }
}

async function searchUsersForAdding(query) {
    if (!query)
        return;

    if (!currentActiveRoomId) {
        console.error("No active room selected for adding members.");
        return;
    }

    const excludeIds = new Set(currentActiveRoomParticipants);
    if (currentUserMySqlId)
        excludeIds.add(currentUserMySqlId);

    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/chat/search-users`, {
            params: {
                q: query,
                exclude_ids: Array.from(excludeIds).join(",")
            },
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Accept': 'application/json'
            }
        });
        displayUsersInAddModal(response.data);
    } catch (error) {
        console.error('Error searching users:', error.response ? error.response.data : error.message);
        createModalMembersContainer.innerHTML = '<p style="padding:10px; text-align:center; color:red;">Error loading users.</p>';
    }
}

async function displayRoomMembers(roomParticipants) {
    chatMembersContainer.innerHTML = "";

    for (const participantId of roomParticipants) {
        let userData = await axios
            .get(`http://127.0.0.1:8000/api/chat/get_user/${participantId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("api_token"),
                }
            });

        userData = userData.data;

        let chatMember = document.createElement("span");
        chatMember.title = userData.user_name;

        let memberImg = document.createElement("img");
        memberImg.src = "/images/blank-profile-picture.jpg";
        memberImg.alt = userData.user_name;

        let onlineStatusSpan = document.createElement("span");
        onlineStatusSpan.classList.add("member-online-status");
        onlineStatusSpan.classList.add(`member-online-status-${userData.user_is_online ? "active" : "inactive"}`);

        chatMember.appendChild(memberImg);
        chatMember.appendChild(onlineStatusSpan);

        chatMembersContainer.appendChild(chatMember);
    }
}

function handleRoomOpeningFromHash() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith("#room_"))
        return;

    const roomId = hash.substring(6);
    if (!roomId)
        return;

    console.log(`Found room ID in hash: ${roomId}. Attempting to open.`);
    const attemptToOpenRoom = () => {
        if (userRooms && userRooms.length) {
            const roomExists = userRooms.some(room => room._id === roomId);

            if (roomExists)
                selectAndJoinRoom(roomId);
            else
                console.warn(`Room ${roomId} from hash not found in user's room list.`);

            history.replaceState(null, document.title, window.location.pathname + window.location.search);
        } else {
            console.log("User rooms not loaded yet, retrying to open from hash soon...");

            setTimeout(attemptToOpenRoom, 1000);
        }
    };
    attemptToOpenRoom();
}

// Socket elements
const chatSocket = getChatSocket();
let currentActiveRoomId = null;

let userRooms = [];
let selectedParticipantsForNewRoom = new Set();

let currentActiveRoomParticipants = new Set();
let selectedUserIdsToAddInModal = new Set();

if (apiToken && chatSocket) {
    chatSocket.on("chat_connected", () => {
        handleRoomOpeningFromHash();
    });

    window.addEventListener("hashchange", () => {
        handleRoomOpeningFromHash();
    }, false);

    chatSocket.on("userRoomsList", rooms => {
        console.log("Received user rooms list:", rooms);

        userRooms = rooms;
        renderChatRoomsList(rooms);
    });

    chatSocket.on("roomCreated", newRoom => {
        console.log("Room created successfully:", newRoom);

        if (!userRooms.find(r => r._id === newRoom._id))
            userRooms.unshift(newRoom);
        else
            userRooms = userRooms.map(r => r._id === newRoom._id ? newRoom : r);

        userRooms.sort((a, b) =>
            new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp));
        renderChatRoomsList(userRooms);
        selectAndJoinRoom(newRoom._id);

        modalWindow.style.display = "none";
        createChatRoomWindow.style.display = "none";
    });

    chatSocket.on("addedToNewRoom", newRoom => {
        console.log("You were added to a new room:", newRoom);

        if (!userRooms.find(r => r._id === newRoom._id)) {
            userRooms.unshift(newRoom);
            userRooms.sort((a,b) =>
                new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp));
            renderChatRoomsList(userRooms);

            if (!currentActiveRoomId) {
                selectAndJoinRoom(newRoom._id);
            } else {
                updateRoomNotification(newRoom._id, "New Room");
            }
        }
    });

    chatSocket.on("joinedRoomSuccess", data => {
        console.log(`Successfully joined room: ${data.roomName} (ID: ${data.roomId})`);

        console.log(data);

        currentActiveRoomId = data.roomId;

        chatTitleElement.textContent = data.roomName;

        sendMessageButton.disabled = false;
        chatTextarea.disabled = false;

        displayRoomMembers(data.roomParticipants);
        highlightActiveRoom(data.roomId);
        clearRoomNotification(data.roomId);
    });

    chatSocket.on("roomMessages", async data => {
        if (data.roomId === currentActiveRoomId) {
            console.log(`Received messages for room ${data.roomId}:`, data.messages);

            chatMessages.innerHTML = '';

            for (const msg of data.messages)
                await appendMessageToChat(msg);

            scrollToMessagesBottom();
        }
    });

    chatSocket.on('roomError', error => {
        console.error('Room Error:', error.message);
    });

    chatSocket.on("newMessage", async message => {
        console.log("New message received:", message);

        if (message.room_id === currentActiveRoomId)
            await appendMessageToChat(message);
        else
            updateRoomNotification(message.room_id, message.sender_name);
    });

    chatSocket.on("messageError", error => {
        console.error("Message Error:", error.message)
    });
} else {
    console.error("API token not found. Chat functionality will be disabled.");
}
