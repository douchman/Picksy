import {
    validateId,
    validateName,
    validatePassword,
    idValidationMessage,
    nameValidationMessage,
    passwordValidationMessage,
    isPasswordEqual, passwordMismatchMessage
} from "./register-validation.js";

export function buildValidatedRegisterForm(registerFormData){
    const registerId = document.querySelector('#register-id').value;
    const registerName = document.querySelector('#register-name').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    if(!validateId(registerId)){
        showValidationMessage(idValidationMessage);
        return {validationResult : false, form :{} };
    }

    else if(!validateName(registerName)){
        showValidationMessage(nameValidationMessage);
        return {validationResult : false, form :{} };
    }

    else if(!isPasswordEqual(password, passwordConfirm)){
        showValidationMessage(passwordMismatchMessage);
        return {validationResult : false, form :{} };
    }

    else if(!validatePassword(password)){
        showValidationMessage(passwordValidationMessage);
        return {validationResult : false, form :{} };
    }

    return {
        validationResult : true,
        form :{
            loginId : registerId,
            memberName : registerName,
            password : password
        } };
}


function showValidationMessage(message){
    const messageBox = document.querySelector('#message-box');
    messageBox.textContent = message;
    messageBox.classList.add('show')
}
