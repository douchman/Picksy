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

/**
 * 로컬스토리지에 저장된 대결진행관련 식별자 모두 비우기
 */
export function flushPlayRecordIdsFromLocalStorage(){
    const keysToDelete = [];

    for( let i = 0; i< localStorage.length; i++){
        const key = localStorage.key(i);
        if( key && key.startsWith('topic-') && key.endsWith('-playRecord-id')){
            keysToDelete.push(key);
        }
    }

    keysToDelete.forEach( key => localStorage.removeItem(key));
}