import {checkAuthMember} from "./auth/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const requiresAuth = document.body.dataset.requireAuth === 'true';

    if( requiresAuth ){
        await redirectIfNotAuthenticated();
    }
});

async function redirectIfNotAuthenticated(){
    const {auth : isAuth} = await checkAuthMember();
    if( !isAuth ) location.href = '/login';
}