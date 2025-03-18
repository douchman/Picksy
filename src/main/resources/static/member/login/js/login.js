import {apiPostRequest} from "../../../global/js/api.js";

document.addEventListener("DOMContentLoaded", async () => {


    document.querySelector('#btn-login').addEventListener('click', async function(){
        const id = document.querySelector('#id').value;
        const password = document.querySelector('#password').value;

        if( validateLoginForm(id, password)){
            const {status, data: loginResult } = await memberLogin({id, password});

            if( status !== 200 ) {
                showMessage(loginResult.message);
            } else {
                location.href = '/index';
            }
        }
    });

    document.querySelector('#btn-register').addEventListener('click', () =>{
       location.href='/register';
    });

    document.querySelector('#password').addEventListener('keydown', function(event){
        const keyEvent = event.key;

        if( keyEvent === 'Enter'){
            document.querySelector('#btn-login').click();
        }
    });

});

async function memberLogin(requestBody){
    return await apiPostRequest('member/login', {}, requestBody);
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

function hideMessage(){
    document.querySelector('#alert-message').textContent = '';
    document.querySelector('#message-box').classList.remove('show');
}