import {apiRequest} from "../../../../../global/api/api.js";
import {ApiMethod} from "../../../../../global/api/api-method.js";

// 대결주제 신규 생성
export async function createTopic(requestBody){
    const {status, data : topicCreateResult, isAuthOrNetworkException} = await fetchCreateTopic(requestBody)

    if(isAuthOrNetworkException) return null;
    if( status === 200 && topicCreateResult ){ return topicCreateResult }
    return null;
}

// 생성되어있는 대결주제 업데이트
export async function updateTopic(topicId, requestBody){
    const {status, data : topicUpdateResult, isAuthOrNetworkException} = await fetchUpdateTopic(topicId, requestBody)

    if(isAuthOrNetworkException) return null;

    if ( status === 200 && topicUpdateResult ){ return topicUpdateResult }

    return null;
}

// 대결주제 생성 API fetch
async function fetchCreateTopic(requestBody) {
    return apiRequest('topics', ApiMethod.POST, requestBody, true);
}

// 대결주제 업데이트 API fetch
async function fetchUpdateTopic(topicId, requestBody){
    return apiRequest(`topics/${topicId}`, ApiMethod.PATCH, requestBody, true);
}

// 대결주제 상세 정보 조회
export async function getTopicDetail(topicId){
    const {status, data : topicDetailResult, isAuthOrNetworkException} = await fetchTopicDetailForModify(topicId);

    if(isAuthOrNetworkException) return null;

    if( status === 200 && topicDetailResult ){ return topicDetailResult }

    return null;
}

// 대결주제 상세 정보 조회 API fetch
async function fetchTopicDetailForModify(topicId){
    return apiRequest(`topics/${topicId}/edit-info`, ApiMethod.GET, {}, false);
}