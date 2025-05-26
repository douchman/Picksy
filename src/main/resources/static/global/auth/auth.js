import {apiRequest} from "../api/api.js";
import {ApiMethod} from "../api/api-method.js";

// 유저 인증 여부 검사
export async function checkAuthMember(){
    return await apiRequest('member/auth', ApiMethod.GET, {});
}

// 유저 로그아웃
export async function memberLogout(){
    return await apiRequest('member/logout', ApiMethod.POST, {});
}
