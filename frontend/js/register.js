const form = document.getElementById("register-form");
const statusEl = document.getElementById("status");
const submitButton = document.getElementById("register-button");

function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "status" + (type ? " " + type : "");
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!username || !email || !password || !confirmPassword) {
        setStatus("Please fill in all fields.", "error");
        return;
    }

    if (password.length < 8) {
        setStatus("Password must be at least 8 characters.", "error");
        return;
    }

    if (password !== confirmPassword) {
        setStatus("Passwords do not match.", "error");
        return;
    }

    submitButton.disabled = true;
    setStatus("Creating your account...");

    try {
        const response = await fetch(API_BASE_URL + "/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            setStatus(data.message || "Registration failed.", "error");
            return;
        }

        form.reset();
        setStatus((data.message || "Account created.") + " You can log in now.", "success");
    } catch (error) {
        setStatus("Cannot reach the server. Is the backend running on port 5000?", "error");
    } finally {
        submitButton.disabled = false;
    }
});
