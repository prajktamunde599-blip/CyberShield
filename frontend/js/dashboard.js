if (!requireAuth()) {
    // Stop here while the browser redirects to login.html
} else {
    const headerUsername = document.getElementById("header-username");
    const welcomeTitle = document.getElementById("welcome-title");
    const welcomeText = document.getElementById("welcome-text");
    const profileUsername = document.getElementById("profile-username");
    const profileEmail = document.getElementById("profile-email");
    const profileRole = document.getElementById("profile-role");
    const logoutButton = document.getElementById("logout-button");

    function goToLogin() {
        clearAuth();
        window.location.replace("login.html");
    }

    logoutButton.addEventListener("click", () => {
        goToLogin();
    });

    async function loadDashboard() {
        try {
            const response = await fetch(API_BASE_URL + "/api/auth/profile", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + getToken()
                }
            });

            const data = await response.json();

            if (response.status === 401) {
                goToLogin();
                return;
            }

            if (!response.ok || !data.user) {
                welcomeText.textContent = data.message || "Could not load your profile.";
                return;
            }

            const user = data.user;

            headerUsername.textContent = user.username;
            welcomeTitle.textContent = "Welcome, " + user.username;
            welcomeText.textContent = user.role === "admin"
                ? "You are signed in as an admin. Admin tools will be added in a later phase."
                : "You are signed in as a learner. Topics and quizzes will be added next.";

            profileUsername.textContent = user.username;
            profileEmail.textContent = user.email;
            profileRole.textContent = user.role;
        } catch (error) {
            welcomeText.textContent = "Cannot reach the server. Is the backend running on port 5000?";
        }
    }

    loadDashboard();
}

const headerUsername = document.getElementById("header-username");
const welcomeTitle = document.getElementById("welcome-title");
const welcomeText = document.getElementById("welcome-text");
const profileUsername = document.getElementById("profile-username");
const profileEmail = document.getElementById("profile-email");
const profileRole = document.getElementById("profile-role");
const logoutButton = document.getElementById("logout-button");

function goToLogin() {
    clearAuth();
    window.location.replace("login.html");
}

logoutButton.addEventListener("click", () => {
    goToLogin();
});

async function loadDashboard() {
    try {
        const response = await fetch(API_BASE_URL + "/api/auth/profile", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + getToken()
            }
        });

        const data = await response.json();

        if (response.status === 401) {
            goToLogin();
            return;
        }

        if (!response.ok || !data.user) {
            welcomeText.textContent = data.message || "Could not load your profile.";
            return;
        }

        const user = data.user;

        headerUsername.textContent = user.username;
        welcomeTitle.textContent = "Welcome, " + user.username;
        welcomeText.textContent = user.role === "admin"
            ? "You are signed in as an admin. Admin tools will be added in a later phase."
            : "You are signed in as a learner. Topics and quizzes will be added next.";

        profileUsername.textContent = user.username;
        profileEmail.textContent = user.email;
        profileRole.textContent = user.role;
    } catch (error) {
        welcomeText.textContent = "Cannot reach the server. Is the backend running on port 5000?";
    }
}

loadDashboard();
