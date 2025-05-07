import {checkAuthMember, memberLogout} from "../../../js/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    await toggleLoginAndLogoutButton();
});

async function toggleLoginAndLogoutButton() {
    const {auth : isAuth} = await checkAuthMember()

    if ( isAuth ){
        removeLoginButton();
        renderLogoutButton();
        addLogoutButtonEvent();
    }
}

function removeLoginButton(){
    document.querySelector('#move-login-page').remove();
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