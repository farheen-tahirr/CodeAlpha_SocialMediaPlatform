const token = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));

if (!token || !storedUser) {
    window.location.href = "login.html";
}

const emailText = document.getElementById("userEmail");
const memberSinceText = document.getElementById("memberSince");

const darkModeToggle = document.getElementById("darkModeToggle");
const publicProfileToggle = document.getElementById("publicProfileToggle");

const logoutBtn = document.getElementById("logoutBtn2");
const deleteBtn = document.getElementById("deleteAccountBtn");deleteBtn.onclick = async () => {

    const ok = confirm(
        "Are you sure you want to permanently delete your account?"
    );

    if (!ok) return;

    try {

        const response = await fetch(
            `${API_URL}/api/users/profile`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "register.html";

        }

    } catch (error) {

        console.log(error);

        alert("Unable to delete account.");

    }

};
// ======================
// LOAD USER
// ======================

async function loadSettings() {

    try {

        const response = await fetch(
            `${API_URL}/api/users/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const user = await response.json();

        emailText.textContent =
            user.email || "Not Available";

        if (user.createdAt) {

            const joined =
                new Date(user.createdAt);

            memberSinceText.textContent =
                joined.toLocaleDateString();

        }

    } catch (error) {

        console.log(error);

    }

}

// ======================
// DARK MODE
// ======================

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;

}

darkModeToggle.onchange = () => {

    document.body.classList.toggle("dark-mode");

    localStorage.setItem(

        "theme",

        darkModeToggle.checked
            ? "dark"
            : "light"

    );

};

// ======================
// PUBLIC PROFILE
// ======================

publicProfileToggle.onchange = () => {

    localStorage.setItem(

        "profileVisibility",

        publicProfileToggle.checked
            ? "public"
            : "campus"

    );

};

// Restore toggle

if (
    localStorage.getItem("profileVisibility")
    === "public"
) {

    publicProfileToggle.checked = true;

}

// ======================
// LOGOUT
// ======================

logoutBtn.onclick = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

};

loadSettings();