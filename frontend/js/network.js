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
// ==========================================
// TRENDING
// ==========================================

async function loadNetworkTrending() {

    const container =
        document.getElementById("trendingContainer");

    if (!container) return;

    try {

        const response =
            await fetch(`${API_URL}/api/posts/trending`);

        const trending =
            await response.json();

        if (!response.ok) {
            throw new Error("Unable to load trending");
        }

        container.innerHTML = "";

        if (!trending.length) {

            container.innerHTML = `
                <p class="loading">
                    No trending topics yet.
                </p>
            `;

            return;
        }

        trending.forEach(item => {

            const trend =
                document.createElement("div");

            trend.className = "side-item";

            trend.innerHTML = `
                <strong
                    class="trending-hashtag"
                    data-hashtag="${item.tag}"
                    style="cursor:pointer;"
                >
                    ${item.tag}
                </strong>

                <span>
                    ${item.posts}
                    ${item.posts === 1 ? "post" : "posts"}
                </span>
            `;

            container.appendChild(trend);

        });

        document
            .querySelectorAll(".trending-hashtag")
            .forEach(hashtag => {

                hashtag.onclick = () => {

                    const selected =
                        hashtag.dataset.hashtag.toLowerCase();

                    document
                        .querySelectorAll("#usersContainer")
                        .forEach(container => {

                            // Network users are not filtered by hashtags.
                            // Hashtag filtering is handled on the homepage.
                        });

                    window.location.href =
                        `index.html?hashtag=${encodeURIComponent(selected)}`;

                };

            });

    } catch (error) {

        console.log(error);

        container.innerHTML = `
            <p class="loading">
                Unable to load trending topics.
            </p>
        `;

    }

}


// ==========================================
// ALUMNI
// ==========================================

async function loadNetworkAlumni() {

    const container =
        document.getElementById("alumniContainer");

    if (!container) return;

    try {

        const response =
            await fetch(`${API_URL}/api/users`);

        const users =
            await response.json();

        if (!response.ok) {
            throw new Error("Unable to load alumni");
        }

        const alumni =
            users.filter(
                user => user.role === "Alumni"
            );

        container.innerHTML = "";

        if (!alumni.length) {

            container.innerHTML = `
                <p class="loading">
                    No alumni available.
                </p>
            `;

            return;
        }

        alumni.slice(0, 3).forEach(user => {

            const item =
                document.createElement("div");

            item.className = "profile-mini alumni-item";

            item.style.cursor = "pointer";

            item.onclick = () => {

                window.location.href =
                    `profile.html?user=${user._id}`;

            };

            item.innerHTML = `

                <div class="mini-avatar">
                    ${user.name.charAt(0).toUpperCase()}
                </div>

                <div>

                    <strong>
                        ${user.name}
                    </strong>

                    <p>
                        ${user.university || "Campus Alumni"}
                    </p>

                </div>

            `;

            container.appendChild(item);

        });

    } catch (error) {

        console.log(error);

        container.innerHTML = `
            <p class="loading">
                Unable to load alumni.
            </p>
        `;

    }

}


// ==========================================
// START RIGHT PANEL
// ==========================================

loadNetworkTrending();
loadNetworkAlumni();