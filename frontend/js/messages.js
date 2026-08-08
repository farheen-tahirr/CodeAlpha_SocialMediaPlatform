const token = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));

if (!token || !storedUser) {
    window.location.href = "login.html";
}


// ======================
// ELEMENTS
// ======================

const usersList =
    document.getElementById("messageUsersList");

const searchInput =
    document.getElementById("messageUserSearch");

const messagesList =
    document.getElementById("messagesList");

const chatHeader =
    document.getElementById("chatHeader");

const messageInput =
    document.getElementById("messageInput");

const sendMessageBtn =
    document.getElementById("sendMessageBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


// ======================
// VARIABLES
// ======================

let allUsers = [];

let selectedUser = null;


// ======================
// LOAD USERS
// ======================

async function loadUsers() {

    try {

        const response = await fetch(
            `${API_URL}/api/users`
        );

        const users = await response.json();

        if (!response.ok) {

            throw new Error(
                users.message || "Unable to load users"
            );

        }

        allUsers = users.filter(
            user =>
                String(user._id) !==
                String(storedUser._id)
        );

        renderUsers(allUsers);

    } catch (error) {

        console.log(error);

        usersList.innerHTML = `
            <p class="loading">
                Unable to load users.
            </p>
        `;

    }

}


// ======================
// RENDER USERS
// ======================

function renderUsers(users) {

    usersList.innerHTML = "";

    if (!users.length) {

        usersList.innerHTML = `
            <p class="loading">
                No users found.
            </p>
        `;

        return;

    }

    users.forEach(user => {

        const userElement =
            document.createElement("div");

        userElement.className =
            "message-user";

        if (
            selectedUser &&
            String(selectedUser._id) ===
            String(user._id)
        ) {

            userElement.classList.add("active");

        }

        const firstLetter =
            user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U";

        userElement.innerHTML = `

            <div class="message-user-avatar">
                ${firstLetter}
            </div>

            <div class="message-user-info">

                <div class="message-user-name">
                    ${user.name}
                </div>

                <div class="message-user-role">
                    ${user.role || "Student"}
                </div>

            </div>

        `;

        userElement.onclick = () => {

            selectUser(user);

        };

        usersList.appendChild(userElement);

    });

}


// ======================
// SEARCH USERS
// ======================

searchInput.addEventListener(
    "input",
    function () {

        const value =
            this.value
                .toLowerCase()
                .trim();

        const filtered =
            allUsers.filter(user =>

                user.name
                    .toLowerCase()
                    .includes(value)

            );

        renderUsers(filtered);

    }
);


// ======================
// SELECT USER
// ======================

function selectUser(user) {

    selectedUser = user;

    chatHeader.innerHTML = `

        <strong>
            ${user.name}
        </strong>

        <div class="post-meta">
            ${user.role || "Student"}
            ${user.university
                ? " • " + user.university
                : ""}
        </div>

    `;

    messageInput.disabled = false;

    sendMessageBtn.disabled = false;

    renderUsers(
        allUsers.filter(
            u =>
                u.name
                    .toLowerCase()
                    .includes(
                        searchInput.value
                            .toLowerCase()
                    )
        )
    );

    loadConversation();

}


// ======================
// LOAD CONVERSATION
// ======================

async function loadConversation() {

    if (!selectedUser) return;

    try {

        const response = await fetch(

            `${API_URL}/api/messages/${selectedUser._id}`,

            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }

        );

        const messages =
            await response.json();

        if (!response.ok) {

            throw new Error(
                messages.message ||
                "Unable to load messages"
            );

        }

        renderMessages(messages);

    } catch (error) {

        console.log(error);

        messagesList.innerHTML = `
            <p class="loading">
                Unable to load messages.
            </p>
        `;

    }

}


// ======================
// RENDER MESSAGES
// ======================

function renderMessages(messages) {

    messagesList.innerHTML = "";

    if (!messages.length) {

        messagesList.innerHTML = `
            <p class="loading">
                No messages yet. Start the conversation!
            </p>
        `;

        return;

    }

    messages.forEach(message => {

        const isSent =
            String(message.sender._id) ===
            String(storedUser._id);

        const messageElement =
            document.createElement("div");

        messageElement.className =
            `message ${
                isSent
                    ? "sent"
                    : "received"
            }`;

        const date =
            new Date(message.createdAt);

        const time =
            date.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        messageElement.innerHTML = `

            <div class="message-bubble">

                ${escapeHTML(message.content)}

                <div class="message-time">
                    ${time}
                </div>

            </div>

        `;

        messagesList.appendChild(
            messageElement
        );

    });

    messagesList.scrollTop =
        messagesList.scrollHeight;

}


// ======================
// SEND MESSAGE
// ======================

sendMessageBtn.onclick =
    sendMessage;


messageInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


async function sendMessage() {

    if (!selectedUser) return;

    const content =
        messageInput.value.trim();

    if (!content) return;

    sendMessageBtn.disabled = true;

    try {

        const response = await fetch(

            `${API_URL}/api/messages`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    receiver:
                        selectedUser._id,

                    content

                })

            }

        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to send message"
            );

            return;

        }

        messageInput.value = "";

        await loadConversation();

    } catch (error) {

        console.log(error);

        alert(
            "Unable to connect to server."
        );

    } finally {

        sendMessageBtn.disabled = false;

        messageInput.focus();

    }

}


// ======================
// ESCAPE HTML
// ======================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ======================
// LOGOUT
// ======================

logoutBtn.onclick = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";

};


// ======================
// START
// ======================

loadUsers();