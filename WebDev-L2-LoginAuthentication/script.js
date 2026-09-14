const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegisterBtn = document.getElementById("showRegisterBtn");
const showLoginBtn = document.getElementById("showLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const dashboardUsername = document.getElementById("dashboardUsername");
const dashboardEmail = document.getElementById("dashboardEmail");


/* Show Registration Form */

showRegisterBtn.addEventListener("click", function () {

    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");

    loginMessage.textContent = "";
});


/* Show Login Form */

showLoginBtn.addEventListener("click", function () {

    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    registerMessage.textContent = "";
});


/* SHA-256 Password Hash */

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


/* Registration */

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username =
        document.getElementById("registerUsername").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim().toLowerCase();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    registerMessage.textContent = "";
    registerMessage.className = "message";


    /* Username Validation */

    if (username.length < 3) {

        showRegisterError(
            "Username must contain at least 3 characters."
        );

        return;
    }


    /* Password Validation */

    const passwordPattern = /^(?=.*\d).{8,}$/;

    if (!passwordPattern.test(password)) {

        showRegisterError(
            "Password must contain at least 8 characters and 1 number."
        );

        return;
    }


    /* Confirm Password */

    if (password !== confirmPassword) {

        showRegisterError(
            "Passwords do not match."
        );

        return;
    }


    /* Get Existing Users */

    const users =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];


    /* Duplicate Email Check */

    const existingUser = users.find(
        user => user.email === email
    );


    if (existingUser) {

        showRegisterError(
            "An account with this email already exists."
        );

        return;
    }


    /* Hash Password */

    const hashedPassword = await hashPassword(password);


    /* Create User */

    const newUser = {
        username: username,
        email: email,
        password: hashedPassword
    };


    users.push(newUser);

    localStorage.setItem(
        "registeredUsers",
        JSON.stringify(users)
    );


    /* Success Message */

    registerMessage.textContent =
        "Registration successful. You can now login.";

    registerMessage.className =
        "message success-message";


    registerForm.reset();
});


/* Login */

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim().toLowerCase();

    const password =
        document.getElementById("loginPassword").value;


    loginMessage.textContent = "";
    loginMessage.className = "message";


    const users =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];


    const hashedPassword = await hashPassword(password);


    const user = users.find(
        user =>
            user.email === email &&
            user.password === hashedPassword
    );


    /* Generic Error Message */

    if (!user) {

        loginMessage.textContent =
            "Invalid email or password.";

        loginMessage.className =
            "message error-message";

        return;
    }


    /* Create Session */

    const sessionUser = {
        username: user.username,
        email: user.email
    };


    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(sessionUser)
    );


    loginForm.reset();

    showDashboard(sessionUser);
});


/* Show Dashboard */

function showDashboard(user) {

    loginSection.classList.add("hidden");
    registerSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");

    dashboardUsername.textContent = user.username;
    dashboardEmail.textContent = user.email;
}


/* Logout */

logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("loggedInUser");

    dashboardSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    loginMessage.textContent =
        "You have been logged out.";

    loginMessage.className =
        "message success-message";
});


/* Protected Dashboard */

function checkSession() {

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));


    if (loggedInUser) {

        showDashboard(loggedInUser);

    } else {

        loginSection.classList.remove("hidden");
        registerSection.classList.add("hidden");
        dashboardSection.classList.add("hidden");
    }
}


/* Registration Error */

function showRegisterError(message) {

    registerMessage.textContent = message;

    registerMessage.className =
        "message error-message";
}


/* Check Login Session When Page Loads */

checkSession();