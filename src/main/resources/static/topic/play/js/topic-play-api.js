import {apiRequest} from "../../../global/api/api.js";
import {ApiMethod} from "../../../global/api/api-method.js";

// 대결주제 상세정보 조회
export async function getTopicDetail(topicId){
    const {status, data : topicDetailResult, isAuthOrNetworkException}= await fetchTopicDetail(topicId);

    if( isAuthOrNetworkException ) return null;

    if( status === 200 && topicDetailResult ){ return topicDetailResult; }

    return null;
}

// 대결주제 상세정보 API fetch
async function fetchTopicDetail(topicId){
    return await apiRequest(`topics/${topicId}`, ApiMethod.GET, {}, false);
}

// 진행 할 대결 정보 조회
export async function getCurrentEntryMatch(playRecordId){
    const {status, data : currentEntryMatchResult, isAuthOrNetworkException} =  await fetchCurrentEntryMatch(playRecordId);

    if( isAuthOrNetworkException ) return null;

    if( status === 200 && currentEntryMatchResult ){ return currentEntryMatchResult; }

    return null;
}

// 진행 할 대결조회 API fetch
async function fetchCurrentEntryMatch(playRecordId){
    return await apiRequest(`topics/play-records/${playRecordId}/matches`, ApiMethod.GET, {}, false);
}
