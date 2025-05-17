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
        setupMyTopics();
    } else {
        removeMyTopicsButton();
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

function setupMyTopics(){
    renderMyTopicsButton();
}

function renderMyTopicsButton(){
    const centerNavGroup = document.querySelector('#center-nav-group');
    const myTopicButton = `<a id="btn-my-topic" class="nav" href="/topic/my">내가 만든 대결주제</a>`
    centerNavGroup.insertAdjacentHTML('beforeend', myTopicButton);
}

function removeMyTopicsButton(){
    const myTopicButton = document.querySelector('#btn-mt-topic');
    if(myTopicButton ) myTopicButton.remove();
}