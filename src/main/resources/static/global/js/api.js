import { API_URL } from './const.js';

export async function apiGetRequest( endpoint, options = {}, body, withAuth = true) {
    const baseOptions = {
        method : 'GET',
        cache : 'no-cache',
        credentials : 'include',
        headers : withAuth
            ? { "Authorization" : "{jwt}"}
            : {},
        body : body ? body : {}
    }

    const mergedOptions = { ... baseOptions, ... options}

    try {

        const response = await fetch(API_URL + endpoint, mergedOptions);
        const jsonResponse = await response.json();
        return jsonResponse?.data ?? jsonResponse;

    } catch (error){
        console.error('API Request Error :' , error);
        throw error;
    }
}

export async function apiPostRequest( endpoint, options = {}, body, withAuth = true) {
    const baseOptions = {
        method : 'POST',
        cache : 'no-cache',
        credentials : 'include',
        headers : {
            'Content-Type' : 'application/json',
            ...( withAuth && { "Authorization" : "{jwt}"})
            },
        body : body ? JSON.stringify(body) : {}
    }

    const mergedOptions = { ... baseOptions, ... options}

    try {

        const response = await fetch(API_URL + endpoint, mergedOptions);
        const status = response.status;
        const jsonResponse = await response.json();
        return {status : status, data : jsonResponse?.data ?? jsonResponse};

    } catch (error){
        console.error('API Request Error :' , error);
        throw error;
    }
}
