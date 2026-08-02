// ==========================================
// CampusSphere - Profile Page
// ==========================================

const token = localStorage.getItem("token");
const storedUserRaw = localStorage.getItem("user");

if (!token || !storedUserRaw) {
    window.location.href = "login.html";
}

const storedUser = JSON.parse(storedUserRaw);

const API_BASE = "http://localhost:3000";


// ==========================================
// WHICH PROFILE ARE WE VIEWING?
// ==========================================

const params = new URLSearchParams(window.location.search);

const profileUserId =
    params.get("user") || storedUser._id;


// ==========================================
// ELEMENTS
// ==========================================

const profileName = document.getElementById("profileName");
const profileRole = document.getElementById("profileRole");
const profileUniversity = document.getElementById("profileUniversity");
const profileBio = document.getElementById("profileBio");
const profileAvatar = document.getElementById("profileAvatar");

const editProfileBtn =
    document.getElementById("editProfileBtn");

const followBtn =
    document.getElementById("followBtn");

const editModal =
    document.getElementById("editModal");

const bioInput =
    document.getElementById("bioInput");

const universityInput =
    document.getElementById("universityInput");

const roleInput =
    document.getElementById("roleInput");

const cancelEdit =
    document.getElementById("cancelEdit");

const saveProfile =
    document.getElementById("saveProfile");


// People modal

const peopleModal =
    document.getElementById("peopleModal");

const peopleModalTitle =
    document.getElementById("peopleModalTitle");

const peopleList =
    document.getElementById("peopleList");

const closePeopleModal =
    document.getElementById("closePeopleModal");


// ==========================================
// CURRENT PROFILE DATA
// ==========================================

let currentProfile = null;


// ==========================================
// LOAD PROFILE
// ==========================================

async function loadProfile() {

    try {

       const response = await fetch(
    `${API_BASE}/api/users/${profileUserId}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

        const user = await response.json();

        if (!response.ok) {
            throw new Error(
                user.message || "Unable to load profile"
            );
        }

        currentProfile = user;

        console.log("PROFILE:", user);


        // Name
        profileName.textContent =
            user.name || "CampusSphere User";


        // Role
        profileRole.textContent =
            user.role || "Student";


        // University
        profileUniversity.textContent =
            user.university || "University not added";


        // Bio
        profileBio.textContent =
            user.bio || "No bio yet.";


        // Avatar
        profileAvatar.textContent =
            (user.name || "U")
                .charAt(0)
                .toUpperCase();


        // Stats
        document.getElementById("followersCount").textContent =
            user.followers?.length || 0;

        document.getElementById("followingCount").textContent =
            user.following?.length || 0;


        // ==========================================
        // OWN PROFILE OR OTHER PROFILE?
        // ==========================================

        const isOwnProfile = user._id === storedUser._id;

if (isOwnProfile) {

    // My own profile
    editProfileBtn.style.display = "inline-flex";
    followBtn.style.display = "none";

} else {

    // Someone else's profile
    editProfileBtn.style.display = "none";
    followBtn.style.display = "inline-flex";

   followBtn.textContent =
    user.isFollowing
        ? "Following"
        : "Follow";
}
        await loadUserPosts();

    } catch (error) {

        console.error("LOAD PROFILE ERROR:", error);

        profileName.textContent = "Unable to load profile";

    }

}


// ==========================================
// LOAD USER POSTS
// ==========================================

async function loadUserPosts() {

    try {

        const response = await fetch(
            `${API_BASE}/api/posts/user/${profileUserId}`
        );

        const posts = await response.json();

        if (!response.ok) {
            throw new Error(
                posts.message || "Unable to load posts"
            );
        }


        const container =
            document.getElementById("userPosts");

        container.innerHTML = "";


        document.getElementById("postCount").textContent =
            posts.length;


        if (posts.length === 0) {

            container.innerHTML = `
                <div class="empty-posts">

                    <h3>No posts yet</h3>

                    <p>
                        Share your first thought with CampusSphere.
                    </p>

                </div>
            `;

            return;
        }


        posts.forEach(post => {

           const user = post.user || {};

const isMe = String(user._id) === String(storedUser._id);

const userName = isMe
    ? "You"
    : (user.name || "CampusSphere User");

const role =
    user.role || "Student";

const university =
    user.university || "";

            const postCard =
                document.createElement("article");

            postCard.className =
                "post-card";


            postCard.innerHTML = `

                <div class="post-header">

                    <div class="avatar">
                        ${userName.charAt(0).toUpperCase()}
                    </div>

                    <div>

                        <div class="post-user">

    ${escapeHTML(userName)}

    ${isMe
        ? `<span class="you-badge">YOU</span>`
        : ""}

</div>

                        <div class="post-meta">
                            ${escapeHTML(role)}
                            ${university
                                ? " • " + escapeHTML(university)
                                : ""}
                        </div>

                    </div>

                </div>


                <div class="post-content">
                    ${escapeHTML(post.content)}
                </div>


                <div class="post-actions">

    <button
        class="like-btn"
        data-post-id="${post._id}">
        ❤️ ${post.likes?.length || 0}
    </button>

    <button
        class="comment-btn"
        data-post-id="${post._id}">
        💬 Comment
    </button>

    <button
        class="share-btn"
        data-post-id="${post._id}">
        ↗ Share
    </button>

</div>

            `;

            container.appendChild(postCard);

        });

        attachProfileLikeEvents();
attachProfileShareEvents();
    } catch (error) {

        console.error("LOAD POSTS ERROR:", error);

        document.getElementById("userPosts").innerHTML = `
            <div class="empty-posts">
                <h3>Unable to load posts</h3>
                <p>Please refresh the page.</p>
            </div>
        `;
    }

}
// ==========================================
// PROFILE LIKE EVENTS
// ==========================================

function attachProfileLikeEvents() {

    document.querySelectorAll(".like-btn").forEach(button => {

        button.onclick = async () => {

            const postId = button.dataset.postId;

            try {

                const response = await fetch(
                    `${API_BASE}/api/posts/${postId}/like`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    return alert(data.message);
                }

                button.innerHTML = `❤️ ${data.likes}`;

            } catch (error) {

                console.error(error);
                alert("Unable to like post.");

            }

        };

    });

}


// ==========================================
// PROFILE SHARE EVENTS
// ==========================================

function attachProfileShareEvents() {

    document.querySelectorAll(".share-btn").forEach(button => {

        button.onclick = async () => {

            const postId = button.dataset.postId;

            const shareUrl =
                `${window.location.origin}/profile.html?user=${profileUserId}#post-${postId}`;

            try {

                await navigator.clipboard.writeText(shareUrl);

                alert("Post link copied.");

            } catch {

                alert("Unable to copy link.");

            }

        };

    });

}


// ==========================================
// EDIT PROFILE
// ==========================================

if (editProfileBtn) {

    editProfileBtn.addEventListener("click", () => {

        bioInput.value =
            currentProfile?.bio || "";

        universityInput.value =
            currentProfile?.university || "";

        roleInput.value =
            currentProfile?.role || "Student";

        editModal.classList.add("active");

    });

}


// ==========================================
// CANCEL EDIT
// ==========================================

if (cancelEdit) {

    cancelEdit.addEventListener("click", () => {

        editModal.classList.remove("active");

    });

}


// ==========================================
// CLOSE EDIT WHEN CLICKING OUTSIDE
// ==========================================

if (editModal) {

    editModal.addEventListener("click", event => {

        if (event.target === editModal) {

            editModal.classList.remove("active");

        }

    });

}


// ==========================================
// SAVE PROFILE
// ==========================================

if (saveProfile) {

    saveProfile.addEventListener("click", async () => {

        try {

            saveProfile.disabled = true;

            saveProfile.textContent = "Saving...";


            const response = await fetch(
                `${API_BASE}/api/users/profile`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        bio: bioInput.value.trim(),

                        university:
                            universityInput.value.trim(),

                        role:
                            roleInput.value

                    })

                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to update profile"
                );

            }


            // Update screen
            profileBio.textContent =
                data.user.bio || "No bio yet.";

            profileUniversity.textContent =
                data.user.university ||
                "University not added";

            profileRole.textContent =
                data.user.role ||
                "Student";


            // Update localStorage
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            editModal.classList.remove("active");


            alert("Profile updated successfully.");

        } catch (error) {

            console.error(error);

            alert(error.message);

        } finally {

            saveProfile.disabled = false;

            saveProfile.textContent =
                "Save Changes";

        }

    });

}


// ==========================================
// FOLLOW / UNFOLLOW
// ==========================================

if (followBtn) {

    followBtn.addEventListener("click", async () => {

        try {

            followBtn.disabled = true;


            const response = await fetch(
                `${API_BASE}/api/users/${profileUserId}/follow`,
                {

                    method: "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to follow user"
                );

            }


            await loadProfile();

        } catch (error) {

            console.error(error);

            alert(error.message);

        } finally {

            followBtn.disabled = false;

        }

    });

}


// ==========================================
// FOLLOWERS CLICK
// ==========================================

document
    .getElementById("followersStat")
    .addEventListener("click", () => {

        showPeople(
            "Followers",
            currentProfile?.followers || []
        );

    });


// ==========================================
// FOLLOWING CLICK
// ==========================================

document
    .getElementById("followingStat")
    .addEventListener("click", () => {

        showPeople(
            "Following",
            currentProfile?.following || []
        );

    });


// ==========================================
// SHOW PEOPLE
// ==========================================

function showPeople(title, people) {

    peopleModalTitle.textContent =
        title;

    peopleList.innerHTML = "";


    if (!people.length) {

        peopleList.innerHTML = `
            <div class="empty-people">
                No ${title.toLowerCase()} yet.
            </div>
        `;

    } else {

        people.forEach(person => {

             const isMe =
    String(person._id) === String(storedUser._id);

const name = isMe
    ? "You"
    : (person.name || "CampusSphere User");

            const role =
                person.role || "Student";


            const item =
                document.createElement("div");

           item.className = "people-list-item";

item.style.cursor = "pointer";

item.onclick = () => {

    peopleModal.classList.remove("active");

    window.location.href =
        `profile.html?user=${person._id}`;

};


            item.innerHTML = `

                <div class="people-avatar">
                    ${name.charAt(0).toUpperCase()}
                </div>

                <div class="people-info">

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                    <span>
                        ${escapeHTML(role)}
                    </span>

                </div>

            `;


            peopleList.appendChild(item);

        });

    }


    peopleModal.classList.add("active");

}


// ==========================================
// CLOSE PEOPLE MODAL
// ==========================================

if (closePeopleModal) {

    closePeopleModal.addEventListener("click", () => {

        peopleModal.classList.remove("active");

    });

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href =
            "login.html";

    });

}


// ==========================================
// HELPERS
// ==========================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// START
// ==========================================

loadProfile();
