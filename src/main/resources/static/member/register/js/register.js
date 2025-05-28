import {postMember} from "./register-api.js";
import {RegisterExceptionHandler} from "./exception/register-exception-handler.js";
import {buildValidatedRegisterForm} from "./register-form-data-builder";

const registerExceptionHandler = new RegisterExceptionHandler();

document.addEventListener('DOMContentLoaded', async () => {

    document.querySelector('#btn-register').addEventListener('click', async () => {
        await registerMember();
    });

    document.querySelector('#btn-back-to-login').addEventListener('click', () => {
        location.href = '/login';
    });
});

async function registerMember(){

    const { validationResult , form : requestBody } = buildValidatedRegisterForm();

    try {
        if( validationResult ){
            await postMember(requestBody);
            alert('가입이 완료되었습니다.') // 임시
        }
    } catch(error){
        registerExceptionHandler.handle(error, {context :'registerMember'});
    }
}
