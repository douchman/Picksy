import {apiRequest} from "../../../../../global/api/api.js";
import {ApiMethod} from "../../../../../global/api/api-method.js";

// 대결주제 신규 생성
export async function createTopic(requestBody){
    return apiRequest('topics', ApiMethod.POST, requestBody, true);
}

// 생성되어있는 대결주제 업데이트
export async function updateTopic(topicId, requestBody){
    return apiRequest(`topics/${topicId}`, ApiMethod.POST, requestBody, true);
}

// 대결주제 상세 정보 조회
export async function getTopicDetail(topicId){
    return apiRequest(`topics/${topicId}`, ApiMethod.GET, {}, false);
}