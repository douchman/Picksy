import {checkAuthMember} from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const requiresAuth = document.body.dataset.requireAuth === 'true';

    if( requiresAuth ){
        await redirectIfNotAuthenticated();
    }
});

async function redirectIfNotAuthenticated(){
    const {status ,  data : {auth : isAuth}} = await checkAuthMember()

    if( status === 200 && !isAuth ) location.href = '/login';
}