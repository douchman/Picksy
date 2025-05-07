import {apiRequest} from "../api/api.js";
import {ApiMethod} from "../api/api-method.js";
import {renderCommonAlertMessage} from "../alert/js/common-alert-message.js";

// 유저 인증 여부 검사
export async function checkAuthMember(){
    const {status, data : checkResult , isAuthOrNetworkException} = await fetchAuthMemberCheck();

    if( isAuthOrNetworkException ){ return null;}

    if( status === 200 && checkResult){
        return checkResult;
    }

    renderCommonAlertMessage('회원정보 확인 불가', '회원정보 확인이 불가능합니다. 다시 로그인 후 이용해 주세요.', () =>{location.href = '/login'});
    return null;
}

// 유저 로그아웃
export async function memberLogout(){
    const {status, data : logoutResult, isAuthOrNetworkException} = await fetchMemberLogout();
    if( isAuthOrNetworkException ){ return null;}

    if( status === 200 && logoutResult){
        alert('안전하게 로그아웃 되었습니다 :) ');
        location.href = '/login';
    }
}

async function fetchAuthMemberCheck(){
    return await apiRequest('member/auth', ApiMethod.GET, {});
}

async function fetchMemberLogout(){
    return await apiRequest('member/logout', ApiMethod.POST, {});
}
