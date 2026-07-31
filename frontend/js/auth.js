const API_URL = "http://localhost:3000";


// ======================
// LOGIN
// ======================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(`${API_URL}/api/auth/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Login failed");

                return;
            }

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("Login successful! 🎉");

            window.location.href = "index.html";

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to server. Make sure your backend is running."
            );

        }

    });

}


// ======================
// REGISTER
// ======================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const role = document.getElementById("role").value;

        const university =
            document.getElementById("university").value.trim();


        try {

            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name,
                        email,
                        password,
                        role,
                        university

                    })

                }
            );

            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message || "Registration failed"
                );

                return;
            }


            alert(
                "Account created successfully! 🎉"
            );


            // Go to login page

            window.location.href = "login.html";


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to server. Make sure your backend is running."
            );

        }

    });

}
// ======================
// PASSWORD VISIBILITY
// ======================

const toggleLoginPassword =
    document.getElementById("toggleLoginPassword");

if (toggleLoginPassword) {

    toggleLoginPassword.addEventListener("click", () => {

        const password =
            document.getElementById("password");

        if (password.type === "password") {

            password.type = "text";

            toggleLoginPassword.textContent = "🙈";

            toggleLoginPassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            password.type = "password";

            toggleLoginPassword.textContent = "👁️";

            toggleLoginPassword.setAttribute(
                "aria-label",
                "Show password"
            );
        }

    });

}


const toggleRegisterPassword =
    document.getElementById("toggleRegisterPassword");

if (toggleRegisterPassword) {

    toggleRegisterPassword.addEventListener("click", () => {

        const password =
            document.getElementById("password");

        if (password.type === "password") {

            password.type = "text";

            toggleRegisterPassword.textContent = "🙈";

            toggleRegisterPassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            password.type = "password";

            toggleRegisterPassword.textContent = "👁️";

            toggleRegisterPassword.setAttribute(
                "aria-label",
                "Show password"
            );
        }

    });

}