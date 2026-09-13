const form = document.getElementById("login-form");
const statusEl = document.getElementById("status");
const submitButton = document.getElementById("login-button");

function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "status" + (type ? " " + type : "");
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        setStatus("Email and password are required.", "error");
        return;
    }

    submitButton.disabled = true;
    setStatus("Signing you in...");

    try {
        const response = await fetch(API_BASE_URL + "/api/auth/login", {
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
            setStatus(data.message || "Login failed.", "error");
            return;
        }

        if (!data.token) {
            setStatus("Login succeeded but no token was returned.", "error");
            return;
        }

        saveAuth(data.token, data.user);

        const profileResponse = await fetch(API_BASE_URL + "/api/auth/profile", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + getToken()
            }
        });

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
            setStatus(profileData.message || "Logged in, but profile check failed.", "error");
            return;
        }

        window.location.replace("dashboard.html");
    } catch (error) {
        setStatus("Cannot reach the server. Is the backend running on port 5000?", "error");
    } finally {
        submitButton.disabled = false;
    }
});
