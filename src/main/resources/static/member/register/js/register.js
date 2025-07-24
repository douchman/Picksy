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

// 계정 생성
async function signUp(){
    setRegisterStatusInProgress();
    const { validationResult , form : requestBody } = buildValidatedRegisterForm();

    if(!validationResult){
        setRegisterStatusInProgress(false);
        return;
    }

    try {
        await registerMember(requestBody);
        registerSuccess();
    } catch(error){
        registerExceptionHandler.handle(error, {context :'registerMember'});
        setRegisterStatusInProgress(false);
    }
}

function moveToLoginPage(){
    location.href = '/login';
}

// 계성 생성 성공 후 처리
function registerSuccess(){
    setTimeout(() =>{
        document.querySelector('#form-box').remove(); // 계정 생성 form box 제거
        document.querySelector('#result-box').classList.remove('hide'); // 생성 완료 box 보임
    }, 1500);
}

// 계정 생성 처리 중 UI 변경
function setRegisterStatusInProgress(isInProgress = true){
    const btnRegister = document.querySelector('#btn-register');
    const btnBackToLogin = document.querySelector('#btn-back-to-login');

    [btnRegister, btnBackToLogin].forEach((btn) => {
        btn.classList.toggle('in-progress', isInProgress);
    })
}