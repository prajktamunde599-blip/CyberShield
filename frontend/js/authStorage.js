const TOKEN_KEY = "cybershield_token";
const USER_KEY = "cybershield_user";

function saveAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

function requireAuth() {
    if (!getToken()) {
        window.location.replace("login.html");
        return false;
    }

    return true;
}
