import {
    validateId,
    validateName,
    validatePassword,
    idValidationMessage,
    nameValidationMessage,
    passwordValidationMessage,
    isPasswordEqual, passwordMismatchMessage
} from "../../login/js/validation.js";
import {apiPostRequest} from "../../../global/js/api.js";


document.addEventListener('DOMContentLoaded', async () => {

    document.querySelector('#btn-register').addEventListener('click', async () => {
        await registerMember();
    });

    document.querySelector('#btn-back-to-login').addEventListener('click', () => {
        location.href = '/login';
    });
});

async function registerMember(){
    const { validationResult , form : requestBody } = validateRegisterForm();
    if( validationResult ){
        const {status, data } = await postMember(requestBody);

        if ( status !== 200 ){
            showRegisterMessage(data.message);
        } else {
            alert('가입이 완료되었습니다.') // 임시
            location.href = '/login';
        }
    }
}

function validateRegisterForm(){
    const registerId = document.querySelector('#register-id').value;
    const registerName = document.querySelector('#register-name').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    if(!validateId(registerId)){
        showRegisterMessage(idValidationMessage);
        return {validationResult : false, form :{} };
    }

    else if(!validateName(registerName)){
        showRegisterMessage(nameValidationMessage);
        return {validationResult : false, form :{} };
    }

    else if(!isPasswordEqual(password, passwordConfirm)){
        showRegisterMessage(passwordMismatchMessage);
        return {validationResult : false, form :{} };
    }

    else if(!validatePassword(password)){
        showRegisterMessage(passwordValidationMessage);
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

function showRegisterMessage(message){
    const messageBox = document.querySelector('#message-box');
    messageBox.textContent = message;
    messageBox.classList.add('show')
}

async function postMember(requestBody){
    return await apiPostRequest('member', {}, requestBody);
}
