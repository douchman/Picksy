import {apiRequest} from "../../global/api/api.js";
import {ApiMethod} from "../../global/api/api-method.js";

// 대결 주제 검색
export async function searchTopics(requestParams){
    const { status, data : topicSearchResult, isAuthOrNetworkException} = await fetchTopicsSearch(requestParams);

    if(isAuthOrNetworkException) return null;

    if( status === 200 && topicSearchResult ){ return topicSearchResult }

    return null;
}

// 대결 주제 검색 API fetch
async function fetchTopicsSearch(requestParams){
    return await apiRequest('topics', ApiMethod.GET, requestParams);
}
