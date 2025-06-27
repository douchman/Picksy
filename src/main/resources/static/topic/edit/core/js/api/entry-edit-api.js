import {apiRequest} from "../../../../../global/api/api.js";
import {createdTopic} from "../const/const.js";
import {ApiMethod} from "../../../../../global/api/api-method.js";

// 대결주제 생성
export async function createEntries(topicId, requestBody){
    return await apiRequest(`topics/${createdTopic.getId()}/entries`, ApiMethod.POST, requestBody, false);
}

// 엔트리 조회
export async function getEntryList(topicId){
    return await apiRequest(`topics/${topicId}/entries`, ApiMethod.GET,{}, false);
}

// 엔트리 업데이트
export async function modifyEntries(topicId, requestBody){
    return await apiRequest(`topics/${topicId}/entries`, ApiMethod.PATCH, requestBody, false);
}