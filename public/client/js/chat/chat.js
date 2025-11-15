// --- DOM ---
const contactListEl = document.querySelector(".contact-list");
const messagesContainer = document.getElementById("messagesContainer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const currentChatUser = document.getElementById("currentChatUser");
const searchInput = document.getElementById("searchInput");

const API_URL = "http://localhost:3000/api/chat";

let currentConversationId = null;
let socket = null;
let currentUserId = null; // sẽ lấy từ server qua socket handshake hoặc API

// --- Helpers ---
function formatTime(isoOrDate) {
    const d = new Date(isoOrDate);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function clearActiveContact() {
    document
        .querySelectorAll(".contact-item")
        .forEach((el) => el.classList.remove("active"));
}

function createContactElement(chat) {
    const div = document.createElement("div");
    div.className = "contact-item";
    div.dataset.roomId = chat.roomId ?? chat.id;
    const name = chat.otherUser?.username || "Admin";
    const avatar = chat.otherUser?.avatar || "/images/default.png";
    const last = chat.lastMessage?.content || "";

    div.innerHTML = `
        <img src="/images/users/${avatar}" alt="${name}" class="contact-avatar" />
        <div class="contact-info">
            <div class="contact-name">${name}</div>
            <div class="contact-status text-truncate">${last}</div>
        </div>
    `;

    div.addEventListener("click", () =>
        openConversation(Number(div.dataset.roomId), name)
    );

    return div;
}

function renderMessage(msg) {
    console.log(msg);
    const isSelf =
        msg.sender && Number(msg.sender.user_id) === Number(currentUserId);
    const wrapper = document.createElement("div");
    wrapper.className = `message ${isSelf ? "sent" : "received"}`;

    const avatarHTML = !isSelf
        ? `<img src="/images/users/${msg.sender?.avatar}" class="message-avatar" alt="">`
        : "";

    const time = formatTime(msg.createdAt || new Date());

    wrapper.innerHTML = `
        ${avatarHTML}
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(msg.content)}</div>
            <div class="message-time">${time} ${
        isSelf ? '<i class="bi bi-check-all text-success ms-1"></i>' : ""
    }</div>
        </div>
    `;
    messagesContainer.appendChild(wrapper);
    scrollToBottom();
}

function escapeHtml(str) {
    if (!str) return "";
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// --- API calls ---
async function fetchConversations() {
    const res = await fetch(`${API_URL}/rooms`, {
        credentials: "include", // ✅ gửi cookie httpOnly
    });
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return await res.json();
}

async function fetchMessages(roomId) {
    const res = await fetch(`${API_URL}/messages/${roomId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch messages");
    return await res.json();
}

async function postMessageApi(roomId, content) {
    const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ gửi cookie JWT
        body: JSON.stringify({ roomId, content }),
    });
    if (!res.ok) throw new Error("Failed to post message via API");
    return await res.json();
}
let typingTimeout;
messageInput.addEventListener("input", () => {
    if (!socket || !socket.connected || !currentConversationId) return;

    socket.emit("typing", { roomId: currentConversationId });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", { roomId: currentConversationId });
    }, 2000); // 2s không gõ thì stop
});
// --- Socket setup ---
function initSocket() {
    socket = io({
        withCredentials: true, // ✅ gửi cookie JWT tự động
    });

    socket.on("connect", () => {
        console.log("✅ Socket connected", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Socket connect_error:", err.message);
    });

    // Server có thể emit user info sau khi xác thực
    socket.on("me", (user) => {
        currentUserId = user.user_id;
        console.log("Current user:", user);
    });

    socket.on("newMessage", (msg) => {
        if (!msg) return;
        if (Number(msg.roomId) === Number(currentConversationId)) {
            renderMessage(msg);
        } else {
            console.log("New message in other room", msg);
        }
    });
    socket.on("userTyping", ({ userId }) => {
        if (Number(userId) === Number(currentUserId)) return;

        // Nếu đã có bubble typing rồi thì không thêm nữa
        if (document.querySelector(".message.typing")) return;

        const typingEl = document.createElement("div");
        typingEl.className = "message received typing";
        typingEl.innerHTML = `
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-dots">
                    <div></div><div></div><div></div>
                </div>
            </div>
        </div>
    `;
        messagesContainer.appendChild(typingEl);
        scrollToBottom();
    });

    socket.on("userStopTyping", ({ userId }) => {
        if (Number(userId) === Number(currentUserId)) return;
        const el = document.querySelector(".message.typing");
        if (el) el.remove();
    });
}

// --- UI actions ---
async function loadConversationsAndRender() {
    try {
        const conversations = await fetchConversations();
        contactListEl.innerHTML = "";
        conversations.forEach((c) => {
            const el = createContactElement(c);
            el.dataset.roomId = c.roomId ?? c.id;
            contactListEl.appendChild(el);
        });
    } catch (err) {
        console.error(err);
    }
}

async function openConversation(roomId, userName) {
    try {
        currentConversationId = Number(roomId);
        currentChatUser.textContent = userName || "Chat";
        clearActiveContact();
        const el = Array.from(document.querySelectorAll(".contact-item")).find(
            (n) => Number(n.dataset.roomId) === Number(roomId)
        );
        if (el) el.classList.add("active");

        if (socket && socket.connected) {
            socket.emit("joinRoom", Number(roomId));
        }

        const messages = await fetchMessages(roomId);
        messagesContainer.innerHTML = "";
        messages.forEach((m) => renderMessage(m));
    } catch (err) {
        console.error("openConversation error:", err);
    }
}

async function handleSendMessage() {
    const content = messageInput.value.trim();
    if (!content || !currentConversationId) return;

    messageInput.value = "";
    scrollToBottom();

    if (socket && socket.connected) {
        socket.emit("sendMessage", { roomId: currentConversationId, content });
        socket.emit("stopTyping", { roomId: currentConversationId });
    } else {
        await postMessageApi(currentConversationId, content);
    }
}

function debounce(fn, wait = 250) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}

document.addEventListener("DOMContentLoaded", async () => {
    initSocket();
    await loadConversationsAndRender();

    sendBtn.addEventListener("click", handleSendMessage);
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSendMessage();
    });

    searchInput?.addEventListener(
        "input",
        debounce((e) => {
            const q = e.target.value.toLowerCase();
            Array.from(document.querySelectorAll(".contact-item")).forEach(
                (el) => {
                    const name =
                        el
                            .querySelector(".contact-name")
                            ?.textContent?.toLowerCase() || "";
                    el.style.display = name.includes(q) ? "flex" : "none";
                }
            );
        }, 200)
    );
});
