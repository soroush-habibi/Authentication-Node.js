const loginButton = document.querySelector("#loginButton");
const signUpButton = document.querySelector("#signUpButton");
const formContainer = document.querySelector(".form-container");
const container = document.querySelector(".container");
const change = document.querySelector("#change");
const form = document.querySelector("form");
const submitButton = document.querySelector("#submit");
const authBox = document.querySelector(".auth");
const notAuthBox = document.querySelector(".not-auth");
const loggedInText = document.querySelector("#logged-in-text");
const loadingText = document.querySelector("#loading-text");

const usernameInput = document.querySelector("#username-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const passwordInput2 = document.querySelector("#password2-input");

let pageStatus = 0;         //1 => login        2 => sign Up

document.addEventListener("DOMContentLoaded", async (e) => {
    try {
        const { data } = await axios.get("/verify");
        if (data.success) {
            loggedInText.innerHTML = `You logged in as ${data.body}`;
            loadingText.classList.add("d-none");
            authBox.classList.remove("d-none");
        }
    } catch (e) {
        loadingText.classList.add("d-none");
        notAuthBox.classList.remove("d-none");
    }
});

signUpButton.addEventListener('click', (e) => {
    formContainer.classList.remove('d-none');
    container.classList.add('d-none');

    formContainer.querySelectorAll("label")[1].classList.remove("d-none");
    formContainer.querySelectorAll("label")[3].classList.remove("d-none");

    change.innerHTML = "You have account already? click here";

    pageStatus = 2;
});

loginButton.addEventListener('click', (e) => {
    formContainer.classList.remove('d-none');
    container.classList.add('d-none');

    formContainer.querySelectorAll("label")[1].classList.add("d-none");
    formContainer.querySelectorAll("label")[3].classList.add("d-none");

    change.innerHTML = "You dont have acount? click here";

    pageStatus = 1;
});

change.addEventListener('click', (e) => {
    if (pageStatus === 1) {
        formContainer.querySelectorAll("label")[1].classList.remove("d-none");
        formContainer.querySelectorAll("label")[3].classList.remove("d-none");

        change.innerHTML = "You have account already? click here";

        pageStatus = 2;
    } else if (pageStatus === 2) {
        formContainer.querySelectorAll("label")[1].classList.add("d-none");
        formContainer.querySelectorAll("label")[3].classList.add("d-none");

        change.innerHTML = "You dont have acount? click here";

        pageStatus = 1;
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (pageStatus === 1) {
        if (usernameInput.value.length <= 5) {
            alert("username should be bigger than 5 character");
            return;
        } else if (passwordInput.value.length < 8) {
            alert("password should be at least 8 character");
            return;
        }
        try {
            submitButton.disabled = true;
            const response = await axios.get(`/login?input=${usernameInput.value}&password=${passwordInput.value}`, { timeout: 10000 });
            const data = await response.data;
            submitButton.disabled = false;

            if (data.success) {
                loggedInText.innerHTML = `You logged in as ${usernameInput.value}`;
                authBox.classList.remove("d-none");
                notAuthBox.classList.add("d-none");
                formContainer.classList.add("d-none");
            } else {
                alert(data.message);
            }
        } catch (e) {
            submitButton.disabled = false;
            console.log(e.message);
        }
    } else if (pageStatus === 2) {

    }
});