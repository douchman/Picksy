import { API_URL } from './const.js';

export async function apiGetRequest( endpoint, options = {}, withAuth = true) {
    const baseOptions = {
        method : 'GET',
        cache : 'no-cache',
        credentials : 'include',
        headers : withAuth
            ? { "Authorization" : "{jwt}"}
            : {}
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

export async function apiPostRequest( endpoint, options = {}, withAuth = true) {
    const baseOptions = {
        method : 'POST',
        cache : 'no-cache',
        credentials : 'include',
        headers : withAuth
            ? { "Authorization" : "{jwt}"}
            : {}
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
