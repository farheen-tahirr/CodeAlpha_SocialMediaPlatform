const token = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));

if (!token || !storedUser) {
    window.location.href = "login.html";
}

const usersContainer = document.getElementById("usersContainer");
const searchInput = document.getElementById("searchUser");

let allUsers = [];

// ======================
// LOAD USERS
// ======================

async function loadUsers() {

    try {

        const response = await fetch(`${API_URL}/api/users`);

        const users = await response.json();

        allUsers = users;

        renderUsers(users);

    } catch (error) {

        console.log(error);

        usersContainer.innerHTML = `
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

    usersContainer.innerHTML = "";

    const filteredUsers = users.filter(
        user => user._id !== storedUser._id
    );

    if (filteredUsers.length === 0) {

        usersContainer.innerHTML = `
            <p class="loading">
                No users found.
            </p>
        `;

        return;

    }

    filteredUsers.forEach(user => {

        const following =
            user.followers.includes(storedUser._id);

        usersContainer.innerHTML += `

<div class="post-card">

    <div class="post-header">

        <div
            class="avatar"
            onclick="window.location.href='profile.html?user=${user._id}'"
            style="cursor:pointer;"
        >
            ${user.name.charAt(0).toUpperCase()}
        </div>

        <div style="flex:1">

            <div
                class="post-user"
                onclick="window.location.href='profile.html?user=${user._id}'"
                style="cursor:pointer;"
            >
                ${user.name}
            </div>

            <div class="post-meta">
                ${user.role} • ${user.university}
            </div>

        </div>

        <button
            class="follow-btn"
            data-user-id="${user._id}"
        >
            ${following ? "Following" : "Follow"}
        </button>

    </div>

</div>

`;

    });

    attachFollowEvents();

}

// ======================
// FOLLOW / UNFOLLOW
// ======================

function attachFollowEvents() {

    document.querySelectorAll(".follow-btn").forEach(button => {

        button.onclick = async () => {

            const userId = button.dataset.userId;

            try {

                await fetch(
                    `${API_URL}/api/users/${userId}/follow`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                loadUsers();

            } catch (error) {

                console.log(error);

            }

        };

    });

}

// ======================
// SEARCH USERS
// ======================

searchInput.addEventListener("input", function () {

    console.log(this.value);

    const value = this.value.toLowerCase();

    const filtered = allUsers.filter(user =>

        user.name.toLowerCase().includes(value) ||

        user.role.toLowerCase().includes(value) ||

        user.university.toLowerCase().includes(value)

    );

    renderUsers(filtered);

});
// ======================
// LOGOUT
// ======================

document.getElementById("logoutBtn").onclick = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

};

// ======================
// START
// ======================

loadUsers();