// ======================
// CHECK LOGIN
// ======================

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

if (!token) {
    window.location.href = "login.html";
}

// ======================
// DISPLAY USER
// ======================

if (storedUser) {

    const user = JSON.parse(storedUser);

    const welcomeMessage = document.getElementById("welcomeMessage");

    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${user.name} 👋`;
    }
}

// ======================
// LOAD POSTS
// ======================

async function loadPosts() {

    const postsContainer = document.getElementById("postsContainer");

    try {

        const response = await fetch(`${API_URL}/api/posts`);

        const posts = await response.json();

        if (!response.ok) {
            throw new Error(posts.message || "Unable to load posts");
        }

        if (posts.length === 0) {

            postsContainer.innerHTML = `
                <p class="loading">
                    No posts yet. Be the first to post! 🎉
                </p>
            `;

            return;
        }

        postsContainer.innerHTML = "";

        posts.forEach(post => {

            const postCard = document.createElement("div");
            postCard.className = "post-card";

            const userName = post.user?.name || "CampusSphere User";
            const role = post.user?.role || "Student";
            const university = post.user?.university || "";
            const likeCount = post.likes ? post.likes.length : 0;
            // ======================
// LIKE POSTS
// ======================

document.querySelectorAll(".like-btn").forEach(button => {

    button.addEventListener("click", async () => {

        const postId =
            button.dataset.postId;

        try {

            const response = await fetch(
                `${API_URL}/api/posts/${postId}/like`,
                {

                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to like post"
                );

                return;
            }


            button.innerHTML =
                `❤️ ${data.likes}`;


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to server."
            );

        }

    });

});
// ======================
// SHARE POSTS
// ======================

document.querySelectorAll(".share-btn").forEach(button => {

    button.addEventListener("click", async () => {

        const postId =
            button.dataset.postId;

        const shareUrl =
            `${window.location.origin}/frontend/index.html#post-${postId}`;

        try {

            await navigator.clipboard.writeText(shareUrl);

            alert("Post link copied.");

        } catch (error) {

            alert("Unable to copy post link.");

        }

    });

});


            postCard.innerHTML = `

                <div class="post-header">

                    <a href="profile.html?user=${post.user?._id}" class="avatar-link">

                        <div class="avatar">
                            ${userName.charAt(0).toUpperCase()}
                        </div>

                    </a>

                    <div>

                        <div class="post-user">
                            ${userName}
                        </div>

                        <div class="post-meta">
                            ${role}${university ? " • " + university : ""}
                        </div>

                    </div>

                </div>

                <div class="post-content">
                    ${post.content}
                </div>

                <div class="post-actions">

    <button
        class="like-btn"
        data-post-id="${post._id}"
    >
        ❤️ ${likeCount}
    </button>

    <button
        class="comment-btn"
        data-post-id="${post._id}"
    >
        💬 Comment
    </button>

    <button
        class="share-btn"
        data-post-id="${post._id}"
    >
        ↗ Share
    </button>

</div>

            `;

            postsContainer.appendChild(postCard);

        });

    } catch (error) {

        console.error(error);

        postsContainer.innerHTML = `
            <p class="loading">
                Unable to load posts.
            </p>
        `;
    }
}

// ======================
// CREATE POST
// ======================

const createPostBtn = document.getElementById("createPostBtn");

if (createPostBtn) {

    createPostBtn.addEventListener("click", async () => {

        const postContent = document
            .getElementById("postContent")
            .value
            .trim();

        if (!postContent) {

            alert("Please write something first.");

            return;
        }

        try {

            const response = await fetch(`${API_URL}/api/posts`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    content: postContent
                })

            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Unable to create post");

                return;
            }

            document.getElementById("postContent").value = "";

            loadPosts();

        } catch (error) {

            console.error(error);

            alert("Unable to connect to server.");
        }

    });

}

// ======================
// LOGOUT
// ======================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";

    });

}

// ======================
// START
// ======================

loadPosts();