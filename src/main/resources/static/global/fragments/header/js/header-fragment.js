import {checkAuthMember, memberLogout} from "../../../auth/auth.js";
import {AuthExceptionHandler} from "../../../auth/exception/auth-exception-handler.js";
import {showToastMessage} from "../../../toast-message/js/common-toast-message.js";

const authExceptionHandler = new AuthExceptionHandler();

document.addEventListener("DOMContentLoaded", async () => {
    const isAuth = await checkMemberAuthState();
    addHeaderTitleEvent();
    renderHeaderForAuthState(isAuth);
});

function addHeaderTitleEvent(){
    document.querySelector('#header-title').addEventListener('click', function(){
        location.href = '/index';
    });
}

function renderHeaderForAuthState(isAuth) {
    if ( isAuth ){
        applyAuthenticatedHeaderUI();
    }
}

function applyAuthenticatedHeaderUI(){
    removeLoginButton();
    setupLogoutButton();
    setupMyTopicsButton();
}

function removeLoginButton(){
    document.querySelector('#move-login-page').remove();
}

function setupLogoutButton(){
    renderLogoutButton();
    addLogoutButtonEvent();
}

function renderLogoutButton(){
    const logoutButton = `<button id="btn-logout" class="btn-logout" type="button">로그아웃</button>`;
    document.querySelector('#right-nav-group').insertAdjacentHTML('beforeend', logoutButton);
}

function addLogoutButtonEvent(){
    document.querySelector('#btn-logout').addEventListener('click', async () => {
        await logout();
    });
}

function setupMyTopicsButton(){
    renderMyTopicsButton();
}

function renderMyTopicsButton(){
    const centerNavGroup = document.querySelector('#center-nav-group');
    const myTopicButton = `<a id="btn-my-topic" class="nav" href="/topic/my">내가 만든 대결주제</a>`
    centerNavGroup.insertAdjacentHTML('beforeend', myTopicButton);
}

function applyNotAuthenticatedHeaderUI(){
    renderLoginButton();
    removeMyTopicsButton();
    removeLogoutButton();
}

function renderLoginButton(){
    const loginButton = '<a id="move-login-page" class="move-login-page" href="/login">로그인</a>';
    document.querySelector('#right-nav-group').insertAdjacentHTML('beforeend', loginButton);
}

function removeMyTopicsButton(){
    const myTopicsButton = document.querySelector('#btn-my-topic');
    if(myTopicsButton) myTopicsButton.remove();
}

function removeLogoutButton(){
    document.querySelector('#btn-logout').remove();
}

async function checkMemberAuthState(){
    try {
        const {auth : isAuth} = await checkAuthMember();
        return isAuth;
    } catch (error) {
        authExceptionHandler.handle(error, {context : 'checkAuthState'});
        return false;
    }
}

async function logout(){
    try {
        await memberLogout();
        applyNotAuthenticatedHeaderUI();
        showToastMessage({
            title : '로그아웃',
            content : '로그아웃 되었습니다 :)'
        });
    } catch(error){
        authExceptionHandler.handle(error, {context : 'logout'});
    }
}