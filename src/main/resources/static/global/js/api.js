import { API_URL } from './const.js';
import {renderCommonAlertMessage} from "../alert/js/common-alert-message.js";

const defaultErrorMessage = `네트워크 연결이 원활하지 않습니다.<br>잠시 후 다시 시도해 주세요.`;

export async function apiGetRequest( endpoint, options = {}, params = {}) {
    const baseOptions = {
        method : 'GET',
        cache : 'no-cache',
        credentials : 'include'
    }

    const queryString = new URLSearchParams(params).toString();

    const fullUrl = queryString ? `${API_URL + endpoint}?${queryString}` : `${API_URL + endpoint}`;

    const mergedOptions = { ... baseOptions, ... options}

    let response;
    let status = 500;
    let jsonResponse = {};

    try {
        response = await fetch(fullUrl, mergedOptions);
        status = response.status;
        jsonResponse = await response.json();

        if( !response.ok && isAuthException(status, jsonResponse.errorCode)) {
            handleAuthException(status);
            return;
        }
    } catch (error){
        console.error('API Request Error :' , error);
        renderCommonAlertMessage('네트워트 연결 오류', defaultErrorMessage);
        jsonResponse = {}; // 안전하게 기본 값 재설정
    }


    return {status : status, data : jsonResponse?.data ?? jsonResponse};
}

export async function apiPostRequest( endpoint, options = {}, body) {


    const baseOptions = {
        method : 'POST',
        cache : 'no-cache',
        credentials : 'include',
        headers : {
            'Content-Type' : 'application/json'
            },
        body : body ? JSON.stringify(body) : {}
    }

    const mergedOptions = { ... baseOptions, ... options}

    let response;
    let status = 500;
    let jsonResponse = {};

    try {
        response = await fetch(API_URL + endpoint, mergedOptions);
        status = response.status;
        jsonResponse = await response.json();

        if( !response.ok && isAuthException(status, jsonResponse.errorCode)) {
            handleAuthException(status);
        }
    } catch (error){
        console.error('API Request Error :' , error);
        renderCommonAlertMessage("네트워크 연결 오류", defaultErrorMessage);
        jsonResponse = {}; // 안전하게 기본 값 재설정
    }

    return {status : status, data : jsonResponse?.data ?? jsonResponse};
}


export async function apiFormDataRequest( endpoint, options = {}, body) {

    const baseOptions = {
        method : 'POST',
        cache : 'no-cache',
        credentials : 'include'
    }
    let requestBody ;

    requestBody = body; // must formData

    const mergedOptions = {
        ...baseOptions,
        ...options,
        body: requestBody,
    };

    let response;
    let status = 500;
    let jsonResponse = {};

    try {
        response = await fetch(API_URL + endpoint, mergedOptions);
        status = response.status;
        jsonResponse = await response.json();

        if( !response.ok && isAuthException(status, jsonResponse.errorCode)) {
            handleAuthException(status);
        }
    } catch (error){
        console.error('API Request Error :' , error);
        renderCommonAlertMessage("네트워크 연결 오류", defaultErrorMessage);
        jsonResponse = {}; // 안전하게 기본 값 재설정
    }

    return {status : status, data : jsonResponse?.data ?? jsonResponse};
}


function isAuthException(status = 200, errorCode){
    return ((status === 401 && errorCode === 'UNAUTHORIZED') || status === 403);
}

function handleAuthException(status){
    if( status === 401){
        renderCommonAlertMessage('회원 이용 기능', '로그인이 필요한 기능입니다.', () => {location.href ='/login'});
    } else if ( status === 403){
        renderCommonAlertMessage('권한 없음', '이용권한이 없습니다.', () => {loacation.href = '/'});
    }
}
