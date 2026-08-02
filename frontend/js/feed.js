// ==========================================
// CampusSphere Feed
// ==========================================

const token = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));

if (!token || !storedUser) {
    window.location.href = "login.html";
}

// ==========================================
// Welcome
// ==========================================

const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome back, ${storedUser.name} 👋`;
}

// ==========================================
// LOAD POSTS
// ==========================================

async function loadPosts() {

    const postsContainer =
        document.getElementById("postsContainer");

    try {

        const response =
            await fetch(`${API_URL}/api/posts`);

        const posts =
            await response.json();

        if (!response.ok) {
            throw new Error(posts.message);
        }

        postsContainer.innerHTML = "";

        if (!posts.length) {

            postsContainer.innerHTML = `
                <p class="loading">
                    No posts yet.
                </p>
            `;

            return;
        }

        posts.forEach(post => {

            const isMe =
                String(post.user?._id) ===
                String(storedUser._id);

            const userName =
                isMe
                    ? "You"
                    : (post.user?.name || "CampusSphere User");

            const role =
                post.user?.role || "Student";

            const university =
                post.user?.university || "";

            const likeCount =
                post.likes?.length || 0;

            const liked =
                post.likes?.includes(storedUser._id);

            const postCard =
                document.createElement("div");

            postCard.className = "post-card";

            postCard.innerHTML = `

                <div class="post-header">

                    <a href="profile.html?user=${post.user._id}" class="avatar-link">

                        <div class="avatar">
                            ${isMe ? "Y" : userName.charAt(0).toUpperCase()}
                        </div>

                    </a>

                    <div>

                        <div class="post-user">

                            ${userName}

                        </div>

                        <div class="post-meta">

                            ${role}
                            ${university ? " • " + university : ""}

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

                        ${liked ? "❤️" : "🤍"} ${likeCount}

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

        attachLikeEvents();

        attachShareEvents();

    }

    catch (error) {

        console.log(error);

        postsContainer.innerHTML = `
            <p class="loading">
                Unable to load posts.
            </p>
        `;

    }

}
// ==========================================
// LIKE / UNLIKE POSTS
// ==========================================

function attachLikeEvents() {

    document.querySelectorAll(".like-btn").forEach(button => {

        button.onclick = async () => {

            const postId = button.dataset.postId;

            try {

                const response = await fetch(
                    `${API_URL}/api/posts/${postId}/like`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {

                    alert(data.message || "Unable to like post");

                    return;

                }

                // Reload feed so like count & heart stay correct
                loadPosts();

            } catch (error) {

                console.log(error);

                alert("Unable to connect to server.");

            }

        };

    });

}


// ==========================================
// SHARE POSTS
// ==========================================

function attachShareEvents() {

    document.querySelectorAll(".share-btn").forEach(button => {

        button.onclick = async () => {

            const postId = button.dataset.postId;

            const shareLink =
                `${window.location.origin}/frontend/profile.html?post=${postId}`;

            try {

                await navigator.clipboard.writeText(shareLink);

                alert("Post link copied!");

            } catch {

                alert("Unable to copy link.");

            }

        };

    });

}


// ==========================================
// CREATE POST
// ==========================================

const createPostBtn =
    document.getElementById("createPostBtn");

if (createPostBtn) {

    createPostBtn.addEventListener("click", async () => {

        const postContent =
            document
                .getElementById("postContent")
                .value
                .trim();

        if (!postContent) {

            alert("Please write something first.");

            return;

        }

        try {

            const response =
                await fetch(
                    `${API_URL}/api/posts`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json",

                            Authorization: `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            content: postContent

                        })

                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(data.message);

                return;

            }

            document.getElementById("postContent").value = "";

            loadPosts();

        } catch (error) {

            console.log(error);

            alert("Unable to create post.");

        }

    });

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.onclick = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href = "login.html";

    };

}


// ==========================================
// START
// ==========================================

loadPosts();