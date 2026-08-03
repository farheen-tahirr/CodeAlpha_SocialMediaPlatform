// ==========================================
// CampusSphere Feed
// ==========================================

const token = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));
let currentPostId = null;

const commentModal = document.getElementById("commentModal");
const commentsList = document.getElementById("commentsList");
const commentInput = document.getElementById("commentInput");
const sendCommentBtn = document.getElementById("sendCommentBtn");
const closeCommentModal = document.getElementById("closeCommentModal");

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
    String(post.user?._id) === String(storedUser._id);

const realName =
    post.user?.name || "CampusSphere User";

const userName =
    isMe ? "You" : realName;

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
    ${realName.charAt(0).toUpperCase()}
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
        💬 ${post.commentCount || 0}
    </button>

    <button
        class="share-btn"
        data-post-id="${post._id}"
    >
        ↗ Share
    </button>

    ${isMe ? `
    <button
        class="delete-post-btn"
        data-post-id="${post._id}"
    >
        🗑 Delete
    </button>
    ` : ""}

</div>

            `;

            postsContainer.appendChild(postCard);

        });

       attachLikeEvents();

attachShareEvents();

attachCommentEvents();

attachDeletePostEvents();
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
// DELETE POSTS
// ==========================================

function attachDeletePostEvents() {

    document.querySelectorAll(".delete-post-btn").forEach(button => {

        button.onclick = async () => {

            const postId = button.dataset.postId;

            const confirmDelete = confirm(
                "Are you sure you want to delete this post?"
            );

            if (!confirmDelete) return;

            try {

                const response = await fetch(
                    `${API_URL}/api/posts/${postId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {

                    alert(data.message);

                    return;

                }

                alert("Post deleted successfully.");

                loadPosts();

            } catch (error) {

                console.log(error);

                alert("Unable to delete post.");

            }

        };

    });

}
function attachDeleteCommentEvents() {

    document.querySelectorAll(".delete-comment-btn").forEach(button => {

        button.onclick = async () => {

            const commentId = button.dataset.commentId;

            console.log("Comment ID:", commentId);

            try {

                const response = await fetch(
                    `${API_URL}/api/comments/${commentId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("Status:", response.status);

                const data = await response.json();

                console.log(data);

                if (!response.ok) {

                    alert(data.message);
                    return;

                }

                loadComments(currentPostId);
                loadPosts();

            } catch (error) {

                console.log(error);

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

function attachCommentEvents() {

    console.log("Comment events attached");

    document.querySelectorAll(".comment-btn").forEach(button => {

        button.onclick = async () => {

            console.log("Comment button clicked");

            currentPostId = button.dataset.postId;

            commentModal.classList.add("active");

            loadComments(currentPostId);

        };

    });

}
async function loadComments(postId) {

    const response = await fetch(`${API_URL}/api/comments/${postId}`);

    const comments = await response.json();

    commentsList.innerHTML = "";

    if (comments.length === 0) {

        commentsList.innerHTML = "<p>No comments yet.</p>";

        return;

    }

   comments.forEach(comment => {

    const isMe =
        String(comment.user._id) === String(storedUser._id);

    const realName =
        comment.user.name || "CampusSphere User";

    const avatarLetter =
        realName.charAt(0).toUpperCase();

    commentsList.innerHTML += `

        <div class="comment-item">

            <div
                class="comment-avatar"
                onclick="window.location.href='profile.html?user=${comment.user._id}'"
            >
                ${avatarLetter}
            </div>

            <div class="comment-body">

                <div class="comment-header">

                    <div
                        class="comment-name"
                        onclick="window.location.href='profile.html?user=${comment.user._id}'"
                    >
                        ${realName}
                    </div>

                    ${
                        isMe
                            ? `<span class="you-badge">YOU</span>`
                            : ""
                    }

                </div>

               <div class="comment-footer">

    <p class="comment-text">
        ${comment.content}
    </p>

    ${
        isMe
        ? `
        <button
            class="delete-comment-btn"
            data-comment-id="${comment._id}"
        >
            🗑
        </button>
        `
        : ""
    }

</div>

            </div>

        </div>

    `;

});
attachDeleteCommentEvents();
}
if (sendCommentBtn) {

    sendCommentBtn.onclick = async () => {

    if (!commentInput.value.trim()) return;

    const response = await fetch(

        `${API_URL}/api/comments/${currentPostId}`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify({

                content: commentInput.value

            })

        }

    );

    if (response.ok) {

        commentInput.value = "";

        loadComments(currentPostId);

    }

};
}
if (closeCommentModal) {

    closeCommentModal.onclick = () => {

        commentModal.classList.remove("active");

    };

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