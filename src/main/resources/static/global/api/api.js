import {ApiMethod} from "./api-method.js";
import {API_URL} from "../js/const.js";
import {ApiExceptionHandler} from "./exception/api-exception-handler.js";
import {FetchNetworkException} from "./exception/ApiException.js";
import {UserAuthException} from "../exception/GlobalException.js";

const apiExceptionHandler = new ApiExceptionHandler();

export async function apiRequest(endPoint, method, requestBody, hasFiles = false){

    const apiRequestConfig = generateApiRequestConfig(method, requestBody, hasFiles);
    const apiRequestUrl = generateApiRequestURL(endPoint, method, requestBody);

    let status = null;
    let jsonResponse = {};
    let isAuthOrNetworkException = false;
    try {

        const response = await fetch(apiRequestUrl, apiRequestConfig);
        status = response.status;
        jsonResponse = await response.json();

        if (!response.ok && isAuthException(status, jsonResponse.errorCode)) {
            isAuthOrNetworkException = true;
            // ⚠️ 인증 오류시 핸들러에서 처리 ⚠️
            apiExceptionHandler.handle(new UserAuthException(jsonResponse.message, status));
        }

    } catch(error) {
        jsonResponse = {};
        isAuthOrNetworkException = true;
        if( error instanceof UserAuthException){
            apiExceptionHandler.handle(error);
        } else {
            apiExceptionHandler.handle(new FetchNetworkException(error));
        }

    }

    return {status, data : jsonResponse?.data ?? jsonResponse, isAuthOrNetworkException};

}

// api 요청 주소 생성
function generateApiRequestURL(endPoint, method, requestBody){
    if( method === ApiMethod.GET){
        const queryString = new URLSearchParams(requestBody).toString();
        return queryString ? `${API_URL + endPoint}?${queryString}` : `${API_URL + endPoint}`
    }
    return `${API_URL + endPoint}`;
}

// Api 요청 설정 값 생성
function generateApiRequestConfig(method, requestBody, hasFiles){
    let config = {};
    const apiRequestBaseConfig = {
        method : method,
        cache : 'no-cache',
        credentials : 'include'
    }

    if(ApiMethod.isJsonRequest(method) ){
        if ( hasFiles ){
            config = {
                body : requestBody,
            }
        } else {
            config = {
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : requestBody ? JSON.stringify(requestBody) : {}
            }
        }
    }

    return { ... apiRequestBaseConfig, ... config };
}

// 인증 관련 오류 검증
function isAuthException(status, errorCode){
    return ((status === 401 && errorCode === 'UNAUTHORIZED') || status === 403);
}