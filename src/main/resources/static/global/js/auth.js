import {apiGetRequest, apiPostRequest} from "./api.js";

export async function checkAuthMember(){
    return await apiGetRequest('member/auth', {}, true);
}

export async function memberLogout(){
    return await apiPostRequest('member/logout', {}, true);
}
