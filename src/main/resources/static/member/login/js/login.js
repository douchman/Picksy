import {memberLogin} from "./login-api.js";
import {LoginExceptionHandler} from "./exception/login-exception-handler.js";

const loginExceptionHandler = new LoginExceptionHandler();

document.addEventListener("DOMContentLoaded", async () => {
    setupLoginPage();
});

function setupLoginPage(){
    addLoginPageEvents();
}

function addLoginPageEvents(){
    // 로그인 버튼 이벤트
    document.querySelector('#btn-login').addEventListener('click', login);

    // 계정생성 버튼 이벤트
    document.querySelector('#btn-register').addEventListener('click', moveToRegisterPage);

    // 패스워드 입력란 key down 이벤트
    document.querySelector('#password').addEventListener('keydown', async function(event){
        const keyEvent = event.key;
        if( keyEvent === 'Enter'){
            await login();
        }
    });
}

async function login(){
    const id = document.querySelector('#id').value;
    const password = document.querySelector('#password').value;

    if( validateLoginForm(id, password)){
        let loginResult;
        try{
            loginResult = await memberLogin({id, password});
            if(loginResult){
                location.href = '/';
            }
        }catch(error){
            loginExceptionHandler.handle(error, {context : 'userLogin'});
        }
    }
}

function moveToRegisterPage(){
    location.href='/register';
}

function validateLoginForm(id, password){
    if( !id || id === ''){
        showMessage('아이디를 입력해주세요');
        return false;
    }

    if(!password || password ==='' ){
        showMessage('비밀번호를 입력해주세요');
        return false;
    }

    return true;
}

function showMessage(message){
    document.querySelector('#alert-message').textContent = message;
    document.querySelector('#message-box').classList.add('show');
}
