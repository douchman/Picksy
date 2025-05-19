import {checkAuthMember, memberLogout} from "../../../js/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const isAuth = await checkMemberAuthState();
    renderHeaderForAuthState(isAuth);
});

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
        await memberLogout();
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

async function checkMemberAuthState(){
    const {auth : isAuth} = await checkAuthMember();
    return isAuth;
}