import {registerMember} from "./register-api.js";
import {RegisterExceptionHandler} from "./exception/register-exception-handler.js";
import {buildValidatedRegisterForm} from "./register-form-data-builder.js";

const registerExceptionHandler = new RegisterExceptionHandler();

document.addEventListener('DOMContentLoaded', async () => {
    setupRegisterPage();
});

function setupRegisterPage(){
    addRegisterEvents();
}

function addRegisterEvents(){

    // 게정생성 버튼 이벤트
    document.querySelector('#btn-register').addEventListener('click', signUp);

    // 로그인 버튼 이벤트
    document.querySelector('#btn-back-to-login').addEventListener('click', moveToLoginPage);
}

async function signUp(){

    const { validationResult , form : requestBody } = buildValidatedRegisterForm();

    try {
        if( validationResult ){
            await registerMember(requestBody);
            alert('가입이 완료되었습니다.') // 임시
        }
    } catch(error){
        registerExceptionHandler.handle(error, {context :'registerMember'});
    }
}

function moveToLoginPage(){
    location.href = '/login';
}