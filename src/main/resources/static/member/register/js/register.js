import {
    validateId,
    validateName,
    validatePassword,
    idValidationMessage,
    nameValidationMessage,
    passwordValidationMessage,
    isPasswordEqual, passwordMismatchMessage
} from "../../login/js/validation.js";


document.addEventListener('DOMContentLoaded', async () => {

    document.querySelector('#btn-register').addEventListener('click', () => {
        registerMember();
    });

    document.querySelector('#btn-back-to-login').addEventListener('click', () => {
        location.href = '/login';
    });
});

function registerMember(){
    if(validateRegisterForm()){
        // register available
    }
}

function validateRegisterForm(){
    const registerId = document.querySelector('#register-id').value;
    const registerName = document.querySelector('#register-name').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    if(!validateId(registerId)){
        showRegisterMessage(idValidationMessage);
        return false;
    }

    else if(!validateName(registerName)){
        showRegisterMessage(nameValidationMessage);
        return false;
    }

    else if(!isPasswordEqual(password, passwordConfirm)){
        showRegisterMessage(passwordMismatchMessage);
        return false;
    }

    else if(!validatePassword(password, passwordConfirm)){
        showRegisterMessage(passwordValidationMessage);
        return false;
    }

    return true;
}

function showRegisterMessage(message){
    const messageBox = document.querySelector('#message-box');
    messageBox.textContent = message;
    messageBox.classList.add('show')
}