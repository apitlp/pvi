import io from "socket.io-client";

const socketIoUrl = "http://localhost:3000";
const apiToken = sessionStorage.getItem("api_token");
let chatSocket = null;

let currentUserMySqlId = null;

function getChatSocket() {
    if (!chatSocket && apiToken) {
        chatSocket = io(socketIoUrl, {
            auth: {
                token: apiToken
            }
        });

        chatSocket.on("connect", () => {
            console.log("Attempting to connect to chat server...");
        });

        chatSocket.on("chat_connected", data => {
            console.log("Successfully connected and authenticated with chat server!", data);

            currentUserMySqlId = data.mysql_user_id;
        });

        chatSocket.on("disconnect", reason => {
            console.log("Disconnected from chat server:", reason);
        });

        chatSocket.on("connect_error", err => {
            console.error("Chat connection error:", err.message);
        });
    }

    return chatSocket;
}

export default getChatSocket;
export { currentUserMySqlId, apiToken };
