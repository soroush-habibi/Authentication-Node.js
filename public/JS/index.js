const loginButton = document.querySelector("#loginButton");
const signUpButton = document.querySelector("#signUpButton");
const formContainer = document.querySelector(".form-container");
const container = document.querySelector(".container");
const change = document.querySelector("#change");

let pageStatus = 0;         //1 => login        2 => sign Up

signUpButton.addEventListener('click', (e) => {
    formContainer.classList.remove('d-none');
    container.classList.add('d-none');

    formContainer.querySelector("#email-input").classList.remove("d-none");
    formContainer.querySelector("#password2-input").classList.remove("d-none");

    change.innerHTML = "You have account already? click here";

    pageStatus = 2;
});

loginButton.addEventListener('click', (e) => {
    formContainer.classList.remove('d-none');
    container.classList.add('d-none');

    formContainer.querySelector("#email-input").classList.add("d-none");
    formContainer.querySelector("#password2-input").classList.add("d-none");

    change.innerHTML = "You dont have acount? click here";

    pageStatus = 1;
});

change.addEventListener('click', (e) => {
    if (pageStatus === 1) {
        formContainer.querySelector("#email-input").classList.remove("d-none");
        formContainer.querySelector("#password2-input").classList.remove("d-none");

        change.innerHTML = "You have account already? click here";

        pageStatus = 2;
    } else if (pageStatus === 2) {
        formContainer.querySelector("#email-input").classList.add("d-none");
        formContainer.querySelector("#password2-input").classList.add("d-none");

        change.innerHTML = "You dont have acount? click here";

        pageStatus = 1;
    }
});