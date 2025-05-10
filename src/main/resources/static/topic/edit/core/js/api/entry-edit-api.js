import {apiRequest} from "../../../../../global/api/api.js";
import {createdTopic} from "../const/const.js";
import {ApiMethod} from "../../../../../global/api/api-method.js";

// 대결주제 생성
export async function createEntries(topicId, requestBody){
    const {status, data : entriesCreateResult, isAuthOrNetworkException } = await fetchCreateEntries(topicId, requestBody);

    if( isAuthOrNetworkException ) return null;

    if( status === 200 && entriesCreateResult ){ return entriesCreateResult; }

    return null;
}

// 엔트리 생성 API fetch
async function fetchCreateEntries(topicId, requestBody){
    return await apiRequest(`topics/${createdTopic.getId()}/entries`, ApiMethod.POST, requestBody, true);
}

// 엔트리 조회
export async function getEntryList(topicId){
    const { status, data : entryListResult, isAuthOrNetworkException } = await fetchEntryList(topicId);

    if( isAuthOrNetworkException ) return null;

    if(status === 200 && entryListResult ){ return entryListResult; }

    return null;
}

// 엔트리 리스트 조회 API fetch
async function fetchEntryList(topicId){
    return await apiRequest(`topics/${topicId}/entries`, ApiMethod.GET,{}, false);
}