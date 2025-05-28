import {ApiMethod} from "./api-method.js";
import {API_URL} from "../const/const.js";
import {ApiResponseException, FetchNetworkException} from "./exception/ApiException.js";
import {UserAuthException} from "../exception/GlobalException.js";

export async function apiRequest(endPoint, method, requestBody, hasFiles = false){

    const apiRequestConfig = generateApiRequestConfig(method, requestBody, hasFiles);
    const apiRequestUrl = generateApiRequestURL(endPoint, method, requestBody);

    let status = null;
    let jsonResponse = {};
    let response;
    try {

        response = await fetch(apiRequestUrl, apiRequestConfig);
        status = response.status;
        jsonResponse = await response.json();

    } catch(error) {
        throw new FetchNetworkException(); // fetch network exception
    }

    if (!response.ok) {
        if(isAuthException(status)){ // ⚠️ 인증 관련 오류 ⚠️
            throw new UserAuthException(jsonResponse.message, status, jsonResponse.errorCode); // user auth exception
        }
        throw new ApiResponseException(status, jsonResponse.errorCode, jsonResponse.message);
    }

    return jsonResponse?.data ?? jsonResponse;
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
function isAuthException(status){
    return (status === 401 || status === 403);
}