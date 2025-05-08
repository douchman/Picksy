import {apiRequest} from "../../../../global/api/api.js";
import {ApiMethod} from "../../../../global/api/api-method.js";
import {getTopicId} from "./const.js";

export async function createTopic(requestBody){
    const {status, data : topicCreateResult, isAuthOrNetworkException} = await fetchCreateTopic(requestBody)

    if(isAuthOrNetworkException) return null;
    if( status === 200 && topicCreateResult ){ return topicCreateResult }
    return null;
}

export async function updateTopic(requestBody){
    const {status, data : topicUpdateResult, isAuthOrNetworkException} = await fetchUpdateTopic(requestBody)

    if(isAuthOrNetworkException) return null;

    if ( status === 200 && topicUpdateResult ){ return topicUpdateResult }

    return null;
}

async function fetchCreateTopic(requestBody) {
    return apiRequest('topics', ApiMethod.POST, requestBody, true);
}

async function fetchUpdateTopic(requestBody){
    return apiRequest(`topics/${getTopicId()}`, ApiMethod.PATCH, requestBody, true);
}